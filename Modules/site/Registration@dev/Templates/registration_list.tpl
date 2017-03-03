{{#if showBackToAccount}}
    <a href="/" class="order-history-list-button-back">
        <i class="order-history-list-button-back-icon"></i>
        {{translate 'Back to Account'}}
    </a>
{{/if}}

<section class="order-history-list">
    <header class="order-history-list-header">
        <h2>{{pageHeader}}</h2>
    </header>


    <!-- div class="order-history-list-header-nav">
        <div class="order-history-list-header-button-group">
            {{#if openIsActive}}
                <span class="order-history-list-header-button-open-active">{{translate 'Open'}}</span>
            {{else}}
                <a href="/open-purchases" class="order-history-list-header-button-open">{{translate 'Open'}}</a>
            {{/if}}

            {{#if allIsActive}}
                <span class="order-history-list-header-button-all-active">{{translate 'All'}}</span>
            {{else}}
                <a href="/purchases" class="order-history-list-header-button-all">{{translate 'All'}}</a>
            {{/if}}
        </div>
    </div -->

    <div data-view="ListHeader" {{#if openIsActive}}style="display:none;"{{/if}}></div>

    {{#if collectionLengthGreaterThan0}}
        <div class="order-history-list-recordviews-container">
            <table class="order-history-list-recordviews-actionable-table">
                <thead class="order-history-list-recordviews-actionable-header">
                <tr>
                    <th class="order-history-list-recordviews-actionable-title-header">
                        <span>{{translate 'Id'}}</span>
                    </th>
                    <th class="order-history-list-recordviews-actionable-date-header">
                        <span>{{translate 'Date'}}</span>
                    </th>
                    <th class="order-history-list-recordviews-actionable-origin-header">
                        <span>{{translate 'Name'}}</span>
                    </th>
                </tr>
                </thead>
                <tbody class="order-history-list" data-view="ListResults"></tbody>
            </table>
        </div>

    {{else}}
        {{#if isLoading}}
            <p class="order-history-list-empty">{{translate 'Loading...'}}</p>
        {{else}}
            <div class="order-history-list-empty-section">
                <h5>{{translate 'You don\'t have any registrations in your account right now.'}}</h5>

                {{#unless allIsActive}}
                    <p>{{translate 'To see a list of all your registrations, you can go to the tab <a href="/registrations" class="">All</a>.'}}</p>
                {{/unless}}
            </div>
        {{/if}}

    {{/if}}

    {{#if showPagination}}
        <div class="order-history-list-case-list-paginator">
            <div data-view="GlobalViews.Pagination"></div>
            {{#if showCurrentPage}}
                <div data-view="GlobalViews.ShowCurrentPage"></div>
            {{/if}}
        </div>
    {{/if}}
</section>