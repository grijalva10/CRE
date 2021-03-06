import frappe
from frappe.utils import get_fullname

def get_leaderboards():
	leaderboards = {
		'User': {
			'fields': ['points'],
			'method': 'cre.cre.console.get_energy_point_leaderboard',
			'company_disabled': 1,
			'icon': 'users'
		}
	}
	return leaderboards

def get_leads_config():
	leads = {
		'Lead': {
			'fields': ['phone', 'email_id'],
			'method': 'cre.cre.console.get_leads',
			'company_disabled': 1,
			'icon': 'users'
		}
	}
	return leads

@frappe.whitelist()
def get_energy_point_leaderboard(date_range, company = None, field = None, limit = None):
	all_users = frappe.db.get_all('User',
		filters = {
			'name': ['not in', ['Administrator', 'Guest']],
			'enabled': 1,
			'user_type': ['!=', 'Website User']
		},
		order_by = 'name ASC')
	all_users_list = list(map(lambda x: x['name'], all_users))

	filters = [
		['type', '!=', 'Review'],
		['user', 'in', all_users_list]
	]
	if date_range:
		date_range = frappe.parse_json(date_range)
		filters.append(['creation', 'between', [date_range[0], date_range[1]]])
	energy_point_users = frappe.db.get_all('Energy Point Log',
		fields = ['user as name', 'sum(points) as value'],
		filters = filters,
		group_by = 'user',
		order_by = 'value desc'
	)

	energy_point_users_list = list(map(lambda x: x['name'], energy_point_users))
	for user in all_users_list:
		if user not in energy_point_users_list:
			energy_point_users.append({'name': user, 'value': 0})

	for user in energy_point_users:
		user_id = user['name']
		user['name'] = get_fullname(user['name'])
		user['formatted_name'] = '<a href="/app/user-profile/{}">{}</a>'.format(user_id, get_fullname(user_id))

	return energy_point_users
	

@frappe.whitelist()
def get_leads(date_range = None, company = None, field = None, limit = None):
	all_leads = frappe.db.get_all('Lead',
		fields=['title as name', 'phone', 'email_id'],
		order_by ='name ASC')
	return all_leads
	

@frappe.whitelist()
def get_sidebar(sidebar = None):
	if not sidebar:
		sidebar = 'Investor Sidebar'
	this_sidebar = frappe.get_doc('Website Sidebar', sidebar)

	return this_sidebar
	