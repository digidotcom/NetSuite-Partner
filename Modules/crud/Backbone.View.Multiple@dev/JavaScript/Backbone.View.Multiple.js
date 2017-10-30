define('Backbone.View.Multiple', [
    'underscore',
    'Backbone',
    'Backbone.CompositeView',
    'backbone_view_multiple.tpl'
], function BackboneViewMultiple(
    _,
    Backbone,
    BackboneCompositeView,
    backboneViewMultipleTpl
) {
    'use strict';

    return Backbone.View.extend({

        template: backboneViewMultipleTpl,

        initialize: function initialize(options) {
            this.views = options.views;

            BackboneCompositeView.add(this);

            this.generateChildViews();
        },

        childViews: {},

        getChildViewId: function getChildViewId(position) {
            return 'ChildView' + position;
        },

        generateChildViews: function generateChildViews() {
            var self = this;
            var ids = [];
            _(self.views).each(function eachView(view, index) {
                var id = self.getChildViewId(index + 1);
                ids.push(id);
                self.childViews[id] = function ChildViewCallback() {
                    return view;
                };
            });
            self.childViewsIds = ids;
        },

        getContext: function getContext() {
            return {
                placeholderIds: this.childViewsIds
            };
        }

    });
});
