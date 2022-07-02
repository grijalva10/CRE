frappe.provide('frappe.views');
frappe.views.ListSidebar = class ListSidebar {
	constructor(opts) {
		$.extend(this, opts);
		$('.col-lg-2.layout-side-section').html(main)
	}
}

var main = `<div class="list-sidebar overlay-sidebar hidden-xs hidden-sm">
				<div class="desk-sidebar list-unstyled sidebar-menu"><div class="standard-sidebar-section"><div class="standard-sidebar-label">Modules</div><a href="/app/home" class="desk-sidebar-item standard-sidebar-item selected">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-getting-started"></use>
		</svg></span>
					<span class="sidebar-item-label">Dashboard<span>
				</span></span></a><a href="/app/dashboards" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-accounting"></use>
		</svg></span>
					<span class="sidebar-item-label">Accounting<span>
				</span></span></a><a href="/app/assets" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-assets"></use>
		</svg></span>
					<span class="sidebar-item-label">Assets<span>
				</span></span></a><a href="/app/build" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-tool"></use>
		</svg></span>
					<span class="sidebar-item-label">Build<span>
				</span></span></a><a href="/app/buying" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-buying"></use>
		</svg></span>
					<span class="sidebar-item-label">Buying<span>
				</span></span></a><a href="/app/crm" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-crm"></use>
		</svg></span>
					<span class="sidebar-item-label">CRM<span>
				</span></span></a><a href="/app/hr" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-hr"></use>
		</svg></span>
					<span class="sidebar-item-label">HR<span>
				</span></span></a><a href="/app/loans" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-loan"></use>
		</svg></span>
					<span class="sidebar-item-label">Loans<span>
				</span></span></a><a href="/app/payroll" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-money-coins-1"></use>
		</svg></span>
					<span class="sidebar-item-label">Payroll<span>
				</span></span></a><a href="/app/projects" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-project"></use>
		</svg></span>
					<span class="sidebar-item-label">Projects<span>
				</span></span></a><a href="/app/quality" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-quality"></use>
		</svg></span>
					<span class="sidebar-item-label">Quality<span>
				</span></span></a><a href="/app/selling" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-sell"></use>
		</svg></span>
					<span class="sidebar-item-label">Selling<span>
				</span></span></a><a href="/app/stock" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-stock"></use>
		</svg></span>
					<span class="sidebar-item-label">Stock<span>
				</span></span></a><a href="/app/support" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-support"></use>
		</svg></span>
					<span class="sidebar-item-label">Support<span>
				</span></span></a><a href="/app/website" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-website"></use>
		</svg></span>
					<span class="sidebar-item-label">Website<span>
				</span></span></a><a href="/app/settings" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-setting"></use>
		</svg></span>
					<span class="sidebar-item-label">Settings<span>
				</span></span></a><a href="/app/utilities" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-folder-normal"></use>
		</svg></span>
					<span class="sidebar-item-label">Utilities<span>
				</span></span></a></div><div class="standard-sidebar-section"><div class="standard-sidebar-label">Domains</div><a href="/app/manufacturing" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-organization"></use>
		</svg></span>
					<span class="sidebar-item-label">Manufacturing<span>
				</span></span></a><a href="/app/retail" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-retail"></use>
		</svg></span>
					<span class="sidebar-item-label">Retail<span>
				</span></span></a></div><div class="standard-sidebar-section"><div class="standard-sidebar-label">Administration</div><a href="/app/customization" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-customization"></use>
		</svg></span>
					<span class="sidebar-item-label">Customization<span>
				</span></span></a><a href="/app/integrations" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-integration"></use>
		</svg></span>
					<span class="sidebar-item-label">Integrations<span>
				</span></span></a><a href="/app/tools" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-tool"></use>
		</svg></span>
					<span class="sidebar-item-label">Tools<span>
				</span></span></a><a href="/app/users" class="desk-sidebar-item standard-sidebar-item ">
					<span><svg class="icon icon-md" style="">
			<use class="" href="#icon-users"></use>
		</svg></span>
					<span class="sidebar-item-label">Users<span>
				</span></span></a></div></div>
			</div>`;
