define('SuiteletService', [
    'SC.Model',
    'SuiteletService.Configuration',
    'Configuration',
    'underscore'

], function SuiteletService(
    SCModel,
    SuiteletServiceConfiguration,
    Configuration,
    _
) {
    'use strict';

    if (!Configuration.publish) {
        Configuration.publish = [];
    }

    Configuration.publish.push({
        key: 'SuiteletService',
        model: 'SuiteletService',
        call: 'resolve'
    });

    return SCModel.extend({
        name: 'SuiteletService',

        resolve: function resolve() {
            var r = {};
            if ((request.getURL().indexOf('https:') !== 0)) {
                return r;
            }

            _.each(SuiteletServiceConfiguration.services, function SuiteletServiceConfigurationService(service) {
                try {
                    r[service.script + ',' + service.deploy] =
                        nlapiResolveURL(
                            'suitelet',
                            service.script,
                            service.deploy
                        );
                } catch (e) {
                    nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
                    r[service.script + ',' + service.deploy] = null;
                }
            });

            SuiteletServiceConfiguration.resolvedServices = r;

            return SuiteletServiceConfiguration;
        }
    });
});