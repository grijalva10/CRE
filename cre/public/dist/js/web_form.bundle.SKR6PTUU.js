(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };

  // ../cre/cre/public/frappe/frappe/public/js/frappe/web_form/web_form_list.js
  frappe.provide("frappe.ui");
  frappe.provide("frappe.views");
  frappe.provide("frappe.web_form_list");
  var WebFormList = class {
    constructor(opts) {
      Object.assign(this, opts);
      frappe.web_form_list = this;
      this.wrapper = document.getElementById("list-table");
      this.make_actions();
      this.make_filters();
      $(".link-btn").remove();
    }
    refresh() {
      if (this.table) {
        Array.from(this.table.tBodies).forEach((tbody) => tbody.remove());
        let check = document.getElementById("select-all");
        if (check)
          check.checked = false;
      }
      this.rows = [];
      this.page_length = 20;
      this.web_list_start = 0;
      frappe.run_serially([
        () => this.get_list_view_fields(),
        () => this.get_data(),
        () => this.make_table(),
        () => this.create_more()
      ]);
    }
    make_filters() {
      this.filters = {};
      this.filter_input = [];
      const filter_area = document.getElementById("list-filters");
      frappe.call("frappe.website.doctype.web_form.web_form.get_web_form_filters", {
        web_form_name: this.web_form_name
      }).then((response) => {
        let fields = response.message;
        fields.forEach((field) => {
          let col = document.createElement("div.col-sm-4");
          col.classList.add("col", "col-sm-3");
          filter_area.appendChild(col);
          if (field.default)
            this.add_filter(field.fieldname, field.default, field.fieldtype);
          let input = frappe.ui.form.make_control({
            df: {
              fieldtype: field.fieldtype,
              fieldname: field.fieldname,
              options: field.options,
              only_select: true,
              label: __(field.label),
              onchange: (event) => {
                $("#more").remove();
                this.add_filter(field.fieldname, input.value, field.fieldtype);
                this.refresh();
              }
            },
            parent: col,
            value: field.default,
            render_input: 1
          });
          this.filter_input.push(input);
        });
        this.refresh();
      });
    }
    add_filter(field, value, fieldtype) {
      if (!value) {
        delete this.filters[field];
      } else {
        if (fieldtype === "Data")
          value = ["like", value + "%"];
        Object.assign(this.filters, Object.fromEntries([[field, value]]));
      }
    }
    get_list_view_fields() {
      return frappe.call({
        method: "frappe.website.doctype.web_form.web_form.get_in_list_view_fields",
        args: { doctype: this.doctype }
      }).then((response) => this.fields_list = response.message);
    }
    fetch_data() {
      return frappe.call({
        method: "frappe.www.list.get_list_data",
        args: __spreadValues({
          doctype: this.doctype,
          fields: this.fields_list.map((df) => df.fieldname),
          limit_start: this.web_list_start,
          web_form_name: this.web_form_name
        }, this.filters)
      });
    }
    async get_data() {
      let response = await this.fetch_data();
      this.data = await response.message;
    }
    more() {
      this.web_list_start += this.page_length;
      this.fetch_data().then((res) => {
        if (res.message.length === 0) {
          frappe.msgprint(__("No more items to display"));
        }
        this.append_rows(res.message);
      });
    }
    make_table() {
      this.columns = this.fields_list.map((df) => {
        return {
          label: df.label,
          fieldname: df.fieldname,
          fieldtype: df.fieldtype
        };
      });
      if (!this.table) {
        this.table = document.createElement("table");
        this.table.classList.add("table");
        this.make_table_head();
      }
      if (this.data.length) {
        this.append_rows(this.data);
        this.wrapper.appendChild(this.table);
      } else {
        let new_button = "";
        let empty_state = document.createElement("div");
        empty_state.classList.add("no-result", "text-muted", "flex", "justify-center", "align-center");
        frappe.has_permission(this.doctype, "", "create", () => {
          new_button = `
					<a
						class="btn btn-primary btn-sm btn-new-doc hidden-xs"
						href="${window.location.pathname}?new=1">
						${__("Create a new {0}", [__(this.doctype)])}
					</a>
				`;
          empty_state.innerHTML = `
					<div class="text-center">
						<div class="empty-img">
							<img
								src="/assets/frappe/images/ui-states/list-empty-state.svg"
								alt="Generic Empty State"
								class="null-state">
						</div>
						<p class="small mb-2">${__("No {0} found", [__(this.doctype)])}</p>
						${new_button}
					</div>
				`;
          this.wrapper.appendChild(empty_state);
        });
      }
    }
    make_table_head() {
      let thead = this.table.createTHead();
      let row = thead.insertRow();
      let th = document.createElement("th");
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "select-all";
      checkbox.onclick = (event) => this.toggle_select_all(event.target.checked);
      th.appendChild(checkbox);
      row.appendChild(th);
      add_heading(row, __("#"));
      this.columns.forEach((col) => {
        add_heading(row, __(col.label));
      });
      function add_heading(row2, label) {
        let th2 = document.createElement("th");
        th2.innerText = label;
        row2.appendChild(th2);
      }
    }
    append_rows(row_data) {
      const tbody = this.table.childNodes[1] || this.table.createTBody();
      row_data.forEach((data_item) => {
        let row_element = tbody.insertRow();
        row_element.setAttribute("id", data_item.name);
        let row = new frappe.ui.WebFormListRow({
          row: row_element,
          doc: data_item,
          columns: this.columns,
          serial_number: this.rows.length + 1,
          events: {
            onEdit: () => this.open_form(data_item.name),
            onSelect: () => this.toggle_delete()
          }
        });
        this.rows.push(row);
      });
    }
    make_actions() {
      const actions = document.querySelector(".list-view-actions");
      frappe.has_permission(this.doctype, "", "delete", () => {
        this.addButton(actions, "delete-rows", "danger", true, "Delete", () => this.delete_rows());
      });
      this.addButton(actions, "new", "primary", false, "New", () => window.location.href = window.location.pathname + "?new=1");
    }
    addButton(wrapper, id, type, hidden, name, action) {
      if (document.getElementById(id))
        return;
      const button = document.createElement("button");
      if (type == "secondary") {
        button.classList.add("btn", "btn-secondary", "btn-sm", "ml-2");
      } else if (type == "danger") {
        button.classList.add("btn", "btn-danger", "button-delete", "btn-sm", "ml-2");
      } else {
        button.classList.add("btn", "btn-primary", "btn-sm", "ml-2");
      }
      button.id = id;
      button.innerText = name;
      button.hidden = hidden;
      button.onclick = action;
      wrapper.appendChild(button);
    }
    create_more() {
      if (this.rows.length >= this.page_length) {
        const footer = document.querySelector(".list-view-footer");
        this.addButton(footer, "more", "secondary", false, "More", () => this.more());
      }
    }
    toggle_select_all(checked) {
      this.rows.forEach((row) => row.toggle_select(checked));
    }
    open_form(name) {
      window.location.href = window.location.pathname + "?name=" + name;
    }
    get_selected() {
      return this.rows.filter((row) => row.is_selected());
    }
    toggle_delete() {
      if (!this.settings.allow_delete)
        return;
      let btn = document.getElementById("delete-rows");
      btn.hidden = !this.get_selected().length;
    }
    delete_rows() {
      if (!this.settings.allow_delete)
        return;
      frappe.call({
        type: "POST",
        method: "frappe.website.doctype.web_form.web_form.delete_multiple",
        args: {
          web_form_name: this.web_form_name,
          docnames: this.get_selected().map((row) => row.doc.name)
        }
      }).then(() => {
        this.refresh();
        this.toggle_delete();
      });
    }
  };
  frappe.ui.WebFormListRow = class WebFormListRow {
    constructor({ row, doc, columns, serial_number, events, options }) {
      Object.assign(this, { row, doc, columns, serial_number, events });
      this.make_row();
    }
    make_row() {
      let cell = this.row.insertCell();
      cell.classList.add("list-col-checkbox");
      this.checkbox = document.createElement("input");
      this.checkbox.type = "checkbox";
      this.checkbox.onclick = (event) => {
        this.toggle_select(event.target.checked);
        event.stopImmediatePropagation();
      };
      cell.appendChild(this.checkbox);
      let serialNo = this.row.insertCell();
      serialNo.classList.add("list-col-serial");
      serialNo.innerText = this.serial_number;
      this.columns.forEach((field) => {
        let cell2 = this.row.insertCell();
        let formatter = frappe.form.get_formatter(field.fieldtype);
        cell2.innerHTML = this.doc[field.fieldname] && __(formatter(this.doc[field.fieldname], field, { only_value: 1 }, this.doc)) || "";
      });
      this.row.onclick = () => this.events.onEdit();
      this.row.style.cursor = "pointer";
    }
    toggle_select(checked) {
      this.checkbox.checked = checked;
      this.events.onSelect(checked);
    }
    is_selected() {
      return this.checkbox.checked;
    }
  };

  // frappe/public/js/frappe/event_emitter.js
  frappe.provide("frappe.utils");
  var EventEmitterMixin = {
    init() {
      this.jq = jQuery({});
    },
    trigger(evt, data) {
      !this.jq && this.init();
      this.jq.trigger(evt, data);
    },
    once(evt, handler) {
      !this.jq && this.init();
      this.jq.one(evt, (e, data) => handler(data));
    },
    on(evt, handler) {
      !this.jq && this.init();
      this.jq.bind(evt, (e, data) => handler(data));
    },
    off(evt, handler) {
      !this.jq && this.init();
      this.jq.unbind(evt, (e, data) => handler(data));
    }
  };
  frappe.utils.make_event_emitter = function(object) {
    Object.assign(object, EventEmitterMixin);
    return object;
  };
  var event_emitter_default = EventEmitterMixin;

  // ../cre/cre/public/frappe/frappe/public/js/frappe/web_form/web_form.js
  frappe.provide("frappe.ui");
  frappe.provide("frappe.web_form");
  var WebForm = class extends frappe.ui.FieldGroup {
    constructor(opts) {
      super();
      Object.assign(this, opts);
      frappe.web_form = this;
      frappe.web_form.events = {};
      Object.assign(frappe.web_form.events, event_emitter_default);
      this.current_section = 0;
    }
    prepare(web_form_doc, doc) {
      Object.assign(this, web_form_doc);
      this.fields = web_form_doc.web_form_fields;
      this.doc = doc;
    }
    make() {
      super.make();
      this.set_sections();
      this.set_field_values();
      this.setup_listeners();
      if (this.introduction_text)
        this.set_form_description(this.introduction_text);
      if (this.allow_print && !this.is_new)
        this.setup_print_button();
      if (this.is_new)
        this.setup_cancel_button();
      this.setup_primary_action();
      this.setup_previous_next_button();
      this.toggle_section();
      $(".link-btn").remove();
      frappe.init_client_script && frappe.init_client_script();
      frappe.web_form.events.trigger("after_load");
      this.after_load && this.after_load();
    }
    on(fieldname, handler) {
      let field = this.fields_dict[fieldname];
      field.df.change = () => {
        handler(field, field.value);
      };
    }
    setup_listeners() {
      let me = this;
      if (!me.is_multi_step_form) {
        return;
      }
      for (let field of $(".input-with-feedback")) {
        $(field).change((e) => {
          setTimeout(() => {
            e.stopPropagation();
            me.toggle_buttons();
          }, 200);
        });
      }
    }
    set_sections() {
      if (this.sections.length)
        return;
      this.sections = $(`.form-section`);
    }
    setup_previous_next_button() {
      let me = this;
      if (!me.is_multi_step_form) {
        return;
      }
      $(".web-form-footer").after(`
			<div id="form-step-footer" class="btn-list justify-content-end">
				<button class="btn btn-secondary btn-previous">${__("Previous")}</button>
				<button class="btn btn-primary btn-next">${__("Next")}</button>
			</div>
		`);
      $(".btn-previous").on("click", function() {
        let is_validated = me.validate_section();
        if (!is_validated)
          return;
        for (let idx = me.current_section; idx < me.sections.length; idx--) {
          let is_empty = me.is_previous_section_empty(idx);
          me.current_section = me.current_section > 0 ? me.current_section - 1 : me.current_section;
          if (!is_empty) {
            break;
          }
        }
        me.toggle_section();
      });
      $(".btn-next").on("click", function() {
        let is_validated = me.validate_section();
        if (!is_validated)
          return;
        for (let idx = me.current_section; idx < me.sections.length; idx++) {
          let is_empty = me.is_next_section_empty(idx);
          me.current_section = me.current_section < me.sections.length ? me.current_section + 1 : me.current_section;
          if (!is_empty) {
            break;
          }
        }
        me.toggle_section();
      });
    }
    set_field_values() {
      if (this.doc.name)
        this.set_values(this.doc);
      else
        return;
    }
    set_default_values() {
      let values = frappe.utils.get_query_params();
      delete values.new;
      this.set_values(values);
    }
    set_form_description(intro) {
      let intro_wrapper = document.getElementById("introduction");
      intro_wrapper.innerHTML = intro;
      intro_wrapper.classList.remove("hidden");
    }
    add_button(name, type, action, wrapper_class = ".web-form-actions") {
      const button = document.createElement("button");
      button.classList.add("btn", "btn-" + type, "ml-2", "py-1", "mx-1");
      button.innerHTML = name;
      button.onclick = action;
      document.querySelector(wrapper_class).appendChild(button);
    }
    add_button_to_footer(name, type, action) {
      this.add_button(name, type, action, ".web-form-footer");
    }
    add_button_to_header(name, type, action) {
      this.add_button(name, type, action, ".web-form-actions");
    }
    setup_primary_action() {
      this.add_button_to_header(this.button_label || __("Save", null, "Button in web form"), "primary", () => this.save());
      if (!this.is_multi_step_form && $(".frappe-card").height() > 600) {
        this.add_button_to_footer(this.button_label || __("Save", null, "Button in web form"), "primary", () => this.save());
      }
    }
    setup_cancel_button() {
      this.add_button_to_header(__("Cancel", null, "Button in web form"), "light", () => this.cancel());
    }
    setup_print_button() {
      this.add_button_to_header(frappe.utils.icon("print"), "light", () => this.print());
    }
    validate_section() {
      if (this.allow_incomplete)
        return true;
      let fields = $(`.form-section:eq(${this.current_section}) .form-control`);
      let errors = [];
      let invalid_values = [];
      for (let field of fields) {
        let fieldname = $(field).attr("data-fieldname");
        if (!fieldname)
          continue;
        field = this.fields_dict[fieldname];
        if (field.get_value) {
          let value = field.get_value();
          if (field.df.reqd && is_null(typeof value === "string" ? strip_html(value) : value))
            errors.push(__(field.df.label));
          if (field.df.reqd && field.df.fieldtype === "Text Editor" && is_null(strip_html(cstr(value))))
            errors.push(__(field.df.label));
          if (field.df.invalid)
            invalid_values.push(__(field.df.label));
        }
      }
      let message = "";
      if (invalid_values.length) {
        message += __("Invalid values for fields:", null, "Error message in web form");
        message += "<br><br><ul><li>" + invalid_values.join("<li>") + "</ul>";
      }
      if (errors.length) {
        message += __("Mandatory fields required:", null, "Error message in web form");
        message += "<br><br><ul><li>" + errors.join("<li>") + "</ul>";
      }
      if (invalid_values.length || errors.length) {
        frappe.msgprint({
          title: __("Error", null, "Title of error message in web form"),
          message,
          indicator: "orange"
        });
      }
      return !(errors.length || invalid_values.length);
    }
    toggle_section() {
      if (!this.is_multi_step_form)
        return;
      this.toggle_previous_button();
      this.hide_sections();
      this.show_section();
      this.toggle_buttons();
    }
    toggle_buttons() {
      for (let idx = this.current_section; idx < this.sections.length; idx++) {
        if (this.is_next_section_empty(idx)) {
          this.show_save_and_hide_next_button();
        } else {
          this.show_next_and_hide_save_button();
          break;
        }
      }
    }
    is_next_section_empty(section) {
      if (section + 1 > this.sections.length)
        return true;
      let _section = $(`.form-section:eq(${section + 1})`);
      let visible_controls = _section.find(".frappe-control:not(.hide-control)");
      return !visible_controls.length ? true : false;
    }
    is_previous_section_empty(section) {
      if (section - 1 > this.sections.length)
        return true;
      let _section = $(`.form-section:eq(${section - 1})`);
      let visible_controls = _section.find(".frappe-control:not(.hide-control)");
      return !visible_controls.length ? true : false;
    }
    show_save_and_hide_next_button() {
      $(".btn-next").hide();
      $(".web-form-footer").show();
    }
    show_next_and_hide_save_button() {
      $(".btn-next").show();
      $(".web-form-footer").hide();
    }
    toggle_previous_button() {
      this.current_section == 0 ? $(".btn-previous").hide() : $(".btn-previous").show();
    }
    show_section() {
      $(`.form-section:eq(${this.current_section})`).show();
    }
    hide_sections() {
      for (let idx = 0; idx < this.sections.length; idx++) {
        if (idx !== this.current_section) {
          $(`.form-section:eq(${idx})`).hide();
        }
      }
    }
    save() {
      let is_new = this.is_new;
      if (this.validate && !this.validate()) {
        frappe.throw(__("Couldn't save, please check the data you have entered"), __("Validation Error"));
      }
      let doc_values = super.get_values(this.allow_incomplete);
      if (!doc_values)
        return;
      if (window.saving)
        return;
      let for_payment = Boolean(this.accept_payment && !this.doc.paid);
      Object.assign(this.doc, doc_values);
      this.doc.doctype = this.doc_type;
      this.doc.web_form_name = this.name;
      window.saving = true;
      frappe.form_dirty = false;
      frappe.call({
        type: "POST",
        method: "frappe.website.doctype.web_form.web_form.accept",
        args: {
          data: this.doc,
          web_form: this.name,
          docname: this.doc.name,
          for_payment
        },
        callback: (response) => {
          if (!response.exc) {
            this.handle_success(response.message);
            frappe.web_form.events.trigger("after_save");
            this.after_save && this.after_save();
            if (is_new && (response.message.attachment || response.message.file)) {
              frappe.call({
                type: "POST",
                method: "frappe.handler.upload_file",
                args: {
                  file_url: response.message.attachment || response.message.file,
                  doctype: response.message.doctype,
                  docname: response.message.name
                }
              });
            }
          }
        },
        always: function() {
          window.saving = false;
        }
      });
      return true;
    }
    print() {
      window.open(`/printview?
			doctype=${this.doc_type}
			&name=${this.doc.name}
			&format=${this.print_format || "Standard"}`, "_blank");
    }
    cancel() {
      window.location.href = window.location.pathname;
    }
    handle_success(data) {
      if (this.accept_payment && !this.doc.paid) {
        window.location.href = data;
      }
      const success_message = this.success_message || __("Submitted");
      frappe.toast({ message: success_message, indicator: "green" });
      setTimeout(() => {
        if (this.success_url) {
          window.location.href = this.success_url;
        } else if (this.login_required) {
          window.location.href = window.location.pathname + "?name=" + data.name;
        }
      }, 2e3);
    }
  };

  // ../cre/cre/public/frappe/frappe/public/js/frappe/web_form/webform_script.js
  frappe.ready(function() {
    let query_params = frappe.utils.get_query_params();
    let wrapper = $(".web-form-wrapper");
    let is_list = parseInt(wrapper.data("is-list")) || query_params.is_list;
    let webform_doctype = wrapper.data("web-form-doctype");
    let webform_name = wrapper.data("web-form");
    let login_required = parseInt(wrapper.data("login-required"));
    let allow_delete = parseInt(wrapper.data("allow-delete"));
    let doc_name = query_params.name || "";
    let is_new = query_params.new;
    if (login_required)
      show_login_prompt();
    else if (is_list)
      show_grid();
    else
      show_form(webform_doctype, webform_name, is_new);
    document.querySelector("body").style.display = "block";
    function show_login_prompt() {
      const login_required2 = new frappe.ui.Dialog({
        title: __("Not Permitted"),
        primary_action_label: __("Login"),
        primary_action: () => {
          window.location.replace("/login?redirect-to=" + window.location.pathname);
        }
      });
      login_required2.set_message(__("You are not permitted to access this page."));
      login_required2.show();
    }
    function show_grid() {
      new WebFormList({
        parent: wrapper,
        doctype: webform_doctype,
        web_form_name: webform_name,
        settings: {
          allow_delete
        }
      });
    }
    function show_form() {
      let web_form = new WebForm({
        parent: wrapper,
        is_new,
        web_form_name: webform_name
      });
      get_data().then((r) => {
        const data = setup_fields(r.message);
        let web_form_doc = data.web_form;
        let doc = r.message.doc || build_doc(r.message);
        web_form.prepare(web_form_doc, r.message.doc && web_form_doc.allow_edit === 1 ? r.message.doc : {});
        web_form.make();
        web_form.set_default_values();
      });
      function build_doc(form_data) {
        let doc = {};
        form_data.web_form.web_form_fields.forEach((df) => {
          if (df.default)
            return doc[df.fieldname] = df.default;
        });
        return doc;
      }
      function get_data() {
        return frappe.call({
          method: "frappe.website.doctype.web_form.web_form.get_form_data",
          args: {
            doctype: webform_doctype,
            docname: doc_name,
            web_form_name: webform_name
          },
          freeze: true
        });
      }
      function setup_fields(form_data) {
        form_data.web_form.web_form_fields.map((df) => {
          df.is_web_form = true;
          if (df.fieldtype === "Table") {
            df.get_data = () => {
              let data = [];
              if (form_data.doc) {
                data = form_data.doc[df.fieldname];
              }
              return data;
            };
            df.fields = form_data[df.fieldname];
            $.each(df.fields || [], function(_i, field) {
              if (field.fieldtype === "Link") {
                field.only_select = true;
              }
              field.is_web_form = true;
            });
            if (df.fieldtype === "Attach") {
              df.is_private = true;
            }
            delete df.parent;
            delete df.parentfield;
            delete df.parenttype;
            delete df.doctype;
            return df;
          }
          if (df.fieldtype === "Link") {
            df.only_select = true;
          }
          if (["Attach", "Attach Image"].includes(df.fieldtype)) {
            if (typeof df.options !== "object") {
              df.options = {};
            }
            df.options.disable_file_browser = true;
          }
        });
        return form_data;
      }
    }
  });
})();
//# sourceMappingURL=web_form.bundle.SKR6PTUU.js.map
