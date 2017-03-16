<div class="form-fields form-fields-lookup" data-input="{{attribute}}" data-validation="control-group">
    <label class="form-fields-label" for="{{attribute}}">
        {{translate label}}
        {{#unless isView}}
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
        {{#if isView}}
            <p data-type="search" class="form-fields-input-readonly" id="{{attribute}}" data-name="{{attribute}}" data-internalid="{{id}}">{{value}}</p>
        {{else}}
            <input type="hidden" class="form-fields-input-hidden" id="{{attribute}}_internalid" name="{{attribute}}_internalid" data-value="{{id}}" value="" />
            <input type="search" class="form-fields-input" id="{{attribute}}" name="{{attribute}}" data-value="{{selectedValue}}" data-selected-name="{{selectedName}}" value="" />
            {{#if help}}
            <p class="form-fields-input-help">{{{translate help}}}</p>
            {{/if}}
        {{/if}}
    </div>
</div>