# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import numpy_financial as npf

class InvestmentCriteria(Document):
    
    def on_update(self):
        ltv = self.ltv / 100
        self.purchase_price = self.cash_to_close / (1- ltv)
        present_value = self.purchase_price * ltv
        rate = self.interest_rate / 100
        self.loan_payment_monthly = npf.pmt(rate/12, self.amortization*12, present_value)
        self.ads = self.loan_payment_monthly * 12
        
        props = frappe.get_all('Property', fields=['name', 'noi', 'cap_rate', 'price'])
        keepers = []
        for prop in props:
            
            if not prop.price:
                if prop.noi and prop.cap_rate:
                    prop.price = prop.noi / (prop.cap_rate/100)
            
            if prop.price and prop.noi and self.ads:
                prop['cash_flow'] = prop.noi + self.ads
                if prop.cash_flow > 0:
                    if prop.price <= self.purchase_price:
                        keepers.append(prop)
                
        self.dev = str(keepers)
        
	
