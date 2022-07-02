import frappe
from frappe import _
import frappe.www.list
from frappe.www.list import get_list_data

no_cache = True

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)
	
	context.show_sidebar = True
	context.projects = frappe.db.get_all('Project', fields=['*'])