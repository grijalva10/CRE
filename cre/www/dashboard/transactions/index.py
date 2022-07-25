# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
from frappe import _
import frappe.www.list

no_cache = 1

def get_context(context, **dict_params):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)

	context.current_user = frappe.get_doc("User", frappe.session.user)
	context.show_sidebar=True
	context.hide_name_field = True
	
	context.doctype = 'Transaction'
	context.title = 'Transactions'
	context.subtitle = ''
	context.list_view_settings = frappe.get_doc('List View Settings', context.doctype).as_dict()
	
	if context.list_view_settings:
		context.list_view_settings = context.list_view_settings['fields']
	
	context.meta = frappe.get_meta('Transaction').as_dict()
	# if context.list_view_settings:
	# 	fields = context.list_view_settings.as_dict().get('fields')
	# 	context.list_view_fields = fields
		
	# context.list_view_no_name = True
	# context.fns = [df.get('fieldname') for df in context.list_view_settings]
	# context.fls = [df.get('label') for df in context.list_view_settings]
	
	# if context.list_view_no_name:
	# 	context.fns.pop(0)
	# 	context.fls.pop(0)
	
	# if not context.fns:
	# 	context.fns = ['*']
	context.doc_list = frappe.get_list('Transaction', fields=['*'])
	
	