{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div class="requestquote-wizard-module-header">
	<h1 class="requestquote-wizard-module-header-title">
		{{translate 'Request a Quote'}}

		{{#if hasItem}}
			<small class="requestquote-wizard-module-header-title-count">
				{{#if hasOneItem}}
					{{translate '1 item'}}
				{{else}}
					{{translate '$(0) items'  productsLength}}
				{{/if}}
			</small>
		{{else}}
			<span class="requestquote-wizard-module-header-title-count-disabled">
				{{translate 'No Items Yet'}}
			</span>
		{{/if}}
	</h1>
	<a class="requestquote-wizard-module-header-title-button" href="#" data-action="submit-step">
		{{translate 'Submit Quote Request'}}
	</a>
</div>