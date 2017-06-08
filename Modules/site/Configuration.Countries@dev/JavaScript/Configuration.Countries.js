define('Configuration.Countries', [
    'underscore',
    'SC.Configuration'
], function SCConfigurationSite(
    _,
    Configuration
) {
    'use strict';

    var Module = {
        sanctioned: [
            'CU', // Cuba
            'IR', // Iran
            'KP', // North Korea
            'SD', // Sudan
            'SY'  // Syria
        ],
        ordered: [
            'US', // United States
            'CA', // Canada
            'DE', // Germany
            'GB', // United Kingdom
            'CN', // China
            'AU'  // Australia
        ],
        getRaw: function getRaw() {
            return Configuration.get('siteSettings.countries');
        },
        filter: function filter(countries) {
            return _(countries).omit(this.sanctioned);
        },
        getFiltered: function filterSanctioned() {
            var countries = this.getRaw();
            countries = this.filter(countries);
            return countries;
        },
        sort: function sort(countries) {
            return _.union(_.values(_.pick(countries, this.ordered)), _.values(countries));
        },
        get: function get() {
            var countriesSortedArray;
            var countriesObject = this.getFiltered();
            countriesSortedArray = this.sort(countriesObject);
            return countriesSortedArray;
        }
    };

    Configuration.siteSettings.countries = Module.getFiltered();

    return Module;
});
