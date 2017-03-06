{{#if showBackToAccount}}
    <a href="/" class="registration-list-button-back">
        <i class="registration-list-button-back-icon"></i>
        {{translate 'Back to Account'}}
    </a>
{{/if}}

<section class="registration-list">
    <header class="registration-list-header">
        <h2>{{pageHeader}}</h2>
    </header>

    <div class="registration-list-header-nav" data-view="Registration.Statuses"></div>

    <div data-view="ListHeader" {{#if openIsActive}}style="display:none;"{{/if}}></div>

    {{#if collectionLengthGreaterThan0}}
        <div class="registration-list-recordviews-container">
            <table class="registration-list-recordviews-table">
                <thead class="registration-list-recordviews-header">
                <tr>
                    <th class="registration-list-recordviews-id-header">
                        <span>{{translate 'Id'}}</span>
                    </th>
                    <th class="registration-list-recordviews-date-header">
                        <span>{{translate 'Date'}}</span>
                    </th>
                    <th class="registration-list-recordviews-name-header">
                        <span>{{translate 'Name'}}</span>
                    </th>
                </tr>
                </thead>
                <tbody class="registration-list" data-view="ListResults"></tbody>
            </table>
        </div>

    {{else}}
        {{#if isLoading}}
            <p class="registration-list-empty">{{translate 'Loading...'}}</p>
        {{else}}
            <div class="registration-list-empty-section">
                <h5>{{translate 'You don\'t have any registrations that match the selected criteria.'}}</h5>
            </div>
        {{/if}}

    {{/if}}

    {{#if showPagination}}
        <div class="registration-list-case-list-paginator">
            <div data-view="GlobalViews.Pagination"></div>
            {{#if showCurrentPage}}
                <div data-view="GlobalViews.ShowCurrentPage"></div>
            {{/if}}
        </div>
    {{/if}}
</section>