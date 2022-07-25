# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
from frappe import _
import frappe.www.list

no_cache = 1

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)

	context.current_user = frappe.get_doc("User", frappe.session.user)
	context.show_sidebar=True
	context.doctype = 'Property'
	context.params = frappe.local.form_dict
	context.properties = frappe.get_list('Property', fields=['*'])
	context.property_highlights_list = frappe.get_all('Property Highlights',  fields=['*'])
	


def get_property_list(doctype,  txt=None, filters=None, limit_start=0, limit_page_length=20, order_by=None):
    property_type = filters.type or frappe.utils.escape_html(frappe.local.form_dict.type or frappe.local.form_dict.type)
    q = {}
    if property_type:
        q['type'] = property_type
    
    return frappe.db.get_list('Property', fields=['*'], filters=q)
 
def get_highlights(property_name, start=0, search=None, item_status=None):
	filters = {"project": property_name}
	if search:
		filters["subject"] = ("like", "%{0}%".format(search))
	tasks = frappe.get_all("Task", filters=filters,fields=["name",
			"subject",
			"status",
			"modified",
			"_assign",
			"exp_end_date",
			"is_group",
			"parent_task",
		],
		limit_start=start,
		limit_page_length=10,
	)