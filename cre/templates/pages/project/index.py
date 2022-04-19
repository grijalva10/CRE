import frappe
from frappe import _
import frappe.www.list
from frappe.www.list import get_list_data

def get_context(context):
    context.show_sidebar = True
    project_name = frappe.form_dict.name
    project = frappe.get_doc("Project", project_name)
    context.project = project
    context.tasks = frappe.get_list("Task", fields=['*'], filters={'project': project_name})
    