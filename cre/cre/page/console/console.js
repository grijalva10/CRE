//import ListFilter from './list_filter';


// frappe.pages['console'].on_page_load = function (wrapper) {
// 	frappe.require('user_profile_controller.bundle.js', () => {
// 		let user_profile = new frappe.ui.UserProfile(wrapper);
// 		user_profile.show();
// 	});
// };

// frappe.pages["console"].on_page_load = (wrapper) => {
// 	let page = new JMGListView(wrapper);
// 	page.show();
// };



frappe.pages["console"].on_page_load = (wrapper) => {

	//let $btn = wrapper.set_primary_action('New', () => create_new(), 'octicon octicon-plus')
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
	frappe.set_route("console", 'lead');
	frappe.model.with_doctype("Lead", function() {
		me.page.list = new JMGList({
			doctype: 'Lead',
			parent: wrapper
		});
	});

};

class JMGListSidebar extends frappe.views.ListSidebar {
	constructor(opts) {
		super(opts);
		$.extend(this, opts);
		this.make();
	}

	make() {
		var sidebar_content = frappe.render_template("jmg_list_sidebar", { doctype: this.doctype });

		this.sidebar = $('<div class="list-sidebar overlay-sidebar hidden-xs hidden-sm"></div>')
			.html(sidebar_content)
			.appendTo(this.page.sidebar.empty());

		this.setup_list_filter();
		this.setup_list_group_by();
		this.setup_list_nav();

		// do not remove
		// used to trigger custom scripts
		$(document).trigger('list_sidebar_setup');

		if (this.list_view.list_view_settings && this.list_view.list_view_settings.disable_sidebar_stats) {
			this.sidebar.find('.list-tags').remove();
		}
		else {
			this.sidebar.find('.list-stats').on('click', (e) => {
				this.reload_stats();
			});
		}

	}

	setup_views() {
		var show_list_link = false;

		if (frappe.views.calendar[this.doctype]) {
			this.sidebar.find('.list-link[data-view="Calendar"]').removeClass("hide");
			this.sidebar.find('.list-link[data-view="Gantt"]').removeClass('hide');
			show_list_link = true;
		}
		//show link for kanban view
		this.sidebar.find('.list-link[data-view="Kanban"]').removeClass('hide');
		if (this.doctype === "Communication" && frappe.boot.email_accounts.length) {
			this.sidebar.find('.list-link[data-view="Inbox"]').removeClass('hide');
			show_list_link = true;
		}

		if (frappe.treeview_settings[this.doctype] || frappe.get_meta(this.doctype).is_tree) {
			this.sidebar.find(".tree-link").removeClass("hide");
		}

		this.current_view = 'List';
		var route = frappe.get_route();
		if (route.length > 2 && frappe.views.view_modes.includes(route[2])) {
			this.current_view = route[2];

			if (this.current_view === 'Kanban') {
				this.kanban_board = route[3];
			}
			else if (this.current_view === 'Inbox') {
				this.email_account = route[3];
			}
		}

		// disable link for current view
		this.sidebar.find('.list-link[data-view="' + this.current_view + '"] a')
			.attr('disabled', 'disabled').addClass('disabled');

		//enable link for Kanban view
		this.sidebar.find('.list-link[data-view="Kanban"] a, .list-link[data-view="Inbox"] a')
			.attr('disabled', null).removeClass('disabled');

		// show image link if image_view
		if (this.list_view.meta.image_field) {
			this.sidebar.find('.list-link[data-view="Image"]').removeClass('hide');
			show_list_link = true;
		}

		if (this.list_view.settings.get_coords_method ||
			(this.list_view.meta.fields.find(i => i.fieldname === "latitude") &&
				this.list_view.meta.fields.find(i => i.fieldname === "longitude")) ||
			(this.list_view.meta.fields.find(i => i.fieldname === 'location' && i.fieldtype == 'Geolocation'))) {
			this.sidebar.find('.list-link[data-view="Map"]').removeClass('hide');
			show_list_link = true;
		}

		if (show_list_link) {
			this.sidebar.find('.list-link[data-view="List"]').removeClass('hide');
		}
	}

	setup_reports() {
		// add reports linked to this doctype to the dropdown
		var me = this;
		var added = [];
		var dropdown = this.page.sidebar.find('.reports-dropdown');
		var divider = false;

		var add_reports = function(reports) {
			$.each(reports, function(name, r) {
				if (!r.ref_doctype || r.ref_doctype == me.doctype) {
					var report_type = r.report_type === 'Report Builder' ?
						`List/${r.ref_doctype}/Report` : 'query-report';

					var route = r.route || report_type + '/' + (r.title || r.name);

					if (added.indexOf(route) === -1) {
						// don't repeat
						added.push(route);

						if (!divider) {
							me.get_divider().appendTo(dropdown);
							divider = true;
						}

						$('<li><a href="#' + route + '">' +
							__(r.title || r.name) + '</a></li>').appendTo(dropdown);
					}
				}
			});
		};

		// from reference doctype
		if (this.list_view.settings.reports) {
			add_reports(this.list_view.settings.reports);
		}

		// Sort reports alphabetically
		var reports = Object.values(frappe.boot.user.all_reports).sort((a, b) => a.title.localeCompare(b.title)) || [];

		// from specially tagged reports
		add_reports(reports);
	}

	// setup_list_filter() {
	// 	this.list_filter = new ListFilter({
	// 		wrapper: this.page.sidebar.find('.list-filters'),
	// 		doctype: this.doctype,
	// 		list_view: this.list_view
	// 	});
	// }

	setup_kanban_boards() {
		const $dropdown = this.page.sidebar.find('.kanban-dropdown');
		frappe.views.KanbanView.setup_dropdown_in_sidebar(this.doctype, $dropdown);
	}


	setup_keyboard_shortcuts() {
		this.sidebar.find('.list-link > a, .list-link > .btn-group > a').each((i, el) => {
			frappe.ui.keys
				.get_shortcut_group(this.page)
				.add($(el));
		});
	}

	setup_list_group_by() {
		this.list_group_by = new frappe.views.ListGroupBy({
			doctype: this.doctype,
			sidebar: this,
			list_view: this.list_view,
			page: this.page
		});
	}

	setup_list_nav() {
		this.add_nav_item('User', 'User', 'users')
		this.add_nav_item('Lead', 'Lead', 'users')
		this.add_nav_item('Property', 'Property', 'organization')
		console.log(this.sidebar.menu);
	}

	add_nav_item(doctype, label, icon) {
		this.sidebar.menu = this.sidebar.find(".leaderboard-sidebar");
		var html = `<li class="standard-sidebar-item active">
			<span><svg class="icon  icon-md" style="">
			<use class="" href="#icon-${icon}"></use>
		</svg></span>
			<a class="sidebar-link">
				<span class="doctype-text" doctype-value="${doctype}">${label}</span>
			</a>
		</li>`
		this.sidebar.menu.append(html);

	}

	get_stats() {
		var me = this;
		frappe.call({
			method: 'frappe.desk.reportview.get_sidebar_stats',
			type: 'GET',
			args: {
				stats: me.stats,
				doctype: me.doctype,
				// wait for list filter area to be generated before getting filters, or fallback to default filters
				filters: (me.list_view.filter_area ? me.list_view.get_filters_for_args() : me.default_filters) || []
			},
			callback: function(r) {
				let stats = (r.message.stats || {})["_user_tags"] || [];
				me.render_stat(stats);
				let stats_dropdown = me.sidebar.find('.list-stats-dropdown');
				frappe.utils.setup_search(stats_dropdown, '.stat-link', '.stat-label');
			}
		});
	}

	render_stat(stats) {
		let args = {
			stats: stats,
			label: __("Tags")
		};

		let tag_list = $(frappe.render_template("list_sidebar_stat", args)).on("click", ".stat-link", (e) => {
			let fieldname = $(e.currentTarget).attr('data-field');
			let label = $(e.currentTarget).attr('data-label');
			let condition = "like";
			let existing = this.list_view.filter_area.filter_list.get_filter(fieldname);
			if (existing) {
				existing.remove();
			}
			if (label == "No Tags") {
				label = "%,%";
				condition = "not like";
			}
			this.list_view.filter_area.add(
				this.doctype,
				fieldname,
				condition,
				label
			);
		});

		this.sidebar.find(".list-stats-dropdown .stat-result").html(tag_list);
	}

	reload_stats() {
		this.sidebar.find(".stat-link").remove();
		this.sidebar.find(".stat-no-records").remove();
		this.get_stats();
	}
};


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

	setup_side_bar() {
		if (this.hide_sidebar || !frappe.boot.desk_settings.list_sidebar) return;
		this.list_sidebar = new JMGListSidebar({
			doctype: this.doctype,
			stats: this.stats,
			parent: this.$page.find(".layout-side-section"),
			// set_filter: this.set_filter.bind(this),
			page: this.page,
			list_view: this,
		});
		// this.list_sidebar.sidebar.add(`<ul class="list-unstyled sidebar-menu"></ul>`)
		// console.log(this.list_sidebar.sidebar);



	}

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
