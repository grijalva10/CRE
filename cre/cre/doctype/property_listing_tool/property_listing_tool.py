# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt

import frappe
import requests
from bs4 import BeautifulSoup
import re

from frappe.model.document import Document

class PropertyListingTool(Document):
    
    def validate(self):
        pass
        
    def set_log(self, log_text):
        self.log = log_text


@frappe.whitelist()
def get_daum_listing_urls():
    all_urls = []
    soup = get_page('http://daumcommercial.com/property-search')
    clean_data = soup.prettify()
    all_urls += get_urls(clean_data)
    if next_page_found(clean_data):
        for i in range(2, 100):
            soup = get_page(f'http://daumcommercial.com/property-search/page/{i}')
            clean_data = soup.prettify()
            all_urls += get_urls(clean_data)
            if not next_page_found(clean_data):
                break
        
    listing_urls = list(set(all_urls))
    return listing_urls
    
def get_page(page_url='http://daumcommercial.com/property-search'):
    response = requests.get(page_url)
    return BeautifulSoup(response.text, 'html.parser')


def get_urls(clean_data, in_url='https://daumcommercial.com/property/'):
    urls = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', clean_data)
    return [url for url in urls if in_url in url]

def next_page_found(clean_data):
    if 'next' in clean_data:
        return True
    return False


def clean_listing_key(key_text):
    return str(key_text).strip().rstrip().replace(':', '')

def clean_listing_value(key_value):
    return str(key_value).replace('$', '').replace(',', '').replace('\n', '').replace('SF', '').strip()

def square_feet_to_acres(sqft,precision=2):
    return round(int(sqft)/43560,2)
    
def is_daum_listing_type(page_soup, listing_type='investment'):
    
    page_listing_type = [clean_listing_key(k.text) for k in page_soup.find_all(class_="title-about")]
    
    if not page_listing_type:
        return False
        
    if listing_type not in str(page_listing_type[0]).lower():
        return False
    
    return True

def filter_daum_listing_page_type(urls, listing_type='investment'):
    max_iter = 1000
    filtered_urls = []
    
    for i in range(len(urls)):
        if i > max_iter:
            break
        
        page_soup = get_page(urls[i])
        
        if is_daum_listing_type(page_soup, listing_type=listing_type):
            filtered_urls.append(urls[i])
    
    return filtered_urls
    
    
    

@frappe.whitelist()
def get_listing(url, sale_type='investment'):
    ld = {}
    page_soup = get_page(url)
    listing_type = [clean_listing_key(k.text) for k in page_soup.find_all(class_="title-about")]
    if not listing_type:
        return

    if sale_type not in str(listing_type[0]).lower():
        return
    ld['sale_type'] = 'Investment'
    ld['source'] = url
    title = page_soup.find(class_="title-property")
    ld['title'] = str(title.text).strip()
    city_state = page_soup.find(class_="state-city")
    city_state = [x.text for x in city_state.find_all('li')]
    if city_state:
        ld['property_city'] = str(city_state[0]).strip()
        ld['property_state'] = city_state[1].strip()
        ld['property_zip_code'] = city_state[2].strip()

    keys = [clean_listing_key(k.text) for k in page_soup.find_all(class_="title")]
    values = [clean_listing_value(k.text) for k in page_soup.find_all(class_="info")]

    kv = {}
    for i in range(len(keys)):
        kv[keys[i]] = values[i]

    if kv['Property Type']:
        ld['property_type'] = kv['Property Type']

    if 'Sale Price' in kv.keys() and kv['Sale Price']:
        ld['price'] = kv['Sale Price']

    if 'Total Space Available' in kv.keys() and kv['Total Space Available']:
        ld['property_rba'] = kv['Total Space Available']

    if 'Lot Size (Sq. Ft.)' in kv.keys() and kv['Lot Size (Sq. Ft.)']:
        ld['property_land_area'] = square_feet_to_acres(kv['Lot Size (Sq. Ft.)'])

    agent = [clean_listing_key(k.text) for k in page_soup.find_all(class_="name")]
    if agent:
        ld['agent'] = agent[0]

    page_content = [str(k.text).strip() for m in page_soup.find_all(class_='main-section') for k in m.find_all(class_="content")]
    if page_content:
        page_content = [h for h in page_content[0].split('\n') if h]
        ld['highlights'] = str(page_content)

    urls = [str(url).replace("'", '').replace(')', '') for url in get_urls(page_soup.prettify(), in_url='https://daumcommercial.com/wp-content/uploads/')]
    if urls:

        skip_list = ['https://daumcommercial.com/wp-content/uploads/2021/07/DAUM.standard.logo_.jpg',
                     'https://daumcommercial.com/wp-content/uploads/2018/07/iStock-616244526_high.jpg']
        ld['files'] = []
        ld['images'] = []
        for url in urls:
            if url not in skip_list:
                if url.endswith('pdf'):
                    ld['files'].append(url)
                else:
                    ld['images'].append(url)

        ld['files'] = str(list(set(ld['files'])))
        images = list(set(ld['images']))
        if images:
            ld['image'] = images[0]
        ld['images'] = str(images)
        ld['doctype'] = 'Listing'

    return ld

def get_listing_data(urls):
    max_iter = 10
    listings = []
    for i in range(len(urls)):
        if i > max_iter:
            break
        print(i, urls[i])
        listing = get_listing(urls[i])
        if listing:
            listings.append(listing)
    print(listings)



@frappe.whitelist()
def make_property_listing_source(property_listing_tool, url, status):
    psl = frappe.doc.get_doc(doctype='Property Listing Source', url=url, status=status)
    psl.insert()
    frappe.db.commit()

@frappe.whitelist()
def ping():
    frappe.msgprint(msg='pong', title='Pong')
    frappe.show_alert(message='pong', seconds=3)
    
@frappe.whitelist()
def generate_property_listing(url, listing_type='investment'):
    
    new_listing = get_listing(url, listing_type)
    
    if new_listing and not frappe.db.exists('Listing', new_listing['title'], cache=True):
        doc = frappe.get_doc(new_listing)
        doc.insert()
        frappe.db.commit()