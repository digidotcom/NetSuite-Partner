<section class="form-group" data-id="{{id}}">
{{#if showContent}}
    {{#unless isMainGroup}}
    <h2 class="form-group-name">{{name}}</h2>
    <hr />
    {{/unless}}
    <div data-view="Form.Fields"></div>
{{/if}}
</section>