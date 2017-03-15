<form class="form" action="" method="post">
    {{#if title}}
    <h1>{{title}}</h1>
    {{/if}}

    {{#if description}}
    <p>{{description}}</p>
    {{/if}}

    <div data-view="Form.Body"></div>

    {{#unless isView}}
    <div class="form-actions">
        <button type="submit" class="address-edit-form-button-submit">
            {{#if isNew}}
                {{translate 'Add'}}
            {{else}}
                {{translate 'Save'}}
            {{/if}}
        </button>
    </div>
    {{/unless}}
</form>