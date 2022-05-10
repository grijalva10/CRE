# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt
import json
import frappe
import frappe.sessions
from frappe.model.document import Document
from frappe.utils import *


@frappe.whitelist(allow_guest=True)
def account():
    saved_searches = frappe.db.get_list('List Filter', filters={'reference_doctype': 'Property', 'for_user': frappe.session.user}, fields=['*'])
    account = {'user': frappe.get_doc('User', frappe.session.user, fields=['*'])}
    
    return account


@frappe.whitelist(allow_guest=True)
def search():
    listings = frappe.db.get_list('Listing',  fields=['*'])
    return listings