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
            var page = options.result.page;
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
            var type = options.result.type;
            switch (type) {
            case 'redirect':
                this.executeRedirect(options);
                break;
            default:
            }
        },
        getActionStaticPromise: function getActionSubmitPromise(crudId, parentId, data, actionInfo) {
            var self = this;
            var deferred = jQuery.Deferred();
            var model = data.model;
            var internalid = model && model.get('internalid');
            deferred.resolve();
            self.executeActionResponse({
                crudId: crudId,
                parent: parentId,
                result: actionInfo.result,
                id: internalid
            });
            return deferred.promise();
        },
        getActionRequestPromise: function getServicePromise(crudId, parentId, data, actionName) {
            var self = this;
            var deferred = jQuery.Deferred();
            var internalid = data.model && data.model.get('internalid');
            var actionModel = new CrudActionModel({
                crudId: crudId
            });
            actionModel.fetch({
                data: {
                    id: crudId,
                    internalid: internalid,
                    action: actionName
                }
            }).done(function doneFn() {
                deferred.resolveWith(actionModel, [actionModel]);
                self.executeActionResponse({
                    crudId: crudId,
                    parent: parentId,
                    result: actionModel.attributes,
                    id: internalid
                });
            }).fail(function failFn() {
                deferred.rejectWith(actionModel, [actionModel]);
            });
            return deferred.promise();
        },
        getPromiseCallback: function getPromiseCallback(crudId, parentId) {
            var self = this;
            return function callback(data) {
                var actionName = data.action;
                var actionInfo = CrudHelper.getActionInfo(crudId, data, actionName);
                if (CrudHelper.isActionStatic(actionInfo)) {
                    return self.getActionStaticPromise(crudId, parentId, data, actionInfo);
                }
                return self.getActionRequestPromise(crudId, parentId, data, actionName);
            };
        }
    };
});
