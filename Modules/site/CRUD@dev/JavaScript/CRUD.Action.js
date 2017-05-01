define('CRUD.Action', [
    'Backbone',
    'jQuery',
    'CRUD.Helper',
    'CRUD.Action.Model'
], function CrudAction(
    Backbone,
    jQuery,
    CrudHelper,
    CrudActionModel
) {
    'use strict';

    return {
        executeRedirect: function executeRedirect(options) {
            var crudId = options.crudId;
            var parentId = options.parent;
            var page = options.model.get('page');
            var internalid = options.id;
            var url = CrudHelper.getUrlForPage(page, crudId, internalid, parentId);
            var isSameUrl = (url === Backbone.history.fragment);
            if (url) {
                if (isSameUrl) {
                    Backbone.history.navigate('/', { trigger: false }); // hack to refresh page if the same needed
                }
                Backbone.history.navigate(url, { trigger: true, replace: isSameUrl });
            }
        },
        executeActionResponse: function executeActionResponse(options) {
            var type = options.model.get('type');
            switch (type) {
            case 'redirect':
                this.executeRedirect(options);
                break;
            default:
            }
        },
        getPromiseCallback: function getPromiseCallback(crudId, parentId) {
            var self = this;
            return function callback(data) {
                var deferred = jQuery.Deferred();
                var action = data.action;
                var internalid = data.model && data.model.get('internalid');
                var model = new CrudActionModel({
                    crudId: crudId
                });
                model.fetch({
                    data: {
                        id: crudId,
                        internalid: internalid,
                        action: action
                    }
                }).done(function doneFn() {
                    deferred.resolveWith(model, [model]);
                    self.executeActionResponse({
                        crudId: crudId,
                        parent: parentId,
                        model: model,
                        id: internalid
                    });
                }).fail(function failFn() {
                    deferred.rejectWith(model, [model]);
                });
                return deferred.promise();
            };
        }
    };
});
