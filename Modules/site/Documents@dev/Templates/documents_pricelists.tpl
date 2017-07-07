{{#if showBackToAccount}}
    <a href="/" class="documents-pricelist-button-back">
        <i class="documents-pricelist-button-back-icon"></i>
        {{translate 'Back to Account'}}
    </a>
{{/if}}

<section class="documents-pricelist">
    <header>
        <div class="documents-pricelist-main-actions">
            <div class="documents-pricelist-main-actions-row">
                <h2>{{pageHeader}}</h2>
            </div>
        </div>
        <div class="documents-pricelist-list-header {{#if showListHeader}}hide{{/if}}" data-view="ListHeader"></div>
    </header>

    {{#if collectionLengthGreaterThan0}}
        <div class="documents-pricelist-recordviews-container">
            <table class="documents-pricelist-recordviews-table {{#if rowsAreClickable}}clickable-rows{{/if}}">
                <thead class="documents-pricelist-recordviews-header">
                <tr>
                    <th class="documents-pricelist-recordviews-title-header">
                        <span>{{translate 'ID'}}</span>
                    </th>
                    <th class="documents-pricelist-recordviews-{{type}}-header">
                        <span>{{translate 'Name'}}</span>
                    </th>
                    <th class="documents-pricelist-recordviews-{{type}}-header">
                        <span>{{translate 'File Name'}}</span>
                    </th>
                    <th class="documents-pricelist-recordviews-actions-header">
                        {{#if showActionsHeader}}<span>{{translate 'Actions'}}</span>{{/if}}
                    </th>
                </tr>
                </thead>
                <tbody class="documents-pricelist-results" data-view="ListResults"></tbody>
            </table>
        </div>
    {{else}}
        {{#if isLoading}}
            <p class="documents-pricelist-empty">{{translate 'Loading...'}}</p>
        {{else}}
            <div class="documents-pricelist-empty-section">
                <h5>{{translate 'There are no files available.'}}</h5>
            </div>
        {{/if}}

    {{/if}}

    {{#if showPagination}}
        <div class="documents-pricelist-case-list-paginator">
            <div data-view="GlobalViews.Pagination"></div>
            {{#if showCurrentPage}}
                <div data-view="GlobalViews.ShowCurrentPage"></div>
            {{/if}}
        </div>
    {{/if}}
</section>