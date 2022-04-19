# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class DataHarvest(Document):

    @frappe.whitelist()
    def harvest_daum_market_reports(self):
        return 'ping'
