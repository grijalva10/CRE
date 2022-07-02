import frappe
from frappe.utils import get_fullname

@frappe.whitelist()
def get_sidebar_menu():
    return frappe.get_all('JMG Menu', fields=['*'])