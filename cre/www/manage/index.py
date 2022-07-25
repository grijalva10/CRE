# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
from frappe import _
import frappe.www.list

from frappe.desk.notifications import get_notifications
from frappe.desk.form.linked_with import get_linked_docs
from frappe.desk.form.load import getdoc

no_cache = 1

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)

	context.current_user = frappe.get_doc("User", frappe.session.user)
	context.notifications = frappe.desk.notifications.get_notifications()
	context.contact = frappe.get_all('Contact', filters={'email_id': frappe.session.user}, fields=['*'])
	context.account = frappe.desk.form.linked_with.get_linked_docs('User', frappe.session.user)
	context.investor_account = frappe.desk.form.load.getdoc('User', frappe.session.user)
	context.workspaces = frappe.get_doc('Workspace', 'CRE')
	
	context.show_sidebar=True
	
	# frappe.desk
	# from frappe.desk.form.linked_with
	# def toggle_like(doctype, name, add=False):
	
	
	# from frappe.desk.form.utils
	# def add_comment(reference_doctype, reference_name, content, comment_email, comment_by)
	# def update_comment(name, content):
	# def get_next(doctype, value, prev, filters=None, sort_order='desc', sort_field='modified'):
	
	# from frappe.desk.form.document_follow
	# def follow_document(doctype, doc_name, user):
	# def unfollow_document(doctype, doc_name, user):
	# def get_follow_users(doctype, doc_name):
	
	# from frappe.website.doctype.web_page_view
	# def make_view_log(path, referrer=None, browser=None, version=None, url=None, user_tz=None):
	
	# from frappe.social.doctype.energy_point_log
	# def get_energy_points(user):
	
	# from frappe.contacts.doctype.contact
	# def invite_user(contact):
	# def get_contact_details(contact):
	
	# from frappe.core.doctype.user
	# def has_email_account(email):
	# def get_email_awaiting(user):
	# def sign_up(email, full_name, redirect_to):
	# def generate_keys(user):
	# def switch_theme(theme):
	# ["Dark", "Light", "Automatic"]

   # @frappe.whitelist()
# def new_todo(description):
# 	frappe.get_doc({
# 		'doctype': 'ToDo',
# 		'description': description
# 	}).insert()
