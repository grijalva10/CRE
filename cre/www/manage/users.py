# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import frappe
from frappe import _
import frappe.www.list

from frappe.desk.notifications import get_notifications
from frappe.desk.form.linked_with import get_linked_docs
from frappe.desk.form.load import getdoc
from frappe.desk.listview import get_list_settings

no_cache = 1

def get_context(context, **dict_params):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)
	
	context.paramgs = dict_params
	frappe.local.form_dict.update(dict_params)
	doctype = 'Property'
	context.parents = [{"route":"me", "title":_("My Account")}]
	context.meta = frappe.get_meta(doctype)
	# context.update(get_list_context(context, doctype) or {})
	context.doctype = doctype
	context.txt = frappe.local.form_dict.txt
	# context.update(get(**frappe.local.form_dict))
	
	context.current_user = frappe.get_doc("User", frappe.session.user)
	context.doctype = 'User'
	context.list_view_settings = frappe.get_doc('List View Settings', context.doctype)
	context.doc_list = frappe.get_list(context.doctype, fields=['*'])
	context.notifications = frappe.desk.notifications.get_notifications()
	# context.meta = frappe.get_meta('User')
	context.list_settings = get_list_settings('User')
	# context.template = "www/list.html"

	
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

def get_list_view_settings(doctype):
	meta = frappe.get_meta(doctype)
	path = frappe.get_module_path(frappe.scrub(meta.module), "doctype", frappe.scrub(meta.name), frappe.scrub(meta.name) + ".json")
	doctype_json = frappe.get_file_json(path)

	fields = [f.get("fieldname") for f in doctype_json.get("fields") if f.get("in_list_view")]

	if meta.title_field:
		if not meta.title_field.strip() in fields:
			fields.append(meta.title_field.strip())

	return fields
