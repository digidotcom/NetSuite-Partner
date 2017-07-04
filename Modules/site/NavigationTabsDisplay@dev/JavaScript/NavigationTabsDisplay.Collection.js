define('NavigationTabsDisplay.Collection', [
    'Backbone',
    'NavigationTabsDisplay.Model'
], function NavigationTabsDisplayCollection(
    Backbone,
    NavigationTabsDisplayModel
) {
    'use strict';

    return Backbone.Collection.extend({

        model: NavigationTabsDisplayModel

    });
});
