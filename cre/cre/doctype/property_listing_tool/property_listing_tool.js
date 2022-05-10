// Copyright (c) 2022, JMG and contributors
// For license information, please see license.txt

frappe.ui.form.on('Property Listing Tool', {
	refresh: function(frm) {

	},

	get_listing_urls() {
		frappe.call({
			'method': 'cre.cre.doctype.property_listing_tool.property_listing_tool.get_daum_listing_urls',
			'callback': function(r) {
				if (r.message) {
					let urls = r.message;
					console.log(urls);
					fetch_listings(urls);
					// do something with linked_doc
				}

			}
		});

	}
});

function fetch_listings(urls) {
	for (let i = 0; i < urls.length; i++) {
		frappe.show_progress('Loading..', i+1, urls.length, 'Please wait');
		frappe.call({
			'method': 'cre.cre.doctype.property_listing_tool.property_listing_tool.generate_property_listing',
			'args': {'url': urls[i]},
			'callback': function(r) {
				if (r.message) {
					let urls = r.message;
					console.log(urls);
					fetch_listings(urls);
					// do something with linked_doc
				}

			}
		});
	}
	
}
