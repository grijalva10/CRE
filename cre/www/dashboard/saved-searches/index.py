# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
from frappe import _
import frappe.www.list

no_cache = 1

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)
	
	context.no_breadcrumbs = True
	context.show_sidebar=False
	context.web_vertical=True

	context.current_user = frappe.get_doc("User", frappe.session.user)
	context.saved_searches = frappe.db.get_list('List Filter', filters={'reference_doctype': 'Property', 'for_user': frappe.session.user}, fields=['*'])
