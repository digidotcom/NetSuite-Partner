define('Case.Create.View.Site', [
    'underscore',
    'jQuery',
    'Case.Create.View'
], function CaseCreateViewSite(
    _,
    jQuery,
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

    _(CaseCreateView.prototype).extend({

        events: _(CaseCreateView.prototype.events || {}).extend({
            'change .select-toggle': 'changeSelectToggle'
        }),

        changeSelectToggle: function changeSelectToggle(e) {
            var $select = jQuery(e.currentTarget);
            var $target = jQuery($select.data('target'));
            var show = $select.find('option:selected').val();
            $target.children('#depdefault').prop('selected', true);
            $target.children().addClass('hide');
            $target.children().filter(function filterOptions(index, element) {
                return jQuery(element).data('show').toString().split(',')
                        .indexOf(show) >= 0;
            }).each(function eachFilteredOption() {
                jQuery(this).removeClass('hide');
            });
        }

    });
});
