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
            {{actionsLabels.edit}}
        </a>
    {{/if}}
    {{#if showViewAllLink}}
        <a href="{{viewAllUrl}}" class="form-actions-cancel">
            {{actionsLabels.viewAll}}
        </a>
    {{/if}}
    {{#if showAddAndNewButton}}
        <button type="submit" class="form-actions-submit-secondary" data-add-and-new>
            {{actionsLabels.addAndNew}}
        </button>
    {{/if}}
    {{#if showAddButton}}
        <button type="submit" class="form-actions-submit">
            {{actionsLabels.add}}
        </button>
    {{/if}}
    {{#if showSaveButton}}
        <button type="submit" class="form-actions-submit">
            {{actionsLabels.save}}
        </button>
    {{/if}}
    {{#if showCancelLink}}
        <a href="{{cancelUrl}}" class="form-actions-cancel">
            {{actionsLabels.cancel}}
        </a>
    {{/if}}
{{/if}}
</section>