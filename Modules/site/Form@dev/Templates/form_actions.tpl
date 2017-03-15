<section class="form-actions {{#if inHeader}}in-header{{/if}}">
    {{#if isView}}
        <a href="{{editUrl}}" class="form-actions-edit">
            {{translate 'Edit'}}
        </a>
        <a href="{{goBackUrl}}" class="form-actions-cancel">
            {{translate 'View All'}}
        </a>
    {{else}}
        <button type="submit" class="form-actions-submit">
            {{#if isNew}}
                {{translate 'Add'}}
            {{else}}
                {{translate 'Save'}}
            {{/if}}
        </button>
        {{#if showCancelLink}}
            <a href="{{cancelUrl}}" class="form-actions-cancel">
                {{translate 'Cancel'}}
            </a>
        {{/if}}
    {{/if}}
</section>