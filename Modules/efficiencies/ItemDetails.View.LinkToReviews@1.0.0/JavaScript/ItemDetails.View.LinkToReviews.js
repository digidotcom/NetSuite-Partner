define('ItemDetails.View.LinkToReviews', [
    'ItemDetails.View',
    'underscore',
    'jQuery'
], function LinkToReviews(
    ItemDetailsView,
    _,
    jQuery
) {
    'use strict';

    _.extend(ItemDetailsView.prototype.events, {
        'click .item-details-rating-header-rating': function clickItemDetailsRatingHeader(event) {
            event.preventDefault();
            jQuery('body').animate({
                scrollTop: this.$('.item-details-product-review-content').offset().top
            }, 'fast');
        }
    });
});
