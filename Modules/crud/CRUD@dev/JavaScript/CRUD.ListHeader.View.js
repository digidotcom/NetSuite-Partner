define('CRUD.ListHeader.View', [
    'underscore',
    'ListHeader.View'
], function CrudListHeaderView(
    _,
    ListHeaderView
) {
    'use strict';

    return ListHeaderView.extend({

        getOrderFromUrl: function getOrderFromUrl(urlValue) {
            return urlValue === 'inverse' ? 1 : -1;
        },

        /* eslint-disable */
        updateUrl: function ()
        {
            var url = Backbone.history.fragment;
            // if the selected filter is the default one
            //   remove the filter parameter
            // else change it for the selected value
            url = this.isDefaultFilter(this.selectedFilter) ?
                _.removeUrlParameter(url, 'filter') :
                _.setUrlParameter(url, 'filter', _.isFunction(this.selectedFilter.value) ? this.selectedFilter.value.apply(this.view) : this.selectedFilter.value);
            // if the selected sort is the default one
            //   remove the sort parameter
            // else change it for the selected value
            url = this.isDefaultSort(this.selectedSort) ? _.removeUrlParameter(url, 'sort') : _.setUrlParameter(url, 'sort', this.selectedSort.value);
            // if the selected order is the default one
            //   remove the order parameter
            // else change it for the selected value
            url = this.order === -1 ? _.removeUrlParameter(url, 'order') : _.setUrlParameter(url, 'order', 'inverse');
            // if range from and range to are set up
            //   change them in the url
            // else remove the parameter
            if (this.selectedRange)
            {
                url = this.selectedRange.from || this.selectedRange.to ? _.setUrlParameter(url, 'range', (this.selectedRange.from || '') + 'to' + (this.selectedRange.to || '')) : _.removeUrlParameter(url, 'range');
            }

            url = _.removeUrlParameter(url, 'page');
            this.page = 1;

            // just go there already, but warn no one
            Backbone.history.navigate(url, {trigger: false});

            return this.updateCollection();
        }
        /* eslint-enable */

    });
});
