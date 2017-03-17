<div class="form-fields form-fields-text form-fields-text-{{type}}" data-input="{{attribute}}" data-validation="control-group">
    <label class="form-fields-label" for="{{attribute}}">
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
        {{#if showInline}}
            <p data-type="{{type}}" class="form-fields-input-inline" id="{{attribute}}" data-name="{{attribute}}">
                {{#if isInlineEmpty}}
                    {{translate '(no data)'}}
                {{else}}
                    {{value}}
                {{/if}}
            </p>
        {{else}}
            <input type="{{inputType}}" class="form-fields-input" id="{{attribute}}" name="{{attribute}}" data-value="{{value}}" value="" />
            {{#if help}}
            <p class="form-fields-input-help">{{{translate help}}}</p>
            {{/if}}
        {{/if}}
    </div>
</div>