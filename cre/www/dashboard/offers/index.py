# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
from frappe import _
import frappe.www.list
from frappe.desk.reportview import get

no_cache = 1

def get_context(context, **dict_params):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)

	context.params = frappe.local.form_dict
	context.doctype = 'Offer'
	context.window_title = 'My Offers'
	context.title = 'Offers'
	context.subtitle = 'Offers submitted through the marketplace or crafted by your account advisor will apear here.'

	context.current_user = frappe.get_doc("User", frappe.session.user)
	context.show_sidebar=True
	context.hide_name_field = True
	

	context.list_view_settings = frappe.get_doc('List View Settings', context.doctype)
	if context.list_view_settings:
		context.list_view_settings = context.list_view_settings.as_dict()
	
	if context.list_view_settings:
		context.list_view_settings = context.list_view_settings['fields']
	
	context.meta = frappe.get_meta(context.doctype).as_dict()
	context.fields = context.meta.get('fields')
	context.fields_in_list_view = [f for f in context.fields if f.get('in_list_view')]
	context.fields_in_filter = [f for f in context.fields if f.get('in_filter')]
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
	# doctype, filters, or_filters, fields, order_by, group_by, start, page_length
	order_by, start, page_length, group_by = {}, {}, {}, {}
	
	if 'order_by' in context.params:
		order_by = context.params.pop('order_by')
	
	
	#  order_by='date desc',
	filters = context.params
	context.doc_list = frappe.get_list(context.doctype,
									   filters=filters,
									   fields=['*'],
									   order_by=order_by,
									   group_by=group_by,
									   start=start,
									   page_length=page_length)