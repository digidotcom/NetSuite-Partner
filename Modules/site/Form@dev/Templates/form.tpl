{{#if showContent}}
<form class="form" action="" method="post">
    {{#if isLoading}}
    <div class="form-loading">
        <p>{{translate 'Loading...'}}</p>
    </div>
    {{else}}
    <div data-view="Form.Info"></div>

    <div data-view="Form.Body"></div>

    <div data-view="Form.Actions"></div>
    {{/if}}
</form>
{{/if}}