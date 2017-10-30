<div class="form-lookup">
    {{#if areResults}}
    <div class="form-lookup-results">
        <ul>
        {{#each results}}
            <li><a data-result data-result-id="{{internalid}}" data-result-name="{{name}}">{{text}}</a></li>
        {{/each}}
        </ul>
    </div>
    {{else}}
    <div class="form-lookup-results no-results">
        <p>{{translate 'No entry matches the provided search.'}}</p>
    </div>
    {{/if}}
</div>