{{#if showBackToAccount}}
    <a href="/" class="crud-search-results-button-back">
        <i class="crud-search-results-button-back-icon"></i>
        {{translate 'Back to Account'}}
    </a>
{{/if}}

<section class="crud-search-results">
    <header>
        <div class="crud-search-results-main-actions">
            <div class="crud-search-results-main-actions-row">
                <h2>{{pageHeader}}</h2>
            </div>
        </div>
        <div class="crud-search-results-list-header {{#if showListHeader}}hide{{/if}}" data-view="ListHeader"></div>
    </header>

    {{#if collectionLengthGreaterThan0}}
        <div class="crud-search-results-recordviews-container">
            <table class="crud-search-results-recordviews-table {{#if rowsAreClickable}}clickable-rows{{/if}}">
                <thead class="crud-search-results-recordviews-header">
                <tr>
                    <th class="crud-search-results-recordviews-title-header">
                        <span>{{translate 'ID'}}</span>
                    </th>
                    <th class="crud-search-results-recordviews-{{type}}-header">
                        <span>{{translate 'Type'}}</span>
                    </th>
                    <th class="crud-search-results-recordviews-{{type}}-header">
                        <span>{{translate 'Name'}}</span>
                    </th>
                    <th class="crud-search-results-recordviews-actions-header">
                        {{#if showActionsHeader}}<span>{{translate 'Actions'}}</span>{{/if}}
                    </th>
                </tr>
                </thead>
                <tbody class="crud-search-results-results" data-view="ListResults"></tbody>
            </table>
        </div>
    {{else}}
        {{#if isLoading}}
            <p class="crud-search-results-empty">{{translate 'Loading...'}}</p>
        {{else}}
            <div class="crud-search-results-empty-section">
                {{#if hasQuery}}
                <h5>{{translate 'There are no results that match the criteria.'}}</h5>
                {{else}}
                <h5>{{translate 'Please provide a query to search.'}}</h5>
                {{/if}}
            </div>
        {{/if}}

    {{/if}}

    {{#if showPagination}}
        <div class="crud-search-results-case-list-paginator">
            <div data-view="GlobalViews.Pagination"></div>
            {{#if showCurrentPage}}
                <div data-view="GlobalViews.ShowCurrentPage"></div>
            {{/if}}
        </div>
    {{/if}}
</section>