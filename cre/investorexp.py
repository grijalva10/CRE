# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt
import json
import frappe
import frappe.sessions
from frappe.model.document import Document
from frappe.utils import *
from frappe.desk.form.utils import add_comment

import frappe.desk.form.document_follow


@frappe.whitelist(allow_guest=True)
def account():
    saved_searches = frappe.db.get_list('List Filter', filters={'reference_doctype': 'Property', 'for_user': frappe.session.user}, fields=['*'])
    account = {'user': frappe.get_doc('User', frappe.session.user, fields=['*'])}
    
    return account

@frappe.whitelist(allow_guest=True)
def new_comment(reference_doctype, reference_name, content, comment_email, comment_by):
     return add_comment(reference_doctype=reference_doctype,
     reference_name=reference_name,
     content=content,
     comment_email=comment_email,
     comment_by=comment_by)
     
@frappe.whitelist(allow_guest=True)
def delete_comment(comment_id):
    if frappe.db.exists("Comment", {"name": comment_id}):
        return frappe.db.delete("Comment", {"name": comment_id })

     
@frappe.whitelist(allow_guest=True)
def get_comments(doctype, doc_name, frequency, user):
    return frappe.desk.form.document_follow.get_comments(doctype, doc_name, frequency, user)

@frappe.whitelist(allow_guest=True)
def search():
    listings = frappe.db.get_list('Listing',  fields=['*'])
    return listings