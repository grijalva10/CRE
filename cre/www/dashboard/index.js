frappe.ready(function() {
    // bind events here

    get_feed(1, 50);
    get_todos(1, 50);
    
    async function get_feed(start, page_length) {
        frappe.call({
            method: 'cre.www.dashboard.index.get_feed',
            args: {
                start: 1,
                page_length: 20
            },
            // disable the button until the request is completed
            // btn: $('.primary-action'),
            // freeze the screen until the request is completed
            freeze: true,
            callback: (r) => {
                // on success
            },
            error: (r) => {
                // on error
            }
        }).then(r => {
             console.log(r.message);
        });


    }

function get_todos(start, page_length) {
        frappe.call({
            method: 'cre.www.dashboard.index.get_todos',
            args: {
                start: 1,
                page_length: 20
            },
            // disable the button until the request is completed
            // btn: $('.primary-action'),
            // freeze the screen until the request is completed
            freeze: true,
            callback: (r) => {
                // on success
            },
            error: (r) => {
                // on error
            }
        }).then(r => {
            console.log(r.message);
        });


    }


    
});

