import frappe
from frappe import _
import frappe.www.list
from frappe.www.list import get_list_data

def get_context(context):
    context.show_sidebar = True
    portfolio_name = frappe.form_dict.name
    portfolio = frappe.get_doc("Portfolio", portfolio_name)
    context.portfolio = portfolio
    context.doctype = frappe.get_doc('DocType', 'Portfolio')
    print(context.doctype)
    # context.tasks = frappe.get_list("Task", fields=['*'], filters={'portfolio': name})
    