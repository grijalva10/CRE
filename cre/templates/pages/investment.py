import frappe
def get_context(context):
    investment_name = frappe.form_dict.name
    investment = frappe.get_doc("Investment Log", investment_name)
    context.doc = investment
    context.no_breadcrumbs = False
    context.show_sidebar = False
