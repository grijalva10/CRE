// Copyright (c) 2022, JMG and contributors
// For license information, please see license.txt

frappe.ui.form.on('Data Harvest', {
	// refresh: function(frm) {

	// }
	harvest_daum_market_reports: function(frm) {
		console.log('yo');
		frm.call('harvest_daum_market_reports')
			.then(r => {
				if (r.message) {
					let linked_doc = r.message;
					console.log(linked_doc);
					// do something with linked_doc
				}
			})

	}
});
