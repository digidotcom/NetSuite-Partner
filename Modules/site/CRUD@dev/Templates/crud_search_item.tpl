{{!
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
}}

{{#if isItemSelected}}
	<a class="itemssearcher-item-results" data-hashtag="{{model._url}}" data-touchpoint="customercenter">
	    <div class="itemssearcher-item-results-image">
	    </div>
	    <div class="itemssearcher-item-results-content">
	        <div class="itemssearcher-item-results-title">
	            {{translate '<em>$(0)</em>: ' model._record}} {{highlightKeyword model._name currentQuery}}
	        </div>
	    </div>
	</a>
{{else}}
	<div class="itemssearcher-item-shadow"></div>
	{{#if hasResults}}
	{{else}}
		{{#if isAjaxDone}}
			<div class="itemssearcher-item-no-results">
				{{translate 'No results'}}
				<span class="hide">{{currentQuery}}</span>
			</div>
		{{else}}
			<div class="itemssearcher-item-searching">
				{{translate 'Searching...'}}
				<span class="hide">{{currentQuery}}</span>
			</div>
		{{/if}}
	{{/if}}
{{/if}}