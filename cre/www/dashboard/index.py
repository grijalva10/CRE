import frappe
from frappe import _
import frappe.www.list
from frappe.www.list import get_list_data
from frappe.utils import cint
from frappe.core.doctype.activity_log.feed import get_feed_match_conditions

no_cache = True

def get_context(context):
	if frappe.session.user=='Guest':
		frappe.throw(_("You need to be logged in to access this page"), frappe.PermissionError)
	
	context.show_sidebar = False
	context.dashboards = frappe.db.get_all('Dashboard', fields=['*'])
	context.portfolios = frappe.db.get_all('Portfolio', fields=['*'])
	context.properties = frappe.db.get_all('Property', fields=['*'])
	context.projects = frappe.db.get_all('Project', fields=['*'])
	context.workspaces = frappe.db.get_all('Workspace', fields=['*'])
	context.users = frappe.db.get_all('Workspace', fields=['*'])
	context.project_meta = frappe.get_meta('Project')
	context.customer = 'Craig Elliott'
	context.todos = get_todos(1, 20)
	context.web_vertical = False


@frappe.whitelist()

def get_todos(start, page_length):
	todos = frappe.db.get_list('ToDo', fields=['*'], filters={'allocated_to': frappe.session.user}, start=start, page_length=page_length)
	return todos
	
@frappe.whitelist()
def get_feed(start, page_length):
	"""get feed"""
	match_conditions_communication = get_feed_match_conditions(frappe.session.user, 'Communication')
	match_conditions_comment = get_feed_match_conditions(frappe.session.user, 'Comment')

	result = frappe.db.sql("""select X.*
		from (select name, owner, modified, creation, seen, comment_type,
				reference_doctype, reference_name, '' as link_doctype, '' as link_name, subject,
				communication_type, communication_medium, content
			from
				`tabCommunication`
			where
				communication_type = 'Communication'
				and communication_medium != 'Email'
				and {match_conditions_communication}
		UNION
			select name, owner, modified, creation, '0', 'Updated',
				reference_doctype, reference_name, link_doctype, link_name, subject,
				'Comment', '', content
			from
				`tabActivity Log`
		UNION
			select name, owner, modified, creation, '0', comment_type,
				reference_doctype, reference_name, link_doctype, link_name, '',
				'Comment', '', content
			from
				`tabComment`
			where
				{match_conditions_comment}
		) X
		order by X.creation DESC
		LIMIT %(page_length)s
		OFFSET %(start)s"""
		.format(match_conditions_comment = match_conditions_comment,
			match_conditions_communication = match_conditions_communication), {
			"user": frappe.session.user,
			"start": cint(start),
			"page_length": cint(page_length)
		}, as_dict=True)

	return result