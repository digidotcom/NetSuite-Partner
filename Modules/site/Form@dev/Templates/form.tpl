<form class="form" action="" method="post">

    <fieldset data-view="Form.Fieldset"></fieldset>

    <div class="form-actions">
        <button type="submit" class="address-edit-form-button-submit">
            {{#if isNew}}
                {{translate 'Add'}}
            {{else}}
                {{translate 'Save'}}
            {{/if}}
        </button>
    </div>
</form>