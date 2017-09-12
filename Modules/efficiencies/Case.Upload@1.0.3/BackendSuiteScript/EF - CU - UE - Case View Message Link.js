var Handler = (function Handler() {
    function beforeLoad(pType, form, request) {
        var linkText = 'View Case Messages with Attachments';
        var fileLink;

        if ( request ) {
            fileLink = nlapiResolveURL('SUITELET',
              'customscript_ef_cu_sl_case_view',
              'customdeploy_ef_cu_sl_case_view',
              false
            );

            fileLink += '&caseid=' + request.getParameter('id');
            form.addField('custpage_view', 'url', '', null, null).setLinkText( linkText ).setDefaultValue( fileLink );
        }
    }

    return {
        beforeLoad: beforeLoad
    };
}());