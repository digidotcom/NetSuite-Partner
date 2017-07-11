define('Case.Model.Site', [
    'underscore',
    'Application',
    'Utils',
    'Case.Model'
], function CaseModelSite(
    _,
    Application,
    Utils,
    CaseModel
) {
    'use strict';

    _(CaseModel).extend({
        getCaseTypes: function getCaseTypes(caseRecord) {
            var casetypeField = caseRecord.getField('custevent_casecategory');
            var casetypeOptions = casetypeField.getSelectOptions();
            var casetypeOptionValues = [];

            _(casetypeOptions).each(function eachCaseTypeOptions(caseOption) {
                var casetypeOptionValue = {
                    id: caseOption.id,
                    text: caseOption.text
                };

                casetypeOptionValues.push(casetypeOptionValue);
            });

            return casetypeOptionValues;
        },
        getProductCategories: function getProductCategories(caseRecord) {
            var newcategoryField = caseRecord.getField('custevent_productcategory');
            var newcategoryOptions = newcategoryField.getSelectOptions();
            var newcategoryOptionValues = [];

            _(newcategoryOptions).each(function eachNewCategoryOptions(categoryOption) {
                var categoryOptionValue = {
                    id: categoryOption.id,
                    text: categoryOption.text
                };
                newcategoryOptionValues.push(categoryOptionValue);
            });

            return newcategoryOptionValues;
        },
        getCategories: function getCategories(caseRecord) {
            var casecategoryField = caseRecord.getField('custevent_productcategory');
            var casecategoryOptions = casecategoryField.getSelectOptions();
            var casecategoryOptionValues = [];

            _(casecategoryOptions).each(function eachCaseCategoryOptions(categoryOption) {
                var categoryOptionValue = {
                    id: categoryOption.id,
                    text: categoryOption.text
                };
                casecategoryOptionValues.push(categoryOptionValue);
            });

            return casecategoryOptionValues;
        },
        getCategoryDependency: function getCategoryDependency() {
            var columns = [
                new nlobjSearchColumn('name'),
                new nlobjSearchColumn('custrecord_productcategory')
            ];
            var results = Application.getAllSearchResults('customrecord_productdependency', null, columns);

            var productDependencyValues = [];

            _(results).each(function eachResults(rs) {
                var pdValue = {
                    pid: rs.id,
                    pname: rs.getValue('name'),
                    pparent: rs.getValue('custrecord_productcategory')
                };
                productDependencyValues.push(pdValue);
            });

            return productDependencyValues;
        },

        /* eslint-disable */
        create: function (customerId, data)
        {
            customerId = customerId || nlapiGetUser() + '';

            var newCaseRecord = nlapiCreateRecord('supportcase');

            data.title && newCaseRecord.setFieldValue('title', Utils.sanitizeString(data.title));
            data.message && newCaseRecord.setFieldValue('incomingmessage', Utils.sanitizeString(data.message));
            data.category && newCaseRecord.setFieldValue('custevent_productcategory', data.category);
            data.categorydependency && newCaseRecord.setFieldValue('custevent_product',data.categorydependency);
            data.casetype && newCaseRecord.setFieldValue('custevent_casecategory', data.casetype);
            data.email && newCaseRecord.setFieldValue('email', data.email);
            customerId && newCaseRecord.setFieldValue('company', customerId);

            var default_values = this.configuration.defaultValues;

            newCaseRecord.setFieldValue('status', default_values.statusStart.id); // Not Started
            newCaseRecord.setFieldValue('origin', default_values.origin.id); // Web

            return nlapiSubmitRecord(newCaseRecord);
        }
        /* eslint-enable */
    });

    Application.on('after:Case.getNew', function onAfterCaseGetNew(Model, response) {
        var caseRecord = nlapiCreateRecord('supportcase');

        caseRecord.setFieldValue('profile', 5);

        _(response).extend({
            newcategories: Model.getProductCategories(caseRecord),
            categorydependency: Model.getCategoryDependency(),
            casecategory: Model.getCategories(caseRecord),
            casetype: Model.getCaseTypes(caseRecord)
        });
    });
});
