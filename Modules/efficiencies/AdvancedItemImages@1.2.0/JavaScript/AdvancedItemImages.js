define('AdvancedItemImages', [
    'ItemsKeyMapping',
    'underscore',
    'SC.Configuration'
], function ItemImages(
    ItemsKeyMapping,
    _,
    Configuration
) {
    'use strict';

    var advancedItemImagesConfig = SC.CONFIGURATION &&
                                    SC.CONFIGURATION.commerceSuiteSolution &&
                                    SC.CONFIGURATION.commerceSuiteSolution.advancedItemImages;

    function itemImageFlatten(images) {
        if ('url' in images && 'altimagetext' in images) {
            return [images];
        }

        return _.flatten(_.map(images, function flatten(item) {
            if (_.isArray(item)) {
                return item;
            }

            return itemImageFlatten(item);
        }));
    }

    function extendKeyMapping(application) {
        Configuration.itemKeyMapping = Configuration.itemKeyMapping || {};

        _.extend(Configuration.itemKeyMapping, {
            _images: function _images(item) {
                var result = [];
                var otherResults = [];
                var selectedOptions = item.itemOptions;
                var itemImagesDetail = item.get('itemimages_detail') || {};
                var itemImagesDetailParent = item.get('_matrixParent').get('itemimages_detail') || {};
                var multiImageOption = Configuration.multiImageOption;
                var itemOptions = _.map(item.getPosibleOptions(), function map(o) {
                    return o.cartOptionId;
                });

                var validOptions = _.intersection(multiImageOption, itemOptions);
                var optionsSelected = [];

                if (_.size(itemImagesDetailParent)) {
                    itemImagesDetail = itemImagesDetailParent;
                }

                itemImagesDetail = itemImagesDetail.media || itemImagesDetail;

                _.each(validOptions, function each(option) {
                    var selected = selectedOptions && selectedOptions[option];
                    if (selected) {
                        optionsSelected.push(option + ':' + selected.label);
                    }
                });


                if (optionsSelected.length) {
                    _.each(itemImagesDetail, function each(image, key) {
                        var keyWithoutOrder = key.lastIndexOf('-') === - 1 ? key : key.substr(0, key.lastIndexOf('-'));
                        var parsedKey = _.map(keyWithoutOrder.split('|'), function mapParsedKeys(k, index) {
                            return validOptions[index] + ':' + k;
                        });

                        var intersection = _.intersection(parsedKey, optionsSelected);


                        if (intersection.length === optionsSelected.length) {
                            result.push(itemImageFlatten(image));
                        } else if (intersection.length && intersection[0].split(':')[0] === validOptions[0]) {
                            otherResults.push(itemImageFlatten(image));
                        }
                    });

                    result = _.flatten(result);
                    otherResults = _.flatten(otherResults);

                    if (!result.length) {
                        result = otherResults;
                    }

                    result = _.uniq(result);
                }

                if (!result.length && itemImagesDetail.Main && advancedItemImagesConfig.showOnlyMainImages) {

                    result = itemImageFlatten(itemImagesDetail.Main);
                }

                if (!result.length) {
                    result = itemImageFlatten(itemImagesDetail);
                }

                if (result.length) {
                    result = _.sortBy(result, function sortResultBy(i) {
                        var option = i.url.split('-');
                        var order = parseInt(option[option.length - 1], 10);

                        return isNaN(order) ? 1000 : parseInt(order, 10);
                    });
                }

                return result.length ? result : [{
                    url: item.get('storedisplayimage'),
                    altimagetext: item.get('_name')
                }];
            },
            _thumbnail: function _thumbnail(item) {
                var itemImagesDetail = item.get('itemimages_detail') || {};
                var itemImagesDetailParent = item.get('_matrixParent').get('itemimages_detail') || {};
                var sImage = [];
                var sImageOther = [];
                var multiImageOption = Configuration.multiImageOption;
                var currentView = application.getLayout().currentView;
                var translator = currentView && currentView.translator;
                var parentItem;

                var validOptions;
                var optionsSelected;
                var images;
                var imagesFromKeyMapping;
                var facetsFieldsConfig = application.getConfig('siteSettings.facetfield');

                if (_.size(itemImagesDetailParent)) {
                    itemImagesDetail = itemImagesDetailParent;
                }

                // For Facet Browse page
                if (translator && translator.facets.length) {
                    validOptions = _.compact(_.map(item.getPosibleOptions(), function compactValidOptions(o) {
                        return _.indexOf(multiImageOption, o.cartOptionId) > -1 ? o.itemOptionId : null;
                    }));
                    optionsSelected = [];

                    _.each(validOptions, function eachValidOptions(option) {
                        var facetConfig = _.findWhere(facetsFieldsConfig, {facetfieldid: option});
                        var urlForTranslator = facetConfig && facetConfig.urlcomponent;
                        var selected = _.findWhere(translator.facets, {id: urlForTranslator});
                        if (selected) {
                            optionsSelected.push(option + ':' + selected.value);
                        }
                    });

                    if (optionsSelected.length) {
                        _.each(itemImagesDetail, function eachItemImagesDetail(image, key) {
                            var keyWithoutOrder = key.lastIndexOf('-') === -1 ?
                                key : key.substr(0, key.lastIndexOf('-'));
                            var parsedKey = _.map(keyWithoutOrder.split('|'), function mapParsedKeys(k, index) {
                                return validOptions[index] + ':' + k;
                            });
                            var intersection = _.intersection(parsedKey, optionsSelected);

                            if (intersection.length === optionsSelected.length) {
                                sImage.push(itemImageFlatten(image));
                            } else if (
                                intersection.length &&
                                intersection[0].split(':')[0] === validOptions[0]
                            ) {
                                sImageOther.push(itemImageFlatten(image));
                            }
                        });

                        sImage = _.flatten(sImage);
                        sImageOther = _.flatten(sImageOther);

                        if (!sImage.length) {
                            sImage = sImageOther;
                        }

                        sImage = _.uniq(sImage);

                        if (sImage.length) {
                            sImage = _.sortBy(sImage, function sortResultBy(i) {
                                var option = i.url.split('-');
                                var order = parseInt(option[option.length - 1], 10);

                                return isNaN(order) ? 1000 : parseInt(order, 10);
                            });
                        }

                        if (sImage && sImage[0]) {
                            return sImage[0];
                        }
                    }
                }

                // If you generate a thumbnail position in the itemimages_detail it will be used
                if (itemImagesDetail.thumbnail) {
                    if (_.isArray(itemImagesDetail.thumbnail.urls) && itemImagesDetail.thumbnail.urls.length) {
                        return itemImagesDetail.thumbnail.urls[0];
                    }
                    return itemImagesDetail.thumbnail;
                }

                // Now, the next assumption is to use from the images array, the best one;
                imagesFromKeyMapping = item.get('_images');
                if (imagesFromKeyMapping.length > 0) {
                    return imagesFromKeyMapping[0];
                }

                // otherwise it will try to use the storedisplaythumbnail
                if (SC.ENVIRONMENT.siteType &&
                    SC.ENVIRONMENT.siteType === 'STANDARD' &&
                    item.get('storedisplaythumbnail')
                ) {
                    return {
                        url: item.get('storedisplaythumbnail'),
                        altimagetext: item.get('_name')
                    };
                }
                // No images huh? carry on

                parentItem = item.get('_matrixParent');
                // If the item is a matrix child, it will return the thumbnail of the parent
                if (parentItem && parentItem.get('internalid')) {
                    return parentItem.get('_thumbnail');
                }

                images = itemImageFlatten(itemImagesDetail);
                // If you using the advance images features it will grab the 1st one
                if (images.length) {
                    return images[0];
                }

                // still nothing? image the not available
                return {
                    url: application.Configuration.imageNotAvailable,
                    altimagetext: item.get('_name')
                };
            }
        });
    }

    return {
        mountToApp: function mountToApp(application) {
            if (advancedItemImagesConfig && advancedItemImagesConfig.advancedImageManagement === true) {
                extendKeyMapping(application);
            }
        }
    };
});