import frappe
from frappe import _
import frappe.www.list
from frappe.www.list import get_list_data

no_cache = True

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)
	
	context.show_sidebar = False
	context.query_params = frappe.request.environ.get('QUERY_STRING')
	context.properties = frappe.get_all('Listing', fields=['*'])
	context.property_types = frappe.get_all('Property Type', pluck='Name')
	context.properties_count = len(context.properties)
	context.meta = frappe.get_meta('Listing')