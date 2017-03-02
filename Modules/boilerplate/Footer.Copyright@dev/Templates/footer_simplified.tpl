{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

<div data-view="Global.BackToTop"></div>
<div class="footer-simplified-content">
	<div class="footer-simplified-content-nav"></div>
	<div id="banner-footer" class="content-banner banner-footer" data-cms-area="simplified_footer_banner" data-cms-area-filters="global"></div>

	<div class="footer-simplified-content-copyright">
        {{#with copyright}}
            {{#unless hide}}
                {{#if showRange}}
                    {{translate '&copy; $(0)-$(1) $(2)' initialYear currentYear companyName}}
                {{else}}
                    {{translate '&copy; $(0) $(1)' currentYear companyName}}
                {{/if}}
            {{/unless}}
        {{/with}}
	</div>
</div>