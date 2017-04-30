define('CRUD.Configuration.Lists', [
], function CrudConfigurationLists(
) {
    'use strict';

    return {
        addList: function addList(id, configuration) {
            var config = this.parseListConfig(id, configuration);
            this.add(id, config);
        },

        parseListConfig: function parseListConfig(id, configuration) {
            return {
                id: id,
                record: configuration.id,
                type: 'list',
                permissions: {
                    list: true,
                    create: false,
                    read: false,
                    update: false,
                    'delete': false
                },
                filters: {
                    inactive: { operator: 'is', value1: 'F' }
                },
                sort: {
                    // internalid: 'asc'
                },
                fieldsets: {
                    list: [
                        'internalid',
                        'name'
                    ]
                },
                fields: {
                    internalid: {
                        record: {
                            fieldName: 'internalid'
                        }
                    },
                    inactive: {
                        record: {
                            fieldName: 'isinactive'
                        }
                    },
                    name: {
                        record: {
                            fieldName: 'name'
                        }
                    }
                }
            };
        }
    };
});
