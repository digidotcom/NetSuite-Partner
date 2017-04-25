<section class="form-group" data-id="{{id}}">
{{#if showContent}}
    {{#unless isMainGroup}}
    <h2 class="form-group-name">{{name}}</h2>
    <hr />
    {{/unless}}
    {{#if hasHiddenFields}}
    <div data-view="Form.Fields.Hidden"></div>
    {{/if}}
    {{#if hasVisibleFields}}
    <div data-view="Form.Fields"></div>
    {{/if}}
{{/if}}
</section>