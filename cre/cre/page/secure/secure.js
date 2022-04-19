frappe.pages['secure'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Secure',
		single_column: false
	});
	
	page.add_menu_item('Send Email', () => open_email_dialog());
	page.add_action_item('Delete', () => delete_items());
	let $btn = page.set_primary_action('New', () => create_new(), 'octicon octicon-plus');
	page.set_indicator('Pending', 'orange');
	page.add_sidebar_item('Portfolio', () => go_to_portfolio_list());
	frappe.breadcrumbs.add('HR');
	page.add_menu_item("Portfolio",() => go_to_portfolio_list());

	
}

function go_to_portfolio_list() {
            frappe.set_route('List', 'Portfolio', 'List');
        }