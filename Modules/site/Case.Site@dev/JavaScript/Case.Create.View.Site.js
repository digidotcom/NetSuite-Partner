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

        bindings: _(CaseCreateView.prototype.bindings || {}).extend({
            '[name="casetype"]': 'casetype',
            '[name="categorydependency"]': 'categorydependency'
        }),

        changeSelectToggle: function changeSelectToggle(e) {
            var dependencies = this.fields.get('categorydependency');
            var $parent = jQuery(e.currentTarget);
            var $select = this.$('[name="categorydependency"]');
            var $options = $select.children('[value!=""]');
            var value = $parent.val();
            var children;
            $options.removeClass('show');
            if (value) {
                children = _(dependencies).filter(function filterDependencies(dependency) {
                    var parents = (dependency.pparent || '').split(',');
                    return _(parents).indexOf(value) >= 0;
                });
                $options.filter(function filterOptions(index, element) {
                    return !!_(children).findWhere({ pid: jQuery(element).val() + '' });
                }).addClass('show');
            }
        },

        changeSelectToggle2: function changeSelectToggle(e) {
            var $select = jQuery(e.currentTarget);
            var $target = jQuery($select.data('target'));
            var show = $select.find('option:selected').val();
            $target.children('#depdefault').prop('selected', true);
            $target.children().addClass('hide');
            $target.children().filter(function filterOptions(index, element) {
                var dataShow = jQuery(element).data('parent');
                if (dataShow) {
                    return dataShow.toString().split(',')
                            .indexOf(show) >= 0;
                }
                return false;
            }).each(function eachFilteredOption() {
                jQuery(this).removeClass('hide');
            });
        }

    });
});
