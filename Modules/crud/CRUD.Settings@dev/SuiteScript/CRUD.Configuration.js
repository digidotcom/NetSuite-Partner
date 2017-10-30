define('CRUD.Configuration', [
    'underscore',
    'CRUD.Configuration.Main',
    'CRUD.Configuration.Lists'
], function CrudConfiguration(
    _,
    CrudConfigurationMain,
    CrudConfigurationLists
) {
    'use strict';

    var CrudConfigurationBase = {
        keySets: {
            guest: [
                'type',
                'frontend',
                'permissions'
            ],
            shared: [
                'fields',
                'type',
                'status',
                'parent',
                'actions',
                'permissions'
            ],
            record: [
                'search',
                'listHeaderDisabled',
                'record',
                'loggedIn',
                'fieldsets',
                'filters',
                'filtersDynamic',
                'sort'
            ],
            bootstrapping: [
                'subrecords',
                'frontend',
                'list',
                'search',
                'prefill',
                'groups'
            ]
        },

        configuration: {},

        getIds: function getIds() {
            return _.keys(this.configuration);
        },

        add: function add(id, configuration) {
            this.configuration[id] = configuration;
        },

        get: function get(id) {
            return this.configuration[id] || {};
        },

        isValid: function isValid(id) {
            return (id in this.configuration);
        },

        getWithKeySet: function getWithKeySet(id, keySet, excludeShared) {
            var keys = _.uniq(_.union([], (!excludeShared) ? this.keySets.shared : [], this.keySets[keySet]));
            var config = this.get(id);
            if (config) {
                return _(config).pick(keys);
            }
            return {};
        },
        getWithKeySetAll: function getWithKeySetAll(keySet, excludeShared) {
            var self = this;
            var configs = {};
            _(this.configuration).each(function eachConfiguration(config, id) {
                configs[id] = self.getWithKeySet(id, keySet, excludeShared);
            });
            return configs;
        }
    };

    return _.extend({},
        CrudConfigurationBase,
        CrudConfigurationMain,
        CrudConfigurationLists
    );
});