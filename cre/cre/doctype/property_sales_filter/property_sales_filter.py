# Copyright (c) 2022, JMG and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import json
from cre.api import crexi_search, get_crexi_asset

# x = {"leaseTypes":[],
# "tenants":[],
# "pricePerSqFtMin":0,
# "pricePerSqFtMax":0,
# "remainingTermMin":0,
# "types":["Retail"],
# "occupancyMin":1,
# "capRateMax":14.9,
# "capRateMin":0.3,
# "askingPriceMax":9975000,
# "askingPriceMin":150000,
# "classes":["A"],
# "statuses":["Active Listings","Contract Pending","Under Contract"]}

class PropertySalesFilter(Document):
	def validate(self):
		self.filter = str(self.filter_crexi())
		# self.debug = str(self.filter)
		# self.crexi_pull(response)
	
	def filter_crexi(self):
		crexi_filter = [{
					"askingPriceMin": self.price_min,
					"askingPriceMax": self.price_max,
					"capRateMin": self.cap_rate_min,
					"capRateMax": self.cap_rate_max,
					"tenants": [frappe.db.get_value('Tenant Brand', t.tenant, 'tenant') for t in self.tenants],
					"leaseTypes": self.lease_types,
					"remainingTermMin": self.remaining_term_min,
					"remainingTermMax": self.remaining_term_max,
					"types": [t.tag for t in self.property_types],
					"occupancyMin": self.occupancy_min,
					"occupancyMax": self.occupancy_max,
					"statuses":["Active Listings","Contract Pending","Under Contract"]
				}]
			
			# filter out empty keys
		temp = {k: v for k, v in crexi_filter[0].items() if v}
			# self.crexi_filter = str(temp)
		return temp
			
			
	
# 	def crexi_pull(self, search_results):
# 		# get list of crexi property ids
# 		# get each crexi property data with crexi_id
# 		# remap results to Property doctype
# 		# check if property exist in Property doctype
# 		# if exist update doc else create doc
# 		asset_ids = [item.get('id') for item in search_results['data']]
# 		assets = [get_crexi_asset(asset_id) for asset_id in asset_ids]
# 		assets_remapped = [remap_crexi_asset(asset) for asset in assets[:2]]
# 		self.crexi_filter = str(assets_remapped)
	
# def get_nested_dict(data, key1, key2):
# 	_temp1 = data.get(key1, {})
# 	if _temp1:
# 		return _temp1[0].get(key2)
	
# def remap_crexi_asset(data):
# 	if not data:
# 		return
	
# 	return {'asking_price': data.get('AskingPrice'),
#                 'cap_rate': data.get('CapRate'),
#                 'tag_line': data.get('Description'),
#                 'has_flyer': data.get('HasFlyer'),
#                 'has_om': data.get('HasOM'),
#                 'opportunity_zone': data.get('IsInOpportunityZone'),
#                 'is_sold': data.get('IsSold'),
#                 'is_paid': data.get('IsPaid'),
#                 'crexi_id': data.get('Id'),
#                 'investment_description': data.get('InvestmentHighlights'),
#                 'marketing_description': data.get('MarketingDescription'),
#                 'property_name': data.get('Name'),
#                 'noi': data.get('NetOperatingIncome'),
#                 'price_sf': data.get('PricePerSqFt'),
#                 'status': data.get('Status'),
#                 'image': data.get('ThumbnailUrl'),
#                 'class': data.get('Details', {}).get('Class'),
#                 'investment_type': data.get('Details', {}).get('Investment Type'),
#                 'lease_type': data.get('Details', {}).get('Lease Type'),
#                 'lease_term': data.get('Details', {}).get('Lease Term'),
#                 'tenant_credit': data.get('Details', {}).get('Tenant Credit'),
#                 'address': get_nested_dict(data, 'Locations', 'Address'),
#                 'city': get_nested_dict(data, 'Locations', 'City'),
#                 'state': parse_state_code(data),
#                 'zip_code': get_nested_dict(data, 'Locations', 'Zip'),
#                 'lease_expiration': data.get('Details', {}).get('Lease Expiration'),
#                 'land_area': data.get('Details', {}).get('Lot Size (acres)'),
#                 'number_of_tenants': data.get('Details', {}).get('Number of Tenants'),
#                 'occupancy': parse_occupancy(data),
#                 'zoning': data.get('Details', {}).get('Permitted Zoning'),
#                 'property_type': parse_types(data),
#                 'rba': data.get('Details', {}).get('Square Footage'),
#                 'subtype': parse_subtypes(data),
#                 'tenancy': data.get('Details', {}).get('Tenancy'),
#                 'year_built': data.get('Details', {}).get('Year Built'),
#                 }
    

# def parse_state_code(data):
#     t =  get_nested_dict(data, 'Locations', 'State')
#     if not t:
#         return
#     sc = t['Code']
#     print(sc)
#     return sc


# def parse_occupancy(data):
#     _occ = data.get('Details', {}).get('Occupancy')
#     if not _occ:
#         return 0
#     return float(str(_occ).strip('%'))


# def parse_types(data):
#     _t = data.get('Details', {}).get('Property Type')
#     if not _t:
#         return
#     return list(str(_t).split(','))


# def parse_subtypes(data):
#     _t = data.get('Details', {}).get('Subtype')
#     if not _t:
#         return
#     return list(str(_t).split(','))
