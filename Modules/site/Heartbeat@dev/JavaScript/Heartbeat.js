/**
 * Keeps session alive in My Account and Checkout
 * Only use during development, remember to remove it for production
 */
define('Heartbeat', [
    'Backbone',

    'AjaxRequestsKiller',
    'Utils'
], function Heartbeat(
    Backbone,

    AjaxRequestsKiller,
    Utils
) {
    'use strict';

    var Model = Backbone.Model.extend({
        url: Utils.getAbsoluteUrl('services/Heartbeat.Service.ss')
    });

    var Collection = Backbone.Collection.extend({
        model: Model
    });

    return {
        Model: Model,
        Collection: Collection,

        delay: 5, // in minutes

        intervalCallback: function intervalCallback(application) {
            var self = this;
            var collection = self.collectionInstance;

            var model = new Model({
                application: application,
                beats: collection.length
            });

            model.fetch({
                killerId: AjaxRequestsKiller.getKillerId(),
                data: {
                    beats: collection.length
                }
            }).done(function done() {
                collection.add(model);
            });
        },

        interval: null,
        collectionInstance: null,

        mountToApp: function mountToApp(application) {
            var self = this;
            // run heartbeat only in local
            if (window.location.pathname.match('local.ssp')) {
                console.log('LOCAL - Heartbeat ON');
                self.collectionInstance = new Collection({
                    application: application
                });
                self.interval = setInterval(function intervalFn() {
                    self.intervalCallback(application);
                }, self.delay * 60 * 1000);
            }
        }
    };
});