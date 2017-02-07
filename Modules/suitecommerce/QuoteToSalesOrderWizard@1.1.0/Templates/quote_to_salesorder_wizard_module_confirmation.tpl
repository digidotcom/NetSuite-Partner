{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="quote-to-salesorder-wizard-module-confirmation">
	<h2 class="quote-to-salesorder-wizard-module-confirmation-title">{{translate 'Thank you!'}}</h2>
	<p class="quote-to-salesorder-wizard-module-confirmation-body">
		{{translate 'Your order number is <a href="/purchases/view/salesorder/$(0)">#$(1)</a>' orderId orderNumber}}
	</p>
	<p class="quote-to-salesorder-wizard-module-confirmation-body">{{translate 'We received your order and will process it right away.'}}</p>
	<p class="quote-to-salesorder-wizard-module-confirmation-body">
		{{#if hasSalesrep}}
			{{translate 'For immediate assistance call us at <strong>$(0)</strong> or email us at <strong>$(1)</strong>' salesrepPhone salesrepEmail}}
		{{else}}
			{{{disclaimer}}}
		{{/if}}
	</p>
	<a class="quote-to-salesorder-wizard-module-confirmation-continue" href="/quotes">{{translate 'Go Back to List of Quotes'}}</a>
</div>