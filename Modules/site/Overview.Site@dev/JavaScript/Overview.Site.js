define('Overview.Site', [
    'underscore',
    'SC.Configuration',
    'Overview.Home.View'
], function OverviewSite(
    _,
    Configuration,
    OverviewHomeView
) {
    'use strict';

    OverviewHomeView.prototype.installPlugin('postContext', {
        name: 'OverviewSite',
        priority: 10,
        execute: function execute(context) {
            _(context).extend({
                contentHTML: Configuration.get('overview.content') || ''
            });
        }
    });
});
