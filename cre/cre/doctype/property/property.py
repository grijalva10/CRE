# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Property(Document):
    
    def get_context(self, context):
        context.no_breadcrumbs = True
        context.show_sidebar = True

def get_list_context(context=None):
    list_context = frappe._dict(get_list = get_property_list,
    filters = {'type': frappe.form_dict.type},
    no_breadcrumbs = True,
    hide_filters = False,
    show_search = True,
    title = "Commercial Properties For Sale",
    no_cache = True,
    temp_args= frappe.form_dict)
    
    return list_context

def get_property_list(doctype,  txt=None, filters=None, limit_start=0, limit_page_length=20, order_by=None):
    property_type = filters.type or frappe.utils.escape_html(frappe.local.form_dict.type or frappe.local.form_dict.type)
    q = {}
    if property_type:
        q['type'] = property_type
    
    return frappe.db.get_list('Property', fields=['*'], filters=q)