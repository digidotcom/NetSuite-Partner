<section class="form-actions {{#if inHeader}}in-header{{/if}}">
{{#if showContent}}
    {{#each customActions}}
        {{#if isSubmit}}
        <button type="submit" class="form-actions-custom" data-action="{{name}}">
            {{translate label}}
        </button>
        {{else}}
        <a class="form-actions-custom" data-action="{{name}}">
            {{translate label}}
        </a>
        {{/if}}
    {{/each}}
    {{#if showEditLink}}
        <a href="{{editUrl}}" class="form-actions-edit">
            {{translate 'Edit'}}
        </a>
    {{/if}}
    {{#if showViewAllLink}}
        <a href="{{viewAllUrl}}" class="form-actions-cancel">
            {{translate 'View All'}}
        </a>
    {{/if}}
    {{#if showAddButton}}
        <button type="submit" class="form-actions-submit">
            {{translate 'Add'}}
        </button>
    {{/if}}
    {{#if showSaveButton}}
        <button type="submit" class="form-actions-submit">
            {{translate 'Save'}}
        </button>
    {{/if}}
    {{#if showCancelLink}}
        <a href="{{cancelUrl}}" class="form-actions-cancel">
            {{translate 'Cancel'}}
        </a>
    {{/if}}
{{/if}}
</section>