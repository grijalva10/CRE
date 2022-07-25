import frappe
from cre.investorexp import get_comments
def get_context(context):
    context.name = frappe.form_dict.name
    context.doctype = 'Property'
    context.doc = frappe.get_doc(context.doctype, context.name)
    context.no_breadcrumbs = False
    context.show_sidebar = True
    context.likes = frappe.db.get_value(context.doctype, context.name, '_liked_by')
    context.user = frappe.session.user
    if context.user in context.likes:
    	context.user_liked = 1
    else:
    	context.user_liked = 0
    
    cm_filters = {'comment_type': 'Comment',
    	'reference_doctype': context.doctype,
    	'reference_name': context.name
    }
    context.new_comments = frappe.db.get_all('Comment', filter=cm_filters)
    context.comments = []
    
    for comment in get_comments(context.doctype, context.name, 0, context.user):
    	comment_data = comment.get('data')
    	if comment_data.get('by'):
    		context.comments.append(comment)
    

    # context.comments = [c for c in get_comments(context.doctype, context.name, 0, context.user) if 'by' in c.keys() ]
    
    load_feedback(context)
    
def load_feedback(context):
		user = frappe.session.user

		feedback = frappe.get_all('CRE Feedback',
			fields=['like'],
			filters=dict(
				reference_doctype=context.doctype,
				reference_name=context.name,
				ip_address=frappe.local.request_ip,
				owner=user
			)
		)

		like_count = 0

		if frappe.db.count('CRE Feedback'):
			like_count = frappe.db.count('CRE Feedback',
				filters = dict(
					reference_doctype = context.doctype,
					reference_name = context.name,
					like = True
				)
			)

		context.user_feedback = feedback[0] if feedback else ''
		context.like_count = like_count


