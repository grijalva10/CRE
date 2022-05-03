# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt

import frappe
import requests
from bs4 import BeautifulSoup
import re

from frappe.model.document import Document

class PropertyListingTool(Document):
    
    def validate(self):
        # self.get_daum_links()
        self.set_log('This is the log text.')
        
    
    # def get_daum_links(self):
    #     all_urls = []
    #     soup = get_page('http://daumcommercial.com/property-search')
    #     clean_data = soup.prettify()
    #     all_urls += get_urls(clean_data)
    
    #     if next_page_found(clean_data):
    #         for i in range(2, 100):
    #             soup = get_page(f'http://daumcommercial.com/property-search/page/{i}')
    #             clean_data = soup.prettify()
    #             all_urls += get_urls(clean_data)
    #             if not next_page_found(clean_data):
    #                 break
        
    #     listing_urls = list(set(all_urls))
    #     for url in listing_urls:
    #         self.append('listings', {'source': url, 'status': 'Ready'})
    #         frappe.db.commit()
    #     return list(set(all_urls))
    
    def set_log(self, log_text):
        self.log = log_text