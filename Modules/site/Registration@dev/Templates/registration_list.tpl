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


    <!-- div class="registration-list-header-nav">
        <div class="registration-list-header-button-group">
            {{#if openIsActive}}
                <span class="registration-list-header-button-open-active">{{translate 'Open'}}</span>
            {{else}}
                <a href="/open-purchases" class="registration-list-header-button-open">{{translate 'Open'}}</a>
            {{/if}}

            {{#if allIsActive}}
                <span class="registration-list-header-button-all-active">{{translate 'All'}}</span>
            {{else}}
                <a href="/purchases" class="registration-list-header-button-all">{{translate 'All'}}</a>
            {{/if}}
        </div>
    </div -->

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
                <h5>{{translate 'You don\'t have any registrations in your account right now.'}}</h5>

                {{#unless allIsActive}}
                    <p>{{translate 'To see a list of all your registrations, you can go to the tab <a href="/registrations" class="">All</a>.'}}</p>
                {{/unless}}
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