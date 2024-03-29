{{#unless isRerendering}}
<div class="form-fields form-fields-lookup" data-input="{{attribute}}" data-validation="control-group">
{{/unless}}
{{#if showContent}}
    <label class="form-fields-label" for="{{attribute}}{{nameFieldSuffix}}">
        {{translate label}}
        {{#unless showInline}}
            {{#if isRequired}}
                <span class="form-fields-label-required">*</span>
            {{else}}
                <p class="form-fields-label-optional">{{translate '(optional)'}}</p>
            {{/if}}
            {{#if tooltip}}
                <i class="form-fields-icon-question-sign" data-toggle="tooltip" title="" data-original-title="{{translate tooltip}}"></i>
            {{/if}}
        {{/unless}}
    </label>
    <div class="form-fields-form-controls" data-validation="control">
        <input type="hidden" class="form-fields-input-hidden" id="{{attribute}}" name="{{attribute}}" data-value="{{id}}" value="" />
        {{#if showInline}}
            <p data-type="search" class="form-fields-input-inline" id="{{attribute}}{{nameFieldSuffix}}" data-name="{{attribute}}" data-value="{{selectedValue}}">
                {{#if isInlineEmpty}}
                    {{translate '(no data)'}}
                {{else}}
                    {{selectedName}}
                {{/if}}
            </p>
        {{else}}
            <input type="search" class="form-fields-input" id="{{attribute}}{{nameFieldSuffix}}" name="{{attribute}}{{nameFieldSuffix}}" data-value="{{selectedValue}}" data-selected-name="{{selectedName}}" value="" />
            <i class="form-fields-input-search-icon" data-lookup-trigger></i>
            {{#if help}}
            <p class="form-fields-input-help">{{{translate help}}}</p>
            {{/if}}
        {{/if}}
    </div>
{{/if}}
{{#unless isRerendering}}
</div>
{{/unless}}