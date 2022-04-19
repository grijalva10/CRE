frappe.ready(function() {

    console.log('overview');
    let d = new frappe.ui.Dialog({
        title: "Select Address",
        fields: [{
            'fieldtype': 'HTML',
            'fieldname': 'address_picker',
        }],
        primary_action_label: __('Set Address'),
        primary_action: () => {
            const $card = d.$wrapper.find('.address-card.active');
            const address_type = $card.closest('[data-address-type]').attr('data-address-type');
            const address_name = $card.closest('[data-address-name]').attr('data-address-name');
            frappe.call({
                type: "POST",
                method: "erpnext.e_commerce.shopping_cart.cart.update_cart_address",
                freeze: true,
                args: {
                    address_type,
                    address_name
                },
                callback: function(r) {
                    d.hide();
                    if (!r.exc) {
                        $(".cart-tax-items").html(r.message.total);
                        shopping_cart.parent.find(
                            `.address-container[data-address-type="${address_type}"]`
                        ).html(r.message.address);
                    }
                }
            });
        }
    });
    d.show();

    $("#tab_overview").on("click", function() {
        console.log('overview');

    });

    $("#tab_tasks").on("click", function() {
        console.log('tasks');
    });

    $("#tab_documents").on("click", function() {
        console.log('documents');
    });

});
