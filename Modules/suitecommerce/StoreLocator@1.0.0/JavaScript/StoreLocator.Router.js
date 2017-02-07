/*
	© 2016 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

//@module StoreLocator
define('StoreLocator.Router'
,   [
        'AjaxRequestsKiller'
    ,   'Backbone'
    ,   'Profile.Model'
    ,   'StoreLocator.Model'
    ,   'StoreLocator.Collection'
    ,   'StoreLocator.Main.View'
    ,   'StoreLocator.Details.View'
    ,   'StoreLocator.List.All.View'
    ,   'StoreLocator.Upgrade.View'
    ,   'ReferenceMap'
    ,   'ReferenceMap.Configuration'
    ,   'Utils'
    ]
,   function (
        AjaxRequestsKiller
    ,   Backbone
    ,   ProfileModel
    ,   StoreLocatorModel
    ,   StoreLocatorCollection
    ,   StoreLocatorMainView
    ,   StoreLocatorDetaisView
    ,   StoreLocatorListAllView
    ,   StoreLocatorUpgradeView
    ,   ReferenceMap
    ,   ReferenceConfiguration
    ,   Utils
    )
{
    'use strict';

    return Backbone.Router.extend({
        //@method routes
        //@return {Object}
        routes: function() {
            if (Utils.oldIE(8))
            {
                return {
                    'stores' : 'browserUpgrade'
                ,   'stores/details/:id' : 'browserUpgrade'
                ,   'stores/all' : 'browserUpgrade'
                ,   'stores/all?:options' : 'browserUpgrade'
                };
            }
            else
            {
                return {
                    'stores' : 'storeLocatorStores'
                ,   'stores/details/:id' : 'storeLocatorDetails'
                ,   'stores/all' : 'storeLocatorListAll'
                ,   'stores/all?:options' : 'storeLocatorListAll'
                };
            }
        }

        //@method initialize
        //@param {Object} application
    ,   initialize: function (application) {
            this.application = application;
        }

        //@method storeLocatorStores
    ,   storeLocatorStores: function ()
        {
            var profile_model = ProfileModel.getInstance()
            ,   last_search = profile_model.get('storeLocator_last_search')
            ,   collection = new StoreLocatorCollection()
            ,   reference_map = new ReferenceMap()
            ,   view = new StoreLocatorMainView({
                    application: this.application
                ,   collection: collection
                ,   reference_map: reference_map
                });

            if (!!last_search)
            {
                reference_map.myposition = {
                    latitude: last_search.latitude
                ,   longitude: last_search.longitude
                ,   address: last_search.address
                };
                view.reference_map = reference_map;
                view.triggerLocation = false;
                view.showContent();
                collection.update({
                        //@property {String} latitude
                        latitude: last_search.latitude
                        //@property {String} longitude
                    ,   longitude:last_search.longitude
                        //@property {String} radius
                    ,   radius: last_search.radius
                        //@property {String} sort
                    ,   sort: 'distance'
                        //@property {String} page
                    ,   page: 'all'
                        //@property {Number} killerId
                    ,   killerId: AjaxRequestsKiller.getKillerId()
                        //@property {Boolean} reset
                    ,   reset: true
                });
            }
            else if (!!navigator.permissions)
            {
                //Verify permissions
                navigator.permissions.query({name:'geolocation'})
                .then(function(permissionStatus) {
                    //allow popup
                    if (permissionStatus.state === 'granted')
                    {
                        //verify is library is loaded
                        view.reference_map.load().done(function() {

                            navigator.geolocation.getCurrentPosition(function(position){

                                view.reference_map.myposition = {
                                    latitude: position.coords.latitude
                                ,   longitude: position.coords.longitude
                                ,   address: ''
                                };

                                view.reference_map.getCityGeoCode().done(function(){
                                    view.triggerLocation = false;
                                    view.showContent();
                                    collection.update({
                                            //@property {String} latitude
                                            latitude: view.reference_map.myposition.latitude
                                            //@property {String} longitude
                                        ,   longitude: view.reference_map.myposition.longitude
                                            //@property {String} radius
                                        ,   radius: view.reference_map.configuration.getRadius()
                                            //@property {String} sort
                                        ,   sort: 'distance'
                                            //@property {String} page
                                        ,   page: 'all'
                                            //@property {Number} killerId
                                        ,   killerId: AjaxRequestsKiller.getKillerId()
                                            //@property {Boolean} reset
                                        ,   reset: true
                                    });
                                });
                            }, function(){
                                view.triggerLocation = true;
                                view.showContent();
                            });
                        });
                    }
                    else
                    {
                        view.triggerLocation = true;
                        view.showContent();
                    }
                });
            }
            else
            {
                view.triggerLocation = true;
                view.showContent();
            }
        }

        //@method storeLocatorListAll
        //@param {Object} options
    ,   storeLocatorListAll: function (options)
        {
            options = (options) ? SC.Utils.parseUrlOptions(options) : {page: 1};
            options.page = options.page || 1;

            var collection = new StoreLocatorCollection()
            ,   view = new StoreLocatorListAllView({
                    application: this.application
                ,   collection: collection
                ,   configuration: ReferenceConfiguration
                });

            collection
                .update({
                       sort: 'namenohierarchy'
                        //@property {String} page
                    ,   page: options.page

                    ,   results_per_page: ReferenceConfiguration.showAllStoresRecordsPerPage()
                        //@property {Number} killerId
                    ,   killerId: AjaxRequestsKiller.getKillerId()
                        //@property {Boolean} reset
                    ,   reset: true
                });
            view.showContent();
        }

        //@method storeLocatorDetails
        //@param {String} id
    ,   storeLocatorDetails: function (id)
        {
            var model = new StoreLocatorModel()
            ,   reference_map = new ReferenceMap()
            ,   view = new StoreLocatorDetaisView({
                    application: this.application
                ,   model: model
                ,   reference_map: reference_map
                });

            model
                .on('change', view.showContent, view)
                .fetch({
                    data: {
                        //@property {String} internalid
                        internalid: id
                    }
                ,   killerId: AjaxRequestsKiller.getKillerId()
                });
        }

        //@method browserUpgrade
    ,   browserUpgrade: function()
        {
            var view = new StoreLocatorUpgradeView({
                application: this.application
            });
            view.showContent();
        }

    });
});