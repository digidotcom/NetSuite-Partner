define('Form.Lookup.View', [
    'underscore',
    'Backbone',
    'jQuery',
    'Utils',
    'form_lookup.tpl'
], function FormLookupView(
    _,
    Backbone,
    jQuery,
    Utils,
    formLookupTpl
) {
    'use strict';

    return Backbone.View.extend({

        events: {
            'click [data-result]': 'selectResult'
        },

        template: formLookupTpl,

        initialize: function initialize(options) {
            this.collection = options.collection;
            this.application = options.application;
            this.config = options.config;
            this.query = options.query;
            this.fieldView = options.fieldView;

            this.title = this.getTitle();
        },

        destroy: function destroy() {
            var result = this._destroy();
            if (!this.getSelectedModel()) {
                this.handleLookupResponse(true);
            }
            return result;
        },

        close: function close() {
            if (this.$containerModal) {
                this.$containerModal.modal('hide');
            }
        },

        getTitle: function getTitle() {
            return Utils.translate('Results for "$(0)"', this.query);
        },

        setSelectedModel: function setSelectedModel(model) {
            this.selectedModel = model;
        },
        getSelectedModel: function setSelectedModel() {
            return this.selectedModel;
        },

        selectResult: function selectResult(e) {
            var self = this;
            var $target = jQuery(e.currentTarget);
            var id = parseInt($target.data('result-id'), 10);
            var selected = this.collection.find(function findResult(model) {
                return parseInt(model.get('internalid'), 10) === id;
            });
            if (selected) {
                this.setSelectedModel(selected);
                this.close();
                _.defer(function deferFn() {
                    self.handleLookupResponse();
                });
            }
        },

        handleLookupResponse: function handleLookupResponse(noSelection) {
            this.fieldView.handleLookupResponse(this.getSelectedModel(), noSelection);
        },

        getContext: function getContext() {
            var results = [];
            this.collection.each(function eachCollection(model) {
                results.push({
                    internalid: model.get('internalid'),
                    name: model.get('name'),
                    text: model.get('text')
                });
            });
            return {
                query: this.query,
                areResults: results.length > 0,
                results: results
            };
        }

    });
});
