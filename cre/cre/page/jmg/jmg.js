frappe.pages['jmg'].on_page_load = function(wrapper) {

	let jmg_page = new JMGPage(wrapper);
	// let page = frappe.ui.make_app_page({
	// 	parent: wrapper,
	// 	title: 'JMG',
	// 	single_column: false
	// });
	// frappe.breadcrumbs.add("JMG Menu")

	// frappe.modules_page = page;

	// let get_sidebar_html = () => {
	// 	let sidebar_items = [];
	// 	var sidebar_items_html = '';
	// 	frappe.call({
	// 		method: 'cre.cre.page.jmg.jmg.get_menu_details',
	// 		async: false,

	// 		callback: function(menu_items) {
	// 			sidebar_items = menu_items.message;
	// 			//var a=r.message[0]
	// 			console.log(menu_items);

	// 			sidebar_items.forEach(function(item, index) {

	// 				var item_html = `<li class="standard-sidebar-item">
	// 				<span><svg class="icon  icon-md" style="">
	// 				<use class="" href="#icon-${item.icon}"></use></svg></span>
	// 				<a class="sidebar-link">
	// 				<span class="doctype-text" doctype-value="${item.doc}">${item.label}</span>
	// 					</a>
	// 				</li>`;
	// 				sidebar_items_html += item_html;
	// 			});
	// 			console.log(sidebar_items_html);
	// 			page.sidebar.html(`<ul class="standard-sidebar leaderboard-sidebar overlay-sidebar">
	// 				${sidebar_items_html}
	// 			</ul>`);
	// 		}
	// 	});
	// };

	// // render sidebar
	// page.sidebar.html(get_sidebar_html());




	// // render main
	// frappe.model.with_doctype("Lead", function() {
	// 	page.list = new JMGList({
	// 		doctype: 'Lead',
	// 		parent: wrapper
	// 	});
	// });


};

frappe.pages['jmg'].on_page_show = function(wrapper) {
	$("body").attr("data-sidebar", 1);

}

class JMGPage {

	constructor(parent) {
		let page = frappe.ui.make_app_page({
			parent: parent,
			title: 'JMG',
			single_column: false
		});

		this.get_doctypes();

		frappe.breadcrumbs.add("JMG Menu")

		frappe.modules_page = page;


		// for saving current selected filters
		const _initial_doctype = frappe.get_route()[1] || this.doctypes[0];

		this.options = {
			selected_doctype: _initial_doctype
		};
		
		this.render_sidebar(page, _initial_doctype);

		this.render_list(page);



	}


	get_doctypes() {
		let sidebar_items = [];
		frappe.call({
			method: 'cre.cre.page.jmg.jmg.get_menu_details',
			async: false,

			callback: function(menu_items) {
				sidebar_items = menu_items.message;
				//var a=r.message[0]
				this.doctypes = sidebar_items;
			}
		});
		
		console.log(sidebar_items)
		return sidebar_items

	}

	render_sidebar(page, doctypes) {
		let sidebar_items = doctypes;
		var sidebar_items_html = '';
		sidebar_items.forEach(function(item, index) {
			var item_html = `<li class="standard-sidebar-item">
					<span><svg class="icon  icon-md" style="">
					<use class="" href="#icon-${item.icon}"></use></svg></span>
					<a class="sidebar-link">
					<span class="doctype-text" doctype-value="${item.doc}">${item.label}</span>
						</a>
					</li>`;
			sidebar_items_html += item_html;
		});
		console.log(sidebar_items_html);
		page.sidebar.html(`<ul class="standard-sidebar leaderboard-sidebar overlay-sidebar">
					${sidebar_items_html}
				</ul>`);


		console.log(this.doctypes)
		// render sidebar
		// .page.sidebar.html(get_sidebar_html());

	}

	render_list(page) {
		// render main
		frappe.model.with_doctype(this.options.selected_doctype, function() {
			page.list = new JMGList({
				doctype: 'Lead',
				parent: page.parent
			});
		});

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
		this.opts = opts;
		this.show();
	}


	setup_defaults() {
		super.setup_defaults();

		this.page_title = __(this.opts.selected_doctype.toUpperCase());
		this.doctype = this.opts.selected_doctype;
		this.view = "List";
		this.hide_sidebar = true;
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
		frappe.set_route("jmg", this.doctype.toLowerCase());

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
