<section class="form-actions">
    {{#if isView}}
        <a href="{{editUrl}}" class="form-action-edit">
            {{translate 'Edit'}}
        </a>
        <a href="{{goBackUrl}}" class="form-action-cancel">
            {{translate 'View All'}}
        </a>
    {{else}}
        <button type="submit" class="form-action-submit">
            {{#if isNew}}
                {{translate 'Add'}}
            {{else}}
                {{translate 'Save'}}
            {{/if}}
        </button>
        {{#if showCancelLink}}
            <a href="{{cancelUrl}}" class="form-action-cancel">
                {{translate 'Cancel'}}
            </a>
        {{/if}}
    {{/if}}
</section>