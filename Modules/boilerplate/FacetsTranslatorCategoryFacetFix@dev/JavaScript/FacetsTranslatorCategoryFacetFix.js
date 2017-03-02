define('FacetsTranslatorCategoryFacetFix', [
    'Facets.Translator',
    'underscore',
    'jQuery',
    'SC.Configuration',
    'Utils',
    'UrlHelper'
], function FacetsTranslatorCategoryFacetFix(
    FacetsTranslator,
    _
) {
    'use strict';

    // @method getUrl
    // Gets the url for current state of the object
    FacetsTranslator.prototype.getUrl = function getUrl() { // eslint-disable-line complexity
        var url = this.categoryUrl || '';
        var self = this;
        // Prepares seo limits
        var facetsSeoLimits = {};
        var sortedFacets;
        var tmpOptions;
        var separator;
        var facet;
        var i;
        var name;
        var value;
        var tmpOptionsKeys;
        var tmpOptionsValues;

        if (SC.ENVIRONMENT.jsEnvironment === 'server') {
            facetsSeoLimits = {
                numberOfFacetsGroups: (this.configuration.facetsSeoLimits &&
                    this.configuration.facetsSeoLimits.numberOfFacetsGroups) || false,
                numberOfFacetsValues: (this.configuration.facetsSeoLimits &&
                    this.configuration.facetsSeoLimits.numberOfFacetsValues) || false,
                options: (this.configuration.facetsSeoLimits
                    && this.configuration.facetsSeoLimits.options) || false
            };
        }

        // If there are too many facets selected
        if (facetsSeoLimits.numberOfFacetsGroups && this.facets.length > facetsSeoLimits.numberOfFacetsGroups) {
            return '#';
        }

        // Encodes the other Facets
        sortedFacets = _.sortBy(this.facets, 'url');

        for (i = 0; i < sortedFacets.length; i++) {
            facet = sortedFacets[i];
            // Category should be already added
            if (facet.id !== 'commercecategoryname' && facet.id !== 'category') {
                // PS
                name = facet.url || facet.id;
                value = '';

                switch (facet.config.behavior) {
                case 'range':
                    facet.value = (typeof facet.value === 'object') ? facet.value : { from: 0, to: facet.value };
                    value = facet.value.from + self.configuration.facetDelimiters.betweenRangeFacetsValues + facet.value.to;
                    break;
                case 'multi':
                    value = facet.value.sort().join(self.configuration.facetDelimiters.betweenDifferentFacetsValues);

                    if (facetsSeoLimits.numberOfFacetsValues && facet.value.length > facetsSeoLimits.numberOfFacetsValues) {
                        return '#';
                    }

                    break;
                default:
                    value = facet.value;
                }
                // do not add a facet separator at the begining of an url
                if (url !== '') {
                    url += self.configuration.facetDelimiters.betweenDifferentFacets;
                }

                url += name + self.configuration.facetDelimiters.betweenFacetNameAndValue + value;
            }
        }

        url = (url !== '') ? url : '/' + this.configuration.fallbackUrl;

        // Encodes the Options
        tmpOptions = {};
        separator = this.configuration.facetDelimiters.betweenOptionNameAndValue;
        if (this.options.order && this.options.order !== this.configuration.defaultOrder) {
            tmpOptions.order = 'order' + separator + this.options.order;
        }

        if (this.options.page && parseInt(this.options.page, 10) !== 1) {
            tmpOptions.page = 'page' + separator + encodeURIComponent(this.options.page);
        }

        if (this.options.show && parseInt(this.options.show, 10) !== this.configuration.defaultShow) {
            tmpOptions.show = 'show' + separator + encodeURIComponent(this.options.show);
        }

        if (this.options.display && this.options.display !== this.configuration.defaultDisplay) {
            tmpOptions.display = 'display' + separator + encodeURIComponent(this.options.display);
        }

        if (this.options.keywords && this.options.keywords !== this.configuration.defaultKeywords) {
            tmpOptions.keywords = 'keywords' + separator + encodeURIComponent(this.options.keywords);
        }

        tmpOptionsKeys = _.keys(tmpOptions);
        tmpOptionsValues = _.values(tmpOptions);


        // If there are options that should not be indexed also return #
        if (facetsSeoLimits.options && _.difference(tmpOptionsKeys, facetsSeoLimits.options).length) {
            return '#';
        }

        url += (tmpOptionsValues.length) ?
            (this.configuration.facetDelimiters.betweenFacetsAndOptions +
            tmpOptionsValues.join(this.configuration.facetDelimiters.betweenDifferentOptions)) :
            '';

        return _(url).fixUrl();
    };
});
