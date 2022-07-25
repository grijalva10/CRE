from . import __version__ as app_version

app_name = "cre"
app_title = "CRE"
app_publisher = "JMG"
app_description = "commercial real estate"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "grijalva10@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "assets/css/ui.css"
# app_include_js = ["cre.bundle.js"]

# include js, css files in header of web template
# web_include_css = "/assets/cre/css/erpnext.css"
web_include_css = "erpnext-web.bundle.css"
# web_include_js = ["/assets/cre/js/cre-web.bundle.js"]

# include custom scss in every website theme (without file extension ".scss")
website_theme_scss = "cre/public/scss/cre"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
doctype_list_js = {"Lead" : "public/js/lead_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

console = ["cre.cre.console.get_leaderboards","cre.cre.console.get_leads_config"]
# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "cre.utils.jinja_methods",
# 	"filters": "cre.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "cre.install.before_install"
# after_install = "cre.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "cre.uninstall.before_uninstall"
# after_uninstall = "cre.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "cre.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"cre.tasks.all"
# 	],
# 	"daily": [
# 		"cre.tasks.daily"
# 	],
# 	"hourly": [
# 		"cre.tasks.hourly"
# 	],
# 	"weekly": [
# 		"cre.tasks.weekly"
# 	],
# 	"monthly": [
# 		"cre.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "cre.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "cre.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "cre.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]


# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"cre.auth.validate"
# ]

website_route_rules = [
    {"from_route": "/dashboard/properties", "to_route": "/dashboard/properties/all"},
    {"from_route": "/dashboard/property/<name>", "to_route": "property"},
    {"from_route": "/dashboard", "to_route": "/dashboard/home"},
    {"from_route": "/dashboard/project", "to_route": "Project"},
    {"from_route": "/dashboard/profile", "to_route": "me"},
    {"from_route": "/dashboard/investments/<name>", "to_route": "investment"},
    {"from_route": "/dashboard/transactions/<name>", "to_route": "transaction"}
    # {"from_route": "/dashboard/notifications", "to_route": "Notification Log"}
    # {"from_route": "/dashboard/project", "to_route": "Project"}
    # {"from_route": "/projects/<name>", "to_route": "project"},
    # {"from_route": "/portfolios/<name>", "to_route": "portfolio"},
    # {"from_route": "/offering/<name>", "to_route": "offering"}
    
]
extend_website_page_controller_context = {
    "frappe.www.project": "cre.pages.context_project"
}

portal_menu_items = [
    {"title": "Dashboard", "route": "/dashboard", "role": "Investor", "icon": "gauge"},
    {"title": "Marketplace", "route": "/dashboard/properties/all", "role": "Investor", "icon": "target"},
    {"title": "Offers", "route": "/dashboard/offers", "role": "Investor", "icon": "target"},
    {"title": "Transactions", "route": "/dashboard/transactions", "role": "Investor", "icon": "checks"},
    {"title": "Portfolio", "route": "/dashboard/portfolio", "role": "Investor", "icon": "stack-2"},
    
    {"title": "Documents", "route": "/dashboard/documents", "role": "Investor", "icon": "files"},
    {"title": "Messages", "route": "/dashboard/messages", "role": "Investor", "icon": "message"},
    {"group_title": "Account", "role": "Investor","label": "Account", "icon": "user", "group_items": 
        [
            {"title": "Account Settings", "route": "/dashboard/profile", "role": "Investor"},
            {"title": "Notification Settings", "route": "/dashboard/documents", "role": "Investor"},
            {"title": "Investments", "route": "/dashboard/investments", "role": "Investor", "icon": "trending-up"}
        ]
        
    },
]

fixtures = [{'dt':'Property Type'},
{'dt': 'Property Market'},
{'dt':'Custom Field', "filters": [["name", "in", ["tabler_icon"]]]}]


scheduler_events = {
    "cron": {
        "* * * * *": [
            "frappe.email.queue.flush"
        ]
    }
}