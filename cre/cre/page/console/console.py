# Copyright (c) 2017, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE
import frappe

@frappe.whitelist()
def get_console_config():
	console_config = frappe._dict()
	console_hooks = frappe.get_hooks('console')
	for hook in console_hooks:
		console_config.update(frappe.get_attr(hook)())

	return console_config