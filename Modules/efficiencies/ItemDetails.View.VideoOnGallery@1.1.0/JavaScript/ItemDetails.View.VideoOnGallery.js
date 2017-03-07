define('ItemDetails.View.VideoOnGallery', [
    'ItemDetails.View',
    'ItemDetails.ImageGallery.View.Video',
    'SC.Configuration',
    'underscore',
    'Utils'
], function ItemDetailsViewVideo(
    ItemDetailsView,
    ItemDetailsImageGalleryViewVideo,
    Configuration,
    _,
    Utils
) {
    'use strict';
    _.extend(ItemDetailsView.prototype.childViews, {
        'ItemDetails.ImageGallery': function ItemDetailsImageGallery() {
            var images = this.model.get('_images', true);
            var hasVideo = false;

            if (this.model.get('custitem_ef_pdp_video_url')) {
                // Push the video
                images.push({
                    altimagetext: _('Video').translate(),
                    url: this.model.get('custitem_ef_pdp_video_url'),
                    isVideo: true,
                    thumb: Utils.getAbsoluteUrl('img/default-video-thumbnail.jpg')
                });
                // If we have a video, we should remove image not available. And leave the video as main
                images = _.filter(images, function filterImages(image) {
                    return image.url !== Configuration.imageNotAvailable;
                });
            }

            return new ItemDetailsImageGalleryViewVideo({
                images: images,
                hasVideo: hasVideo
            });
        }
    });
});