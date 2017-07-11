define('Publish', [
], function Publish(
) {
    'use strict';

    return {
        getSessionPublishedObject: function getPublishedSessionObject(key) {
            return SC.ENVIRONMENT && SC.ENVIRONMENT.sessionPublished && SC.ENVIRONMENT.sessionPublished[key] ? SC.ENVIRONMENT.sessionPublished[key] : null;
        },
        getPublishedObject: function getPublishedObject(key) {
            return SC.getPublishedObject(key);
        },
        getAllPublishedObject: function getPublishedObjectFromAll(key) {
            var publishedObject = this.getSessionPublishedObject(key);
            if (!publishedObject) {
                publishedObject = this.getPublishedObject(key);
            }
            return publishedObject;
        }
    };
});
