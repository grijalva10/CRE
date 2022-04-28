# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document

class Property(Document):
    
    def validate(self):
        self.set_full_name()
    
    def set_full_name(self):
        if self.address and self.city and self.state and self.zip_code:
            self.property_name = f'{self.address}, {self.city}, {self.state}, {self.zip_code}'
