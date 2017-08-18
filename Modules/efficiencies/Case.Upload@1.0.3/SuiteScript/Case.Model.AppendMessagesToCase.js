define('Case.Model.AppendMessagesToCase', [
    'Application',
    'Case.Model',
    'underscore'
], function CaseModelAppendMessagesToCase(
    Application,
    CaseModel,
    _
) {
    'use strict';

    _.extend(CaseModel, {
        appendMessagesToCase: function (support_case) {
        var message_columns = {
                    message_id: new nlobjSearchColumn('internalid', 'messages')
                ,   message_col: new nlobjSearchColumn('message', 'messages')
                ,   message_date_col: new nlobjSearchColumn('messagedate', 'messages').setSort(true)
                ,   author_col: new nlobjSearchColumn('author', 'messages')
            }
        ,   message_filters = [new nlobjSearchFilter('internalid', null, 'is', support_case.internalid), new nlobjSearchFilter('internalonly', 'messages', 'is', 'F')]
        ,   message_records = Application.getAllSearchResults('supportcase', message_filters, _.values(message_columns))
        ,   grouped_messages = []
        ,   messages_count = 0
        ,   self = this;

        _(message_records).each(function (message_record)
        {
            var customer_id = nlapiGetUser() + ''
            ,   message_date_tmp = nlapiStringToDate(message_record.getValue('messagedate', 'messages'))
            ,   message_date = message_date_tmp ? message_date_tmp : self.dummy_date
            ,   message_date_to_group_by = message_date.getFullYear() + '-' + (message_date.getMonth() + 1) + '-' + message_date.getDate()
            ,   message = {
                    internalid: message_record.getValue('internalid', 'messages')
                ,   author: message_record.getValue('author', 'messages') === customer_id ? 'You' : message_record.getText('author', 'messages')
                ,   text: self.stripHtmlFromMessage(message_record.getValue('message', 'messages'))
                ,   messageDate: nlapiDateToString(message_date, 'timeofday')
                ,   initialMessage: false
                };

            if (grouped_messages[message_date_to_group_by])
            {
                grouped_messages[message_date_to_group_by].messages.push(message);
            }
            else
            {
                grouped_messages[message_date_to_group_by] = {
                    date: self.getMessageDate(message_date)
                ,   messages: [message]
                };
            }

            messages_count ++;

            if (messages_count === message_records.length)
            {
                message.initialMessage = true;
            }
        });

        support_case.grouped_messages = _(grouped_messages).values();
        support_case.messages_count = messages_count;
        }
    });
});