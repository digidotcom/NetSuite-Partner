<div class="crud-list-header-button-group">
    {{#each categories}}
        {{#if isActive}}
            <span class="crud-list-header-button-active">{{translate name}}</span>
        {{else}}
            <a href="{{url}}" class="crud-list-header-button">{{translate name}}</a>
        {{/if}}
    {{/each}}
</div>