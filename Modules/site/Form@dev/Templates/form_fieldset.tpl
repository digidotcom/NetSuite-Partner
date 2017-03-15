<div class="form-fieldset">
    {{#if hasRequiredFields}}
        <small class="form-fields">{{translate 'Required'}} <span class="form-fields-required">*</span></small>
    {{/if}}
    <div data-type="backbone.collection.view.rows"></div>
</div>