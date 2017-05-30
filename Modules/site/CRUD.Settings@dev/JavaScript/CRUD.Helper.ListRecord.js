define('CRUD.Helper.ListRecord', [
    'underscore',
    'Utils',
    'Configuration.Countries',
    'CRUD.Configuration'
], function CrudHelperListRecord(
    _,
    Utils,
    ConfigurationCountries,
    CrudConfiguration
) {
    'use strict';

    return {
        lists: {},
        countries: null,
        statesPerCountry: null,

        getListServiceUrl: function getListServiceUrl(crudId, listIds, absolute) {
            var url = CrudConfiguration.get(crudId).listServiceUrl;
            url += (url.indexOf('?') >= 0) ? '&' : '?';
            url += 'ids=' + (listIds ? listIds.join(',') : '');
            return absolute ? Utils.getAbsoluteUrl(url) : url;
        },
        isFieldTypeList: function isFieldList(field) {
            var list = field.list;
            return field.type === 'list' &&
                   list && (typeof list === 'string');
        },
        getFieldListNames: function getFieldListNames(crudId) {
            var self = this;
            var fields = this.getFields(crudId);
            var lists = [];
            _(fields).each(function eachFields(field) {
                if (self.isFieldTypeList(field)) {
                    lists.push(field.list);
                }
            });
            return _.unique(lists).sort();
        },
        getFieldListNamesForService: function getFieldListNames(crudId) {
            var lists = this.getFieldListNames(crudId);
            var staticLists = this.getStaticListNames();
            return _.difference(lists, staticLists).sort();
        },
        addListFromModel: function addListToCache(model) {
            this.lists[model.get('name')] = model.get('values');
        },
        addListsFromCollection: function addListsFromCollection(collection) {
            var self = this;
            collection.each(function eachListsCollection(model) {
                self.addListFromModel(model);
            });
        },
        getList: function getList(name, relatedAttributeValue) {
            if (this.isStaticList(name)) {
                return this.getStaticList(name, relatedAttributeValue);
            }
            return this.lists[name] || null;
        },
        /* page can be 'view', 'edit' or 'new' */
        hasListsInPage: function hasListsInPage(crudId, page) {
            return page !== 'view' && this.getFieldListNames(crudId).length > 0;
        },


        getStaticListNames: function getStaticListNames() {
            return ['countries', 'states'];
        },
        isStaticList: function isStaticList(name) {
            return _.indexOf(this.getStaticListNames(), name) >= 0;
        },
        getCountriesList: function getListCountries() {
            var countries;
            if (!this.countries) {
                countries = ConfigurationCountries.get();
                this.countries = _(countries).map(function mapCountries(country) {
                    return {
                        internalid: country.name,
                        name: country.name,
                        code: country.code,
                        states: country.states,
                        isZipRequired: country.isziprequired === 'T'
                    };
                });
            }
            return this.countries;
        },
        getStatesList: function getListStatesPerCountry() {
            var statesPerCountry;
            if (!this.statesPerCountry) {
                statesPerCountry = {};
                _(this.getCountriesList()).each(function eachCountry(country) {
                    if (country.states) {
                        statesPerCountry[country.name] = _(country.states).map(function mapStates(state) {
                            return {
                                internalid: state.name,
                                name: state.name,
                                code: state.code
                            };
                        });
                    }
                });
                this.statesPerCountry = statesPerCountry;
            }
            return this.statesPerCountry;
        },
        getStatesOfCountryList: function getListStatesPerCountry(countryName) {
            var statesPerCountry = this.getStatesList();
            if (countryName !== null && (countryName in statesPerCountry)) {
                return statesPerCountry[countryName];
            }
            return [];
        },
        getStatesOfCountryCallback: function getStatesOfCountryCallback() {
            var self = this;
            return function statesListCallback(countryName) {
                return self.getStatesOfCountryList(countryName);
            };
        },
        getStaticList: function getStaticList(name) {
            switch (name) {
            case 'countries':
                return this.getCountriesList();
            case 'states':
                return this.getStatesOfCountryCallback();
            default:
                return [];
            }
        }
    };
});
