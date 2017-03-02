define('Footer.Links', [
    'underscore'
],
function FooterLinks(
    _
) {
    'use strict';

    return {
        contextExecute: function contextExecute(context) {
            context.footerNavigationLinks = _.map(context.footerNavigationLinks, function navigationLinksMap(link) {
                link.data = (link.data || {});

                _.extend(link.data, {
                    hashtag: link.hashtag,
                    touchpoint: link.touchpoint
                });

                return link;
            });
        }
    };
});
