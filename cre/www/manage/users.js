frappe.ready(function() {

    var result_wrapper = $('.jmg-content');
    var next_start = "{{ next_start or 0 }}";

    console.log(frappe)


    create_layout();

    function get_list() {
        var data = $.extend(frappe.utils.get_query_params(), {
            doctype: "Property",
            txt: "{{ txt or '' }}",
            limit_start: next_start,
            pathname: location.pathname,
        });
        data.web_form_name = frappe.web_form_name;
        data.pathname = location.pathname;
        return $.ajax({
            url: "/api/method/cre.www.list.get",
            data: data,
            statusCode: {
                200: function(data) {
                    var data = data.message;
                    next_start = data.next_start;
                    $.each(data.result, function(i, d) {
                        $(d).appendTo(result_wrapper);
                    });
                    toggle_more(data.show_more);
                }
            }
        })

    }

    function create_layout() {
        var collection_data = get_list();
        $.each(collection_data.result, function(i, d) {
            $(d).appendTo(result_wrapper);
            console.log(d);
        });
        // $(parent).append(collection_data);
    }
});
