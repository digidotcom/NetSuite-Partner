define('SiteSearch.View.CRUD', [
    'underscore',
    'Backbone.CompositeView',
    'Session',
    'SC.Configuration',
    'SiteSearch.View',
    'CRUD.Helper',
    'CRUD.Search.Typeahead.View'
], function CrudRouter(
    _,
    BackboneCompositeView,
    Session,
    Configuration,
    SiteSearchView,
    CrudHelper,
    CrudSearchTypeaheadView
) {
    'use strict';

    _(SiteSearchView.prototype).extend({
        /* eslint-disable */
        initialize: function ()
        {
            this.itemsSearcherComponent = new CrudSearchTypeaheadView({
                minLength: Configuration.get('typeahead.minLength', 3)
            ,	maxLength: Configuration.get('searchPrefs.maxLength', 0)
            ,	limit: Configuration.get('typeahead.maxResults', 10)
            ,	sort: Configuration.get('typeahead.sort','relevance:asc')
            ,	highlight: Configuration.get('typeahead.highlight', true)
            });

            this.itemsSearcherComponent.on('itemSelected', this.onItemSelected, this);
            this.itemsSearcherComponent.on('keyUp', this.showReset, this);
            this.itemsSearcherComponent.on('keyDown', this.cleanSearchOnEnter, this);

            BackboneCompositeView.add(this);
        },
        /* eslint-enable */

        /* eslint-disable */
        executeSearch: function (keywords)
        {
            var search_url = CrudHelper.getSearchResultsUrl()// _.getPathFromObject(Configuration, 'defaultSearchUrl')
            ,	keywordsDelimited = '?' + CrudHelper.getSearchQueryKey() + '=';

            // If we are not in Shopping we have to redirect to it
            if (_.getPathFromObject(Configuration, 'currentTouchpoint') !== 'customercenter'/* 'home' */)
            {
                window.location.href = Session.get('touchpoints.home') + '#' + search_url + keywordsDelimited + keywords;
            }
            // Else we stay in the same app
            else
            {
                // We navigate to the default search url passing the keywords
                Backbone.history.navigate(search_url + keywordsDelimited + keywords /*+ this.getCurrentSearchOptions()*/, {trigger: true});
            }
        },
        /* eslint-enable */

        /* eslint-disable */
        onItemSelected: function (result)
        {
            var item = result.selectedItem
            ,	collection = result.collection
            ,	query = result.currentQuery;

            this.$('[data-type="search-reset"]').hide();
            this.itemsSearcherComponent.cleanSearch(true);

            if (item)
            {
                var path = item.get('_url');

                if (Configuration.get('currentTouchpoint','') !== 'customercenter')
                {
                    window.location.href = Session.get('touchpoints.customercenter') + '#' + path;
                }
                else
                {
                    Backbone.history.navigate(path, {trigger: true});
                }
            }
            else
            {
                if (!collection.length && result.isResultCompleted)
                {
                    return false;
                }
                else
                {
                    this.executeSearch(query);
                }
            }
        }
        /* eslint-enable */
    });
});
