<div class="registration-list-header-button-group">
    {{#each statuses}}
        {{#if isActive}}
            <span class="registration-list-header-button-active">{{translate name}}</span>
        {{else}}
            <a href="{{url}}" class="registration-list-header-button">{{translate name}}</a>
        {{/if}}
    {{/each}}
</div>