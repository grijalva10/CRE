frappe.pages["pipeline"].on_page_load = (wrapper) => {
	var me = this;

	//activity
	frappe.ui.make_app_page({
		parent: wrapper,
		single_column: false
	});

	me.page = wrapper.page;
	me.page.set_title(__("Leads"));

	// $(wrapper).bind('show', () => {

	// 	// Get which leaderboard to show
	// 	let doctype = frappe.get_route()[1];
	// 	console.log(doctype)
	// 	frappe.leaderboard.show_leaderboard(doctype);
	// });
	frappe.set_route("pipeline", 'lead');
	frappe.model.with_doctype("Lead", function() {
		me.page.list = new JMGList({
			doctype: 'Lead',
			parent: wrapper
		});
	});
	// frappe.leaderboard = new Leaderboard(wrapper);
	// var me = this;

	// frappe.ui.make_app_page({
	// 	parent: wrapper,
	// 	single_column: false
	// });

	// me.page = wrapper.page;

	// let page = new JMGList(wrapper);

	// $(wrapper).bind('show', ()=> {
	// 	// Get which leaderboard to show
	// 	let doctype = frappe.get_route()[1];
	// 	// frappe.leaderboard.show_leaderboard(doctype);
	// 	// page.show();
	// });
};

class Leaderboard {

	constructor(parent) {
		frappe.ui.make_app_page({
			parent: parent,
			title: __("Pipeline"),
			single_column: false,
			card_layout: true,
		});

		this.parent = parent;
		this.page = this.parent.page;
		this.page.sidebar.html(`<ul class="standard-sidebar leaderboard-sidebar overlay-sidebar"></ul>`);
		this.$sidebar_list = this.page.sidebar.find('ul');

		this.get_leaderboard_config();

	}

	get_leaderboard_config() {
		this.doctypes = [];
		this.filters = {};
		this.leaderboard_limit = 20;

		frappe.xcall("frappe.desk.page.leaderboard.leaderboard.get_leaderboard_config").then(config => {
			this.leaderboard_config = config;
			console.log(this.leaderboard_config);
			for (let doctype in this.leaderboard_config) {
				this.doctypes.push(doctype);
				this.filters[doctype] = this.leaderboard_config[doctype].fields.map(field => {
					if (typeof field === 'object') {
						return field.label || field.fieldname;
					}
					return field;
				});
			}

			// For translation. Do not remove this
			// __("This Week"), __("This Month"), __("This Quarter"), __("This Year"),
			//	__("Last Week"), __("Last Month"), __("Last Quarter"), __("Last Year"),
			//	__("All Time"), __("Select From Date")
			this.timespans = [
				"This Week", "This Month", "This Quarter", "This Year",
				"Last Week", "Last Month", "Last Quarter", "Last Year",
				"All Time", "Select Date Range"
			];

			// for saving current selected filters
			const _initial_doctype = frappe.get_route()[1] || this.doctypes[0];
			const _initial_timespan = this.timespans[0];
			const _initial_filter = this.filters[_initial_doctype];

			this.options = {
				selected_doctype: _initial_doctype,
				selected_filter: _initial_filter,
				selected_filter_item: _initial_filter[0],
				selected_timespan: _initial_timespan,
			};

			this.message = null;
			this.make();
		});
	}

	make() {

		this.$container = $(`<div class="leaderboard page-main-content">
			<div class="leaderboard-graph"></div>
			<div class="leaderboard-list"></div>
		</div>`).appendTo(this.page.main);

		this.$graph_area = this.$container.find(".leaderboard-graph");

		this.doctypes.map(doctype => {
			const icon = this.leaderboard_config[doctype].icon;
			this.get_sidebar_item(doctype, icon).appendTo(this.$sidebar_list);
		});

		this.setup_leaderboard_fields();

		this.render_selected_doctype();

		this.render_search_box();

		// Get which leaderboard to show
		let doctype = frappe.get_route()[1];
		this.show_leaderboard(doctype);

	}

	setup_leaderboard_fields() {
		this.company_select = this.page.add_field({
			fieldname: "company",
			label: __("Company"),
			fieldtype: "Link",
			options: "Company",
			default: frappe.defaults.get_default("company"),
			reqd: 1,
			change: (e) => {
				this.options.selected_company = e.currentTarget.value;
				this.make_request();
			}
		});

		this.timespan_select = this.page.add_select(__("Timespan"),
			this.timespans.map(d => {
				return { "label": __(d), value: d };
			})
		);
		this.create_date_range_field();

		this.type_select = this.page.add_select(__("Field"),
			this.options.selected_filter.map(d => {
				return { "label": __(frappe.model.unscrub(d)), value: d };
			})
		);

		this.timespan_select.on("change", (e) => {
			this.options.selected_timespan = e.currentTarget.value;
			if (this.options.selected_timespan === 'Select Date Range') {
				this.date_range_field.show();
			}
			else {
				this.date_range_field.hide();
			}
			this.make_request();
		});

		this.type_select.on("change", (e) => {
			this.options.selected_filter_item = e.currentTarget.value;
			this.make_request();
		});
	}

	create_date_range_field() {
		let timespan_field = $(this.parent).find(`.frappe-control[data-original-title="${__('Timespan')}"]`);
		this.date_range_field = $(`<div class="from-date-field"></div>`).insertAfter(timespan_field).hide();

		let date_field = frappe.ui.form.make_control({
			df: {
				fieldtype: 'DateRange',
				fieldname: 'selected_date_range',
				placeholder: __("Date Range"),
				default: [frappe.datetime.month_start(), frappe.datetime.now_date()],
				input_class: 'input-xs',
				reqd: 1,
				change: () => {
					this.selected_date_range = date_field.get_value();
					if (this.selected_date_range) this.make_request();
				}
			},
			parent: $(this.parent).find('.from-date-field'),
			render_input: 1
		});
	}

	render_selected_doctype() {

		this.$sidebar_list.on("click", "li", (e) => {
			let $li = $(e.currentTarget);
			let doctype = $li.find(".doctype-text").attr("doctype-value");

			this.options.selected_company = frappe.defaults.get_default("company");
			this.options.selected_doctype = doctype;
			this.options.selected_filter = this.filters[doctype];
			this.options.selected_filter_item = this.filters[doctype][0];

			this.type_select.empty().add_options(
				this.options.selected_filter.map(d => {
					return { "label": __(frappe.model.unscrub(d)), value: d };
				})
			);
			if (this.leaderboard_config[this.options.selected_doctype].company_disabled) {
				$(this.parent).find("[data-original-title=Company]").hide();
			}
			else {
				$(this.parent).find("[data-original-title=Company]").show();
			}

			this.$sidebar_list.find("li").removeClass("active selected");
			$li.addClass("active selected");

			frappe.set_route("pipeline", this.options.selected_doctype);
			this.make_request();
		});
	}

	render_search_box() {

		this.$search_box =
			$(`<div class="leaderboard-search form-group col-md-3">
				<input type="text" placeholder=${ __("Search") } data-element="search" class="form-control leaderboard-search-input input-xs">
			</div>`);

		$(this.parent).find(".page-form").append(this.$search_box);
	}

	show_leaderboard(doctype) {
		if (this.doctypes.length) {
			if (this.doctypes.includes(doctype)) {
				this.options.selected_doctype = doctype;
				this.$sidebar_list.find(`[doctype-value = "${this.options.selected_doctype}"]`).trigger("click");
			}

			this.$search_box.find(".leaderboard-search-input").val("");
			frappe.set_route("pipeline", this.options.selected_doctype);
		}
	}

	make_request() {

		frappe.model.with_doctype(this.options.selected_doctype, () => {
			this.get_leaderboard(this.get_leaderboard_data);
		});
	}

	get_leaderboard(notify) {
		if (!this.options.selected_company) {
			frappe.throw(__("Please select Company"));
		}
		frappe.call(
			this.leaderboard_config[this.options.selected_doctype].method, {
				'date_range': this.get_date_range(),
				'company': this.options.selected_company,
				'field': this.options.selected_filter_item,
				'limit': this.leaderboard_limit,
			}
		).then(r => {
			let results = r.message || [];

			let graph_items = results.slice(0, 10);

			this.$graph_area.show().empty();

			const custom_options = {
				data: {
					datasets: [{ values: graph_items.map(d => d.value) }],
					labels: graph_items.map(d => d.name)
				},
				format_tooltip_x: d => d[this.options.selected_filter_item],
				height: 140
			};
			frappe.utils.make_chart('.leaderboard-graph', custom_options);

			notify(this, r);
		});
	}

	get_leaderboard_data(me, res) {
		if (res && res.message.length) {
			me.message = null;
			me.$container.find(".leaderboard-list").html(me.render_list_view(res.message));
			frappe.utils.setup_search($(me.parent), ".list-item-container", ".list-id");
		}
		else {
			me.$graph_area.hide();
			me.message = __("No Items Found");
			me.$container.find(".leaderboard-list").html(me.render_list_view());
		}
	}

	render_list_view(items = []) {

		var html =
			`${this.render_message()}
			<div class="result" style="${this.message ? "display: none;" : ""}">
				${this.render_result(items)}
			</div>`;

		return $(html);
	}

	render_result(items) {

		var html =
			`${this.render_list_header()}
			${this.render_list_result(items)}`;
		return html;
	}

	render_list_header() {
		const _selected_filter = this.options.selected_filter
			.map(i => frappe.model.unscrub(i));
		const fields = ["rank", "name", this.options.selected_filter_item];
		const filters = fields.map(filter => {
			const col = __(frappe.model.unscrub(filter));
			return (
				`<div class="leaderboard-item list-item_content ellipsis text-muted list-item__content--flex-2
					header-btn-base ${filter}
					${(col && _selected_filter.indexOf(col) !== -1) ? "text-right" : ""}">
					<span class="list-col-title ellipsis">
						${col}
					</span>
				</div>`
			);
		}).join("");

		const html =
			`<div class="list-headers">
				<div class="list-item" data-list-renderer="List">${filters}</div>
			</div>`;
		return html;
	}

	render_list_result(items) {

		let _html = items.map((item, index) => {
			const $value = $(this.get_item_html(item, index + 1));
			const $item_container = $(`<div class="list-item-container">`).append($value);
			return $item_container[0].outerHTML;
		}).join("");

		let html =
			`<div class="result-list">
				<div class="list-items">
					${_html}
				</div>
			</div>`;

		return html;
	}

	render_message() {
		const display_class = this.message ? '' : 'hide';
		let html = `<div class="leaderboard-empty-state ${display_class}">
			<div class="no-result text-center">
				<img src="/assets/frappe/images/ui-states/search-empty-state.svg"
					alt="Empty State"
					class="null-state"
				>
				<div class="empty-state-text">${this.message}</div>
			</div>
		</div>`;
		return html;
	}

	get_item_html(item, index) {
		const fields = this.leaderboard_config[this.options.selected_doctype].fields;
		const value = frappe.format(item.value, fields.find(field => {
			let fieldname = field.fieldname || field;
			return fieldname === this.options.selected_filter_item;
		}));

		const link = `/app/${frappe.router.slug(this.options.selected_doctype)}/${item.name}`;
		const name_html = item.formatted_name ?
			`<span class="text-muted ellipsis list-id">${item.formatted_name}</span>` :
			`<a class="grey list-id ellipsis" href="${link}"> ${item.name} </a>`;
		const html =
			`<div class="list-item">
				<div class="list-item_content ellipsis list-item__content--flex-2 rank text-center">
					<span class="text-muted ellipsis">${index}</span>
				</div>
				<div class="list-item_content ellipsis list-item__content--flex-2 name">
					${name_html}
				</div>
				<div class="list-item_content ellipsis list-item__content--flex-2 value text-right">
					<span class="text-muted ellipsis">${value}</span>
				</div>
			</div>`;

		return html;
	}

	get_sidebar_item(item, icon) {
		let icon_html = icon ? frappe.utils.icon(icon, 'md') : '';
		return $(`<li class="standard-sidebar-item">
			<span>${icon_html}</span>
			<a class="sidebar-link">
				<span class="doctype-text" doctype-value="${item}">${ __(item) }</span>
			</a>
		</li>`);
	}

	get_date_range() {
		let timespan = this.options.selected_timespan.toLowerCase();
		let current_date = frappe.datetime.now_date();
		let date_range_map = {
			"this week": [frappe.datetime.week_start(), frappe.datetime.week_end()],
			"this month": [frappe.datetime.month_start(), frappe.datetime.month_end()],
			"this quarter": [frappe.datetime.quarter_start(), frappe.datetime.quarter_end()],
			"this year": [frappe.datetime.year_start(), frappe.datetime.year_end()],
			"last week": [frappe.datetime.add_days(current_date, -7), current_date],
			"last month": [frappe.datetime.add_months(current_date, -1), current_date],
			"last quarter": [frappe.datetime.add_months(current_date, -3), current_date],
			"last year": [frappe.datetime.add_months(current_date, -12), current_date],
			"all time": null,
			"select date range": this.selected_date_range || [frappe.datetime.month_start(), current_date]
		}
		return date_range_map[timespan];
	}

}

class JMGList extends frappe.views.ListView {
	static load_last_view() {
		const route = frappe.get_route();
		console.log(route)
		const doctype = 'Lead';

		if (route.length === 2) {
			const user_settings = frappe.get_user_settings(doctype);
			const last_view = user_settings.last_view;
			frappe.set_route(
				"list",
				frappe.router.doctype_layout || doctype,
				frappe.views.is_valid(last_view) ? last_view.toLowerCase() : "list"
			);
			return true;
		}
		return false;
	}
	constructor(opts) {
		super(opts);
		this.show();
	}

	setup_defaults() {
		super.setup_defaults();

		this.page_title = __('Lead');
		this.doctype = 'Lead';
		this.view = "List";
		// initialize with saved order by
		this.sort_by = this.view_user_settings.sort_by || "modified";
		this.sort_order = this.view_user_settings.sort_order || "desc";

		// build menu items
		this.menu_items = this.menu_items.concat(this.get_menu_items());

		// set filters from view_user_settings or list_settings
		if (
			this.view_user_settings.filters &&
			this.view_user_settings.filters.length
		) {
			// Priority 1: view_user_settings
			const saved_filters = this.view_user_settings.filters;
			this.filters = this.validate_filters(saved_filters);
		}
		else {
			// Priority 2: filters in listview_settings
			this.filters = (this.settings.filters || []).map((f) => {
				if (f.length === 3) {
					f = [this.doctype, f[0], f[1], f[2]];
				}
				return f;
			});
		}

		if (this.view_name == 'List') this.toggle_paging = true;

		this.patch_refresh_and_load_lib();
		return this.get_list_view_settings();
		// this.method = 'frappe.desk.page.activity.activity.get_feed';

	}

	// setup_filter_area() {
	// 	//
	// }

	// setup_view_menu() {
	// 	//
	// }

	// setup_sort_selector() {

	// }

	// setup_side_bar() {
	// 	if (this.hide_sidebar || !frappe.boot.desk_settings.list_sidebar) return;
	// 	this.list_sidebar = new JMGListSidebar({
	// 		doctype: this.doctype,
	// 		stats: this.stats,
	// 		parent: this.$page.find(".layout-side-section"),
	// 		// set_filter: this.set_filter.bind(this),
	// 		page: this.page,
	// 		list_view: this,
	// 	});
	// 	// this.list_sidebar.sidebar.add(`<ul class="list-unstyled sidebar-menu"></ul>`)
	// 	// console.log(this.list_sidebar.sidebar);



	// }

	get_args() {
		return {
			start: this.start,
			page_length: this.page_length,
			doctype: this.doctype
		};
	}

	update_data(r) {
		let data = r.message || [];

		if (this.start === 0) {
			this.data = data;
		}
		else {
			this.data = this.data.concat(data);
		}


	}
	// 	get_list_view_settings() {
	// 	return frappe
	// 		.call("frappe.desk.listview.get_list_settings", {
	// 			doctype: this.doctype,
	// 		})
	// 		.then((doc) => (this.list_view_settings = doc.message || {}));
	// }
	// 	render() {
	// 	this.data.map(value => {
	// 		const row = $('<div class="list-row">').data("data", value).appendTo(this.$result).get(0);
	// 		new Feed(row, value);
	// 	});
	// }

};
