import frappe 

@frappe.whitelist()
def get_menu_details():
    doc = frappe.get_doc('JMG Menu')
    return doc.items