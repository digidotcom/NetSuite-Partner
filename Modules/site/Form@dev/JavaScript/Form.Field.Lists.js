define('Form.Field.Lists', [
    'underscore',
    'SC.Configuration'
], function FormFieldLists(
    _,
    Configuration
) {
    'use strict';

    return {
        countries: null,
        statesPerCountry: null,
        getCountries: function getCountriesList() {
            var countries;
            if (!this.countries) {
                countries = Configuration.get('siteSettings.countries');
                this.countries = _(countries).map(function mapCountries(country) {
                    return {
                        value: country.name,
                        name: country.name,
                        code: country.code,
                        states: country.states,
                        isZipRequired: country.isziprequired === 'T'
                    };
                });
            }
            return this.countries;
        },
        getStates: function getStatesList(countryName) {
            var countries;
            var statesPerCountry = this.statesPerCountry;
            if (!statesPerCountry) {
                statesPerCountry = {};
                countries = this.getCountries();
                _(countries).each(function eachCountry(country) {
                    if (country.states) {
                        statesPerCountry[country.name] = _(country.states).map(function mapStates(state) {
                            return {
                                value: state.name,
                                name: state.name,
                                code: state.code
                            };
                        });
                    }
                });
                this.statesPerCountry = statesPerCountry;
            }
            if (countryName && (countryName in statesPerCountry)) {
                return statesPerCountry[countryName];
            }
            return false;
        }
    };
});
