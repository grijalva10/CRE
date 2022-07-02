frappe.ready(() => {
    let result_wrapper = $(".website-list .result");
    let next_start = "{{ next_start or 0 }}";
    
    let args = get_args();
    get_list(args);


    function get_args() {
        let args = $.extend(frappe.utils.get_query_params(), {
            doctype: "Project",
            txt: "{{ txt or '' }}",
            limit_start: next_start,
            pathname: location.pathname,
        });
        return args;

    }

    function get_list(args) {
        frappe.call('cre.www.list.get', args)
            .then(r => {
                var data = r.message;
                console.log(data);
                next_start = data.next_start;
                $.each(data.result, function(i, d) {
                    $(d).appendTo(result_wrapper);
                });
            })
    }

    //let filters = { "published": 1 }

    $(".website-list .btn-more").on("click", function() {
        let $btn = $(this);
        let args = $.extend(frappe.utils.get_query_params(), {
            doctype: "Project",
            txt: "{{ txt or '' }}",
            limit_start: next_start,
            pathname: location.pathname,
        });
        $btn.prop("disabled", true);
        frappe.call('cre.www.list.get', args)
            .then(r => {
                var data = r.message;
                console.log(data);
                next_start = data.next_start;
                $.each(data.result, function(i, d) {
                    $(d).appendTo(result_wrapper);
                });
                toggle_more(data.show_more);
            })
            .always(() => {
                $btn.prop("disabled", false);
            });
    });

    function toggle_more(show) {
        if (!show) {
            $(".website-list .more-block").addClass("hide");
        }
    }

    $('#property_type_select').on('show.bs.dropdown', function() {
        // do something…
    })
});
