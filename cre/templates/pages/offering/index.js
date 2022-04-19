// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

frappe.ready(function() {
        
        var email = $('[name="email"]').val();
        var first_name = $('[name="first_name"]').val();
        var last_name = $('[name="last_name"]').val();
        
        if(email && first_name && last_name){
            $('#download_button').removeClass('disabled');
        }

    $('.btn-send').off("click").on("click", function() {
        var email = $('[name="email"]').val();
        var first_name = $('[name="first_name"]').val();
        var last_name = $('[name="last_name"]').val();
        var cell_phone = $('[name="cell_phone"]').val();

        if (!(email && first_name && last_name)) {
            
            frappe.msgprint('{{ _("Please enter both your email and message so that we can get back to you. Thanks!") }}');
            return false;
        }

        if (!validate_email(email)) {
            frappe.msgprint('{{ _("Please enter a valid email address so that we can get back.") }}');
            $('[name="email"]').focus();
            return false;
        }


        $("#contact-alert").toggle(false);
        var payload = { doctype: 'Lead', first_name: first_name, last_name: last_name, email: email, cell_phone: cell_phone };
        frappe.call({
            method: 'cre.cre.api.new_lead',
            args: payload,
            // disable the button until the request is completed
            btn: $('.primary-action'),
            // freeze the screen until the request is completed
            freeze: true,
            callback: (r) => {
                console.log(r.message);
                frappe.set_route('/files/5010SHighway95_OM_2.pdf')
                // on success
            },
            error: (r) => {
                console.log('ERROR');
                console.log(r.message);
                // on error
            }
        });
        return false;

    });


    var msgprint = function(txt) {
        if (txt) $("#contact-alert").html(txt).toggle(true);
    }

});
