{{#if showBackToAccount}}
    <a href="/" class="crud-list-button-back crud-id-{{crudId}}">
        <i class="crud-list-button-back-icon"></i>
        {{translate 'Back to Account'}}
    </a>
{{/if}}

<section class="crud-list crud-id-{{crudId}}">
    <header class="crud-list-header">
        <h2>{{pageHeader}}</h2>
    </header>

    <div class="crud-list-main-actions">
        <div class="crud-list-main-actions-row">
            <div class="crud-list-header-nav" data-view="CRUD.Statuses"></div>
            {{#if showNewButton}}
            <div class="crud-list-new">
                <a href="{{newUrl}}" class="crud-list-new-button">{{translate 'New'}}</a>
            </div>
            {{/if}}
        </div>
    </div>

    <div data-view="ListHeader"></div>

    {{#if collectionLengthGreaterThan0}}
        <div class="crud-list-recordviews-container">
            <table class="crud-list-recordviews-table {{#if rowsAreClickable}}clickable-rows{{/if}}">
                <thead class="crud-list-recordviews-header">
                    <tr>
                        <th class="crud-list-recordviews-title-header">
                            <span>{{translate 'Id'}}</span>
                        </th>
                        {{#each listColumns}}
                        <th class="crud-list-recordviews-{{type}}-header">
                            <span>{{translate title}}</span>
                        </th>
                        {{/each}}
                        <th class="crud-list-recordviews-actions-header">
                            {{#if showActionsHeader}}<span>{{translate 'Actions'}}</span>{{/if}}
                        </th>
                    </tr>
                </thead>
                <tbody class="crud-list" data-view="ListResults"></tbody>
            </table>
        </div>

    {{else}}
        {{#if isLoading}}
            <p class="crud-list-empty">{{translate 'Loading...'}}</p>
        {{else}}
            <div class="crud-list-empty-section">
                <h5>{{translate 'You don\'t have any entries that match the selected criteria.'}}</h5>
            </div>
        {{/if}}

    {{/if}}

    {{#if showPagination}}
        <div class="crud-list-case-list-paginator">
            <div data-view="GlobalViews.Pagination"></div>
            {{#if showCurrentPage}}
                <div data-view="GlobalViews.ShowCurrentPage"></div>
            {{/if}}
        </div>
    {{/if}}
</section>