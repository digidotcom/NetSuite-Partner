define('Header.View.Site', [
    'underscore',
    'SC.Configuration',
    'Header.View',
    'Profile.Model'
], function HeaderMenuMyAccountViewSite(
    _,
    Configuration,
    HeaderView,
    ProfileModel
) {
    'use strict';

    _(HeaderView.prototype).extend({

        isShowSiteSearch: function isShowSiteSearch() {
            return Configuration.get('currentTouchpoint') === 'customercenter' &&
                   ProfileModel.getInstance().get('isLoggedIn') === 'T';
        }

    });

    HeaderView.prototype.installPlugin('postContext', {
        name: 'HeaderShowSiteSearch',
        priority: 10,
        execute: function execute(context, view) {
            _(context).extend({
                showSiteSearch: view.isShowSiteSearch()
            });
        }
    });
});
