<div class="form-info">
{{#if showContent}}
    <div class="form-info-header">
        {{#if title}}
        <div class="form-info-header-title">
            {{#unless isLoading}}
            <h1 class="form-info-header-title-heading">{{title}}</h1>
            {{/unless}}
        </div>
        {{/if}}
        <div class="form-info-header-actions {{#if title}}has-title{{/if}}" data-view="Form.Actions"></div>
    </div>
    <div class="form-info-body">
        {{#if description}}
            <p>{{description}}</p>
        {{/if}}
    </div>
{{/if}}
</div>