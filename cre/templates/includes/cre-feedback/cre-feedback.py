# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE
from __future__ import unicode_literals

import frappe

from frappe import _
from frappe.rate_limiter import rate_limit
from frappe.website.doctype.blog_settings.blog_settings import get_feedback_limit

@frappe.whitelist(allow_guest=True)
@rate_limit(key='reference_name', limit=get_feedback_limit, seconds=60*60)
def give_feedback(reference_doctype, reference_name, like):
	like = frappe.parse_json(like)
	ref_doc = frappe.get_doc(reference_doctype, reference_name)


	filters = {
		"owner": frappe.session.user,
		"reference_doctype": reference_doctype,
		"reference_name": reference_name
	}
	d = frappe.get_all('CRE Feedback', filters=filters, limit=1)
	if d:
		doc = frappe.get_doc('CRE Feedback', d[0].name)
	else:
		doc = doc = frappe.new_doc('CRE Feedback')
		doc.reference_doctype = reference_doctype
		doc.reference_name = reference_name
		doc.ip_address = frappe.local.request_ip
	doc.like = like
	doc.save(ignore_permissions=True)

	subject = _('CRE Feedback on {0}: {1}').format(reference_doctype, reference_name)
	send_mail(doc, subject)
	return doc

def send_mail(feedback, subject):
	doc = frappe.get_doc(feedback.reference_doctype, feedback.reference_name)
	if feedback.like:
		message = "<p>Hey, </p><p>You have received a ❤️ heart on your blog post <b>{0}</b></p>".format(feedback.reference_name)
	else:
		return

	# notify creator
	frappe.sendmail(
		recipients=frappe.db.get_value('User', doc.owner, 'email') or doc.owner,
		subject=subject,
		message=message,
		reference_doctype=doc.doctype,
		reference_name=doc.name
	)
