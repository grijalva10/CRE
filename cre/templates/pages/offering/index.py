import frappe
from frappe import _
import frappe.www.list
from frappe.www.list import get_list_data

def get_context(context):
    context.show_sidebar = False
    offering_name = frappe.form_dict.name
    offering = frappe.get_doc("Offering", offering_name)
    context.offering = offering
    context.file = frappe.get_doc('File', offering.file)
