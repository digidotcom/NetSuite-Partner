define('ItemDetails.ImageGallery.View.Video',	[
    'ItemDetails.ImageGallery.View',
    'Utilities.ResizeImage',
    'jQuery',
    'underscore',
    'Utils',
    'item_details_image_gallery_video.tpl'
], function ItemDetailsImageGalleryViewVideo(
    ItemDetailsImageGalleryView,
    resizeImage,
	jQuery,
	_,
	Utils,
    itemDetailsImageGalleryVideoTpl
) {
    'use strict';


    var previousPosition = 0;
    var previousImages = [];

    return ItemDetailsImageGalleryView.extend({
        template: itemDetailsImageGalleryVideoTpl,
        initSlider: function initSlider() {
            if (this.options.images.length > 1) {
                this.$slider = this.$('[data-slider]');

                _.initBxSlider(this.$slider, {
                    buildPager: jQuery.proxy(this.buildSliderPager, this),
                    startSlide: this.hasSameImages() ? previousPosition : 0,
                    adaptiveHeight: true,
                    touchEnabled: true,
                    nextText: '<a class="item-details-gallery-next-icon"></a>',
                    prevText: '<a class="item-details-gallery-prev-icon"></a>',
                    controls: true,
                    video: this.options.hasVideo,
                    useCSS: !this.options.hasVideo
                });
            }
        },

        buildSliderPager: function buildSliderPager(slideIndex) {
            var image = this.options.images[slideIndex];
            if (image.isVideo) {
                return '<img src="' + resizeImage(image.thumb, 'tinythumb') + '" alt="' + image.altimagetext + '">';
            }
            return '<img src="' + resizeImage(image.url, 'tinythumb') + '" alt="' + image.altimagetext + '">';
        },

        /* Only copied because we need to reference the global vars */
        hasSameImages: function hasSameImages() {
            return this.options.images.length === previousImages.length &&
                _.difference(this.options.images, previousImages).length === 0;
        },
        destroy: function destroy() {
            if (this.$slider) {
                previousPosition = this.$slider.getCurrentSlide();
            }
            previousImages = this.options.images;
            this._destroy();
        }
        /*  END Only copied because we need to reference the global vars */
    });
});