import frappe

def get_context(context):
	# do your magic here
	context.current_user = frappe.get_doc("User", frappe.session.user)
	context.show_sidebar=True
	context.sidebar_items = frappe.get_hooks("portal_menu_items")