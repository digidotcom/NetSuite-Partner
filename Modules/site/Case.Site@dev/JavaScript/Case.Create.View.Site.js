define('Case.Create.View.Site', [
    'underscore',
    'Case.Create.View'
], function CaseCreateViewSite(
    _,
    CaseCreateView
) {
    'use strict';

    CaseCreateView.prototype.installPlugin('postContext', {
        name: 'CrudMenuItems',
        execute: function execute(context, view) {
            var fields = view.fields;
            _(context).extend({
                casetype: fields.get('casetype'),
                categorydependency: fields.get('categorydependency'),
                casecategory: fields.get('casecategory')
            });
        }
    });
});
