import frappe
from frappe import _
import frappe.www.list
from frappe.www.list import get_list_data

no_cache = True

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)
	
	context.dashboards = frappe.db.get_all('Dashboard', fields=['*'])
	context.projects = frappe.db.get_all('Project', fields=['*'])
	context.workspaces = frappe.db.get_all('Workspace', fields=['*'])


		
