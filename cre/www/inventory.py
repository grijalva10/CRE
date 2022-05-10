# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
from frappe import _
import frappe.www.list

no_cache = 1

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)
	
	context.body_class = "listings-page"
	context.parents = [{"name": frappe._("Home"), "route": "/"}]

	context.current_user = frappe.get_doc("User", frappe.session.user)
	context.show_sidebar=True
	context.users = frappe.get_list('User', fields=['*'])
	context.listings = frappe.get_list('Listing', fields=['*'])