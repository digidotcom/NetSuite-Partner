<div class="form-fields" data-input="{{attribute}}" data-validation="control-group">
    <label class="form-fields-label" for="{{attribute}}">
        {{translate label}}
        {{#if isRequired}}
            <span class="form-fields-label-required">*</span>
        {{else}}
            <p class="form-fields-label-optional">{{translate '(optional)'}}</p>
        {{/if}}
        {{#if tooltip}}
            <i class="form-fields-icon-question-sign" data-toggle="tooltip" title="" data-original-title="{{translate tooltip}}"></i>
        {{/if}}
    </label>
    <div class="form-fields-form-controls" data-validation="control">
        <input type="{{type}}" class="form-fields-input" id="{{attribute}}" name="{{attribute}}" value="" {{#if isRequired}}required{{/if}} />
        {{#if help}}
        <p class="form-fields-input-help">{{{translate help}}}</p>
        {{/if}}
    </div>
</div>