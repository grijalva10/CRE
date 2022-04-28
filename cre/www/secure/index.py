import frappe
from frappe import _
import frappe.www.list
from frappe.www.list import get_list_data

no_cache = True

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page.  Please login or register"), frappe.PermissionError)
	
	context.listings = frappe.get_all('Listing', fields=['*'])
	context.show_sidebar = True
	


		
