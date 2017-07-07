define('Documents.PriceList.Model', [
    'underscore',
    'Backbone',
    'Utils'
], function DocumentsMarketingModel(
    _,
    Backbone
) {
    'use strict';

    return Backbone.Model.extend({

        baseDownloadUrl: 'https://nsapi.digi.com/api/PriceList/getPriceList/{{fileName}}/',

        getDownloadUrl: function getDownloadUrl() {
            var fileName = this.get('fileName');
            if (fileName) {
                return this.baseDownloadUrl.replace('{{fileName}}', fileName);
            }
            return '';
        }

    });
});
