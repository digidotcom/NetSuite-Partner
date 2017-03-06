<div class="registration-list-header-button-group">
    {{#each statuses}}
        {{#if isActive}}
            <span class="registration-list-header-button-active">{{translate name}}</span>
        {{else}}
            <a href="/registrations{{#if value}}?status={{value}}{{/if}}" class="registration-list-header-button">{{translate name}}</a>
        {{/if}}
    {{/each}}
</div>