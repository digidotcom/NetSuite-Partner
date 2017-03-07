define('Footer.View.Links', [
    'Footer.View',
    'Footer.Links'
],
function FooterViewLinks(
    FooterView,
    FooterLinks
) {
    'use strict';

    return {
        mountToApp: function mountToApp() {
            FooterView.prototype.installPlugin('postContext', {
                name: 'footerLinksContext',
                priority: 10,
                execute: function execute(context, view) {
                    FooterLinks.contextExecute(context, view);
                }
            });
        }
    };
});
