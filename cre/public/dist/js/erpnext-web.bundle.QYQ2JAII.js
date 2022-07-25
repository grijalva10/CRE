(() => {
  // ../cre/cre/public/erpnext/erpnext/public/js/website_utils.js
  if (!window.erpnext)
    window.erpnext = {};
  frappe.send_message = function(opts, btn) {
    return frappe.call({
      type: "POST",
      method: "erpnext.templates.utils.send_message",
      btn,
      args: opts,
      callback: opts.callback
    });
  };
  erpnext.subscribe_to_newsletter = function(opts, btn) {
    return frappe.call({
      type: "POST",
      method: "frappe.email.doctype.newsletter.newsletter.subscribe",
      btn,
      args: { "email": opts.email },
      callback: opts.callback
    });
  };
  erpnext.send_message = frappe.send_message;

  // ../cre/cre/public/erpnext/erpnext/public/js/wishlist.js
  frappe.provide("erpnext.e_commerce.wishlist");
  var wishlist = erpnext.e_commerce.wishlist;
  frappe.provide("erpnext.e_commerce.shopping_cart");
  var shopping_cart = erpnext.e_commerce.shopping_cart;
  $.extend(wishlist, {
    set_wishlist_count: function(animate = false) {
      var wish_count = frappe.get_cookie("wish_count");
      if (frappe.session.user === "Guest") {
        wish_count = 0;
      }
      if (wish_count) {
        $(".wishlist").toggleClass("hidden", false);
      }
      var $wishlist = $(".wishlist-icon");
      var $badge = $wishlist.find("#wish-count");
      if (parseInt(wish_count) === 0 || wish_count === void 0) {
        $wishlist.css("display", "none");
      } else {
        $wishlist.css("display", "inline");
      }
      if (wish_count) {
        $badge.html(wish_count);
        if (animate) {
          $wishlist.addClass("cart-animate");
          setTimeout(() => {
            $wishlist.removeClass("cart-animate");
          }, 500);
        }
      } else {
        $badge.remove();
      }
    },
    bind_move_to_cart_action: function() {
      $(".page_content").on("click", ".btn-add-to-cart", (e) => {
        const $move_to_cart_btn = $(e.currentTarget);
        let item_code = $move_to_cart_btn.data("item-code");
        shopping_cart.shopping_cart_update({
          item_code,
          qty: 1,
          cart_dropdown: true
        });
        let success_action = function() {
          const $card_wrapper = $move_to_cart_btn.closest(".wishlist-card");
          $card_wrapper.addClass("wish-removed");
        };
        let args = { item_code };
        this.add_remove_from_wishlist("remove", args, success_action, null, true);
      });
    },
    bind_remove_action: function() {
      let me = this;
      $(".page_content").on("click", ".remove-wish", (e) => {
        const $remove_wish_btn = $(e.currentTarget);
        let item_code = $remove_wish_btn.data("item-code");
        let success_action = function() {
          const $card_wrapper = $remove_wish_btn.closest(".wishlist-card");
          $card_wrapper.addClass("wish-removed");
          if (frappe.get_cookie("wish_count") == 0) {
            $(".page_content").empty();
            me.render_empty_state();
          }
        };
        let args = { item_code };
        this.add_remove_from_wishlist("remove", args, success_action);
      });
    },
    bind_wishlist_action() {
      $(".page_content").on("click", ".like-action, .like-action-list", (e) => {
        const $btn = $(e.currentTarget);
        this.wishlist_action($btn);
      });
    },
    wishlist_action(btn) {
      const $wish_icon = btn.find(".wish-icon");
      let me = this;
      if (frappe.session.user === "Guest") {
        if (localStorage) {
          localStorage.setItem("last_visited", window.location.pathname);
        }
        this.redirect_guest();
        return;
      }
      let success_action = function() {
        erpnext.e_commerce.wishlist.set_wishlist_count(true);
      };
      if ($wish_icon.hasClass("wished")) {
        btn.removeClass("like-animate");
        btn.addClass("like-action-wished");
        this.toggle_button_class($wish_icon, "wished", "not-wished");
        let args = { item_code: btn.data("item-code") };
        let failure_action = function() {
          me.toggle_button_class($wish_icon, "not-wished", "wished");
        };
        this.add_remove_from_wishlist("remove", args, success_action, failure_action);
      } else {
        btn.addClass("like-animate");
        btn.addClass("like-action-wished");
        this.toggle_button_class($wish_icon, "not-wished", "wished");
        let args = { item_code: btn.data("item-code") };
        let failure_action = function() {
          me.toggle_button_class($wish_icon, "wished", "not-wished");
        };
        this.add_remove_from_wishlist("add", args, success_action, failure_action);
      }
    },
    toggle_button_class(button, remove, add) {
      button.removeClass(remove);
      button.addClass(add);
    },
    add_remove_from_wishlist(action, args, success_action, failure_action, async = false) {
      if (frappe.session.user === "Guest") {
        if (localStorage) {
          localStorage.setItem("last_visited", window.location.pathname);
        }
        this.redirect_guest();
      } else {
        let method = "erpnext.e_commerce.doctype.wishlist.wishlist.add_to_wishlist";
        if (action === "remove") {
          method = "erpnext.e_commerce.doctype.wishlist.wishlist.remove_from_wishlist";
        }
        frappe.call({
          async,
          type: "POST",
          method,
          args,
          callback: function(r) {
            if (r.exc) {
              if (failure_action && typeof failure_action === "function") {
                failure_action();
              }
              frappe.msgprint({
                message: __("Sorry, something went wrong. Please refresh."),
                indicator: "red",
                title: __("Note")
              });
            } else if (success_action && typeof success_action === "function") {
              success_action();
            }
          }
        });
      }
    },
    redirect_guest() {
      frappe.call("erpnext.e_commerce.api.get_guest_redirect_on_action").then((res) => {
        window.location.href = res.message || "/login";
      });
    },
    render_empty_state() {
      $(".page_content").append(`
			<div class="cart-empty frappe-card">
				<div class="cart-empty-state">
					<img src="/assets/erpnext/images/ui-states/cart-empty-state.png" alt="Empty Cart">
				</div>
				<div class="cart-empty-message mt-4">${__("Wishlist is empty !")}</p>
			</div>
		`);
    }
  });
  frappe.ready(function() {
    if (window.location.pathname !== "/wishlist") {
      $(".wishlist").toggleClass("hidden", true);
      wishlist.set_wishlist_count();
    } else {
      wishlist.bind_move_to_cart_action();
      wishlist.bind_remove_action();
    }
  });

  // ../cre/cre/public/erpnext/erpnext/public/js/shopping_cart.js
  frappe.provide("erpnext.e_commerce.shopping_cart");
  var shopping_cart2 = erpnext.e_commerce.shopping_cart;
  var getParams = function(url) {
    var params = [];
    var parser = document.createElement("a");
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };
  frappe.ready(function() {
    var full_name = frappe.session && frappe.session.user_fullname;
    if (full_name) {
      $('.navbar li[data-label="User"] a').html('<i class="fa fa-fixed-width fa fa-user"></i> ' + full_name);
    }
    var url_args = getParams(window.location.href);
    var referral_coupon_code = url_args["cc"];
    var referral_sales_partner = url_args["sp"];
    var d = new Date();
    d.setTime(d.getTime() + 0.02 * 24 * 60 * 60 * 1e3);
    var expires = "expires=" + d.toUTCString();
    if (referral_coupon_code) {
      document.cookie = "referral_coupon_code=" + referral_coupon_code + ";" + expires + ";path=/";
    }
    if (referral_sales_partner) {
      document.cookie = "referral_sales_partner=" + referral_sales_partner + ";" + expires + ";path=/";
    }
    referral_coupon_code = frappe.get_cookie("referral_coupon_code");
    referral_sales_partner = frappe.get_cookie("referral_sales_partner");
    if (referral_coupon_code && $(".tot_quotation_discount").val() == void 0) {
      $(".txtcoupon").val(referral_coupon_code);
    }
    if (referral_sales_partner) {
      $(".txtreferral_sales_partner").val(referral_sales_partner);
    }
    shopping_cart2.show_shoppingcart_dropdown();
    shopping_cart2.set_cart_count();
    shopping_cart2.show_cart_navbar();
  });
  $.extend(shopping_cart2, {
    show_shoppingcart_dropdown: function() {
      $(".shopping-cart").on("shown.bs.dropdown", function() {
        if (!$(".shopping-cart-menu .cart-container").length) {
          return frappe.call({
            method: "erpnext.e_commerce.shopping_cart.cart.get_shopping_cart_menu",
            callback: function(r) {
              if (r.message) {
                $(".shopping-cart-menu").html(r.message);
              }
            }
          });
        }
      });
    },
    update_cart: function(opts) {
      if (frappe.session.user === "Guest") {
        if (localStorage) {
          localStorage.setItem("last_visited", window.location.pathname);
        }
        frappe.call("erpnext.e_commerce.api.get_guest_redirect_on_action").then((res) => {
          window.location.href = res.message || "/login";
        });
      } else {
        shopping_cart2.freeze();
        return frappe.call({
          type: "POST",
          method: "erpnext.e_commerce.shopping_cart.cart.update_cart",
          args: {
            item_code: opts.item_code,
            qty: opts.qty,
            additional_notes: opts.additional_notes !== void 0 ? opts.additional_notes : void 0,
            with_items: opts.with_items || 0
          },
          btn: opts.btn,
          callback: function(r) {
            shopping_cart2.unfreeze();
            shopping_cart2.set_cart_count(true);
            if (opts.callback)
              opts.callback(r);
          }
        });
      }
    },
    set_cart_count: function(animate = false) {
      $(".intermediate-empty-cart").remove();
      var cart_count = frappe.get_cookie("cart_count");
      if (frappe.session.user === "Guest") {
        cart_count = 0;
      }
      if (cart_count) {
        $(".shopping-cart").toggleClass("hidden", false);
      }
      var $cart = $(".cart-icon");
      var $badge = $cart.find("#cart-count");
      if (parseInt(cart_count) === 0 || cart_count === void 0) {
        $cart.css("display", "none");
        $(".cart-tax-items").hide();
        $(".btn-place-order").hide();
        $(".cart-payment-addresses").hide();
        let intermediate_empty_cart_msg = `
				<div class="text-center w-100 intermediate-empty-cart mt-4 mb-4 text-muted">
					${__("Cart is Empty")}
				</div>
			`;
        $(".cart-table").after(intermediate_empty_cart_msg);
      } else {
        $cart.css("display", "inline");
        $("#cart-count").text(cart_count);
      }
      if (cart_count) {
        $badge.html(cart_count);
        if (animate) {
          $cart.addClass("cart-animate");
          setTimeout(() => {
            $cart.removeClass("cart-animate");
          }, 500);
        }
      } else {
        $badge.remove();
      }
    },
    shopping_cart_update: function({ item_code, qty, cart_dropdown, additional_notes }) {
      shopping_cart2.update_cart({
        item_code,
        qty,
        additional_notes,
        with_items: 1,
        btn: this,
        callback: function(r) {
          if (!r.exc) {
            $(".cart-items").html(r.message.items);
            $(".cart-tax-items").html(r.message.total);
            $(".payment-summary").html(r.message.taxes_and_totals);
            shopping_cart2.set_cart_count();
            if (cart_dropdown != true) {
              $(".cart-icon").hide();
            }
          }
        }
      });
    },
    show_cart_navbar: function() {
      frappe.call({
        method: "erpnext.e_commerce.doctype.e_commerce_settings.e_commerce_settings.is_cart_enabled",
        callback: function(r) {
          $(".shopping-cart").toggleClass("hidden", r.message ? false : true);
        }
      });
    },
    toggle_button_class(button, remove, add) {
      button.removeClass(remove);
      button.addClass(add);
    },
    bind_add_to_cart_action() {
      $(".page_content").on("click", ".btn-add-to-cart-list", (e) => {
        const $btn = $(e.currentTarget);
        $btn.prop("disabled", true);
        if (frappe.session.user === "Guest") {
          if (localStorage) {
            localStorage.setItem("last_visited", window.location.pathname);
          }
          frappe.call("erpnext.e_commerce.api.get_guest_redirect_on_action").then((res) => {
            window.location.href = res.message || "/login";
          });
          return;
        }
        $btn.addClass("hidden");
        $btn.closest(".cart-action-container").addClass("d-flex");
        $btn.parent().find(".go-to-cart").removeClass("hidden");
        $btn.parent().find(".go-to-cart-grid").removeClass("hidden");
        $btn.parent().find(".cart-indicator").removeClass("hidden");
        const item_code = $btn.data("item-code");
        erpnext.e_commerce.shopping_cart.update_cart({
          item_code,
          qty: 1
        });
      });
    },
    freeze() {
      if (window.location.pathname !== "/cart")
        return;
      if (!$("#freeze").length) {
        let freeze = $('<div id="freeze" class="modal-backdrop fade"></div>').appendTo("body");
        setTimeout(function() {
          freeze.addClass("show");
        }, 1);
      } else {
        $("#freeze").addClass("show");
      }
    },
    unfreeze() {
      if ($("#freeze").length) {
        let freeze = $("#freeze").removeClass("show");
        setTimeout(function() {
          freeze.remove();
        }, 1);
      }
    }
  });

  // ../cre/cre/public/erpnext/erpnext/public/js/customer_reviews.js
  $(() => {
    class CustomerReviews {
      constructor() {
        this.bind_button_actions();
        this.start = 0;
        this.page_length = 10;
      }
      bind_button_actions() {
        this.write_review();
        this.view_more();
      }
      write_review() {
        $(".page_content").on("click", ".btn-write-review", (e) => {
          const $btn = $(e.currentTarget);
          let d = new frappe.ui.Dialog({
            title: __("Write a Review"),
            fields: [
              { fieldname: "title", fieldtype: "Data", label: "Headline", reqd: 1 },
              { fieldname: "rating", fieldtype: "Rating", label: "Overall Rating", reqd: 1 },
              { fieldtype: "Section Break" },
              { fieldname: "comment", fieldtype: "Small Text", label: "Your Review" }
            ],
            primary_action: function() {
              let data = d.get_values();
              frappe.call({
                method: "erpnext.e_commerce.doctype.item_review.item_review.add_item_review",
                args: {
                  web_item: $btn.attr("data-web-item"),
                  title: data.title,
                  rating: data.rating,
                  comment: data.comment
                },
                freeze: true,
                freeze_message: __("Submitting Review ..."),
                callback: (r) => {
                  if (!r.exc) {
                    frappe.msgprint({
                      message: __("Thank you for submitting your review"),
                      title: __("Review Submitted"),
                      indicator: "green"
                    });
                    d.hide();
                    location.reload();
                  }
                }
              });
            },
            primary_action_label: __("Submit")
          });
          d.show();
        });
      }
      view_more() {
        $(".page_content").on("click", ".btn-view-more", (e) => {
          const $btn = $(e.currentTarget);
          $btn.prop("disabled", true);
          this.start += this.page_length;
          let me = this;
          frappe.call({
            method: "erpnext.e_commerce.doctype.item_review.item_review.get_item_reviews",
            args: {
              web_item: $btn.attr("data-web-item"),
              start: me.start,
              end: me.page_length
            },
            callback: (result) => {
              if (result.message) {
                let res = result.message;
                me.get_user_review_html(res.reviews);
                $btn.prop("disabled", false);
                if (res.total_reviews <= me.start + me.page_length) {
                  $btn.hide();
                }
              }
            }
          });
        });
      }
      get_user_review_html(reviews) {
        let me = this;
        let $content = $(".user-reviews");
        reviews.forEach((review) => {
          $content.append(`
					<div class="mb-3 review">
						<div class="d-flex">
							<p class="mr-4 user-review-title">
								<span>${__(review.review_title)}</span>
							</p>
							<div class="rating">
								${me.get_review_stars(review.rating)}
							</div>
						</div>

						<div class="product-description mb-4">
							<p>
								${__(review.comment)}
							</p>
						</div>
						<div class="review-signature mb-2">
							<span class="reviewer">${__(review.customer)}</span>
							<span class="indicator grey" style="--text-on-gray: var(--gray-300);"></span>
							<span class="reviewer">${__(review.published_on)}</span>
						</div>
					</div>
				`);
        });
      }
      get_review_stars(rating) {
        let stars = ``;
        for (let i = 1; i < 6; i++) {
          let fill_class = i <= rating ? "star-click" : "";
          stars += `
					<svg class="icon icon-sm ${fill_class}">
						<use href="#icon-star"></use>
					</svg>
				`;
        }
        return stars;
      }
    }
    new CustomerReviews();
  });
})();
//# sourceMappingURL=erpnext-web.bundle.QYQ2JAII.js.map
