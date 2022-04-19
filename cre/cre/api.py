# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt
import json
import frappe
import frappe.sessions
from frappe.model.document import Document
from frappe.utils import *


@frappe.whitelist(allow_guest=True)
def get_user_email():
    return frappe.get_doc('User', frappe.session.user).email

@frappe.whitelist(allow_guest=True)
def delete_all_markets():
    out=frappe.db.delete('Market', {'property_class_name': 'Industrial'})
    frappe.db.commit()
    return out

@frappe.whitelist(allow_guest=True)
def new_lead(first_name, last_name, email, cell_phone):
    if not frappe.db.exists({"doctype": "Lead", "email_id": email}):
        doc = frappe.get_doc({'doctype': 'Lead','first_name': first_name, 'last_name': last_name, 'email_id': email, 'mobile_no': cell_phone })
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return doc
    else:
        return True
    