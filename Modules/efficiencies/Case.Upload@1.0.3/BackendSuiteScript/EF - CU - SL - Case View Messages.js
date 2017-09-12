var Handler = (function Handler() {
    'use strict';

    var CaseData = function CaseData(options) {
        this.caseID = options.caseID;
        this.caseDetail = [];
        this.caseMessages = [];
        this.setData();
    };

    var main = function main(request, response) {
        var result;
        var caseID;
        var caseData;

        try {
            if (request.getMethod() === 'GET') {
                caseID = request.getParameter('caseid');
                caseData =  new CaseData({caseID: caseID});
                result = caseData.generateHTML();
            }
        } catch (e) {
            result = {status: e.message};
        }

        response.setContentType('HTMLDOC');
        response.write(result);
    };

    CaseData.prototype = {
        generateHTML: function generateHTML() {
            var htmlcontent = '';

            htmlcontent += '<head>';
            htmlcontent +=      this.getCSSContent();
            htmlcontent += '</head>';
            htmlcontent += '<body>';
            htmlcontent += '<div>';
            htmlcontent += '    <div>';
            htmlcontent +=          this.caseHeaderHTML();
            htmlcontent += '    </div>';
            htmlcontent += '    <div><h2>Messages</h2></div>';
            htmlcontent += '    <div>';
            htmlcontent +=          this.caseMessagesHTML();
            htmlcontent += '    </div>';
            htmlcontent += '</div>';
            htmlcontent += '</body>';

            return htmlcontent;
        },

        getCSSContent: function getCSSContent() {
            var csscontent = ''

            csscontent += '<style>';
            csscontent += '\
                body {                          \
                    font-family: arial;         \
                    font-size: 15px;            \
                    margin: 50px;               \
                    margin-left: 150px;         \
                    margin-right: 150px;        \
                }                               \
                .Case, .Case * {                \
                    font-size: 35px;            \
                }                               \
                .Case {                         \
                    margin-bottom: 15px;        \
                }                               \
                ul{ list-style-type: none; }    \
                .cu-author {                    \
                    font-weight: bold;          \
                    color: #727B81;             \
                }                               \
                .cu-date {                      \
                    font-style: italic;         \
                    color: #949494;             \
                    font-size: 12px;            \
                }                               \
                .cu-li-messages {                \
                    margin: 8px;                \
                    margin-bottom: 20px;        \
                }                               \
                .cu-btn-link-reply {            \
                    text-decoration: none;      \
                    color: #FFFFFF;             \
                }                               \
                .cu-btn-reply {                 \
                    text-align: center;         \
                    font-size: 13px;            \
                    color: #FFFFFF;             \
                    background-color: #404040;  \
                    padding: 5px;               \
                    border: none;               \
                    margin-top: 8px;            \
                }                               \
                .cu-btn-link-reply:link {       \
                    color: #FFFFFF;             \
                }                               \
                .cu-btn-link-reply:visited {    \
                    color: #FFFFFF;             \
                }                               \
                .cu-btn-link-reply:hover {      \
                    color: #FFFFFF;             \
                }                               \
                .cu-btn-link-reply:active {     \
                    color: #FFFFFF;             \
                }                               \
            ';

            csscontent += '</style>';

            return csscontent;
        },

        caseHeaderHTML: function caseHeaderHTML() {
            var htmlcontent = '';
            var caseDetail;
            var i;

            for (i = 0; i < this.caseDetail.length; i++) {
                caseDetail = this.caseDetail[i];

                htmlcontent += '<div class="' + caseDetail.label + '">';
                htmlcontent += '    <label class="cu-label">' + caseDetail.label + ':</label>';
                htmlcontent += '    <span class="cu-value">' + caseDetail.value + '</span>';
                htmlcontent += '</div>';
            }

            htmlcontent += '<button class="cu-btn-reply">';
            htmlcontent += '<a class="cu-btn-link-reply" ';
            htmlcontent += ' href="https://system.netsuite.com/app/crm/support/supportcase.nl?id=';
            htmlcontent +=      this.caseID + '" target="_blank">';
            htmlcontent += 'Click here to Reply';
            htmlcontent += '</a>';
            htmlcontent += '</button>';

            return htmlcontent;
        },

        caseMessagesHTML: function caseMessagesHTML() {
            var htmlcontent = '';
            var message;
            var i;

            htmlcontent += '<ul>';
            for (i = 0; i < this.caseMessages.length; i++) {
                message = this.caseMessages[i];

                htmlcontent += '<li class="cu-li-messages">';
                htmlcontent += '    <div class="cu-author">' + message.author + ': </div>';
                htmlcontent += '    <div class="cu-date">' + message.messagedate + '</div>';
                htmlcontent += '    <div class="cu-messsage">' + message.message + '</div>';
                htmlcontent += '    <div class="cu-attachment-placeholder">';
                htmlcontent +=          this.messageAttachmentsHTML(message.attachments);
                htmlcontent += '    </div>';
                htmlcontent += '</li>';
            }
            htmlcontent += '</ul>';

            return htmlcontent;
        },

        messageAttachmentsHTML: function messageAttachmentsHTML(attachments) {
            var htmlcontent = '';
            var attachment;
            var i;

            htmlcontent += '<ul>';
            if (attachments && attachments.length > 0) {
                for (i = 0; i < attachments.length; i++) {
                    attachment = attachments[i];

                    htmlcontent += '<li class="cu-li-attachments">';
                    htmlcontent += '    <a class="cu-link" href="' + attachment.link + '" target="_blank">';
                    htmlcontent += '        View Attachment ' + (i + 1) + '';
                    htmlcontent += '    </a>';
                    htmlcontent += '</li>';
                }
            }
            htmlcontent += '</ul>';

            return htmlcontent;
        },

        setData: function setData() {
            var filters1 = [ new nlobjSearchFilter('custrecord_ef_cu_cmf_case', null, 'is', this.caseID) ];
            var columns1 = [
                new nlobjSearchColumn('custrecord_ef_cu_cmf_message_id'),
                new nlobjSearchColumn('custrecord_ef_cu_cmf_file_id')
            ];
            var msgAttRecord = nlapiSearchRecord('customrecord_ef_cu_case_messages_file', null, filters1, columns1);
            var msgRcrd;
            var caseRecord;
            var caseRcrd;
            var msgAtt = [];
            var msgID;
            var i;

            var filters2 = [ new nlobjSearchFilter('internalid', null, 'is', this.caseID) ];
            var columns2 = [
                new nlobjSearchColumn('internalid'),
                new nlobjSearchColumn('casenumber'),
                new nlobjSearchColumn('title'),
                new nlobjSearchColumn('startdate'),
                new nlobjSearchColumn('company'),
                new nlobjSearchColumn('email'),

                new nlobjSearchColumn('internalid', 'messages'),
                new nlobjSearchColumn('author', 'messages'),
                new nlobjSearchColumn('message', 'messages'),
                new nlobjSearchColumn('messagedate', 'messages')
            ];

            columns2[6].setSort(true); // message internal id

            caseRecord = nlapiSearchRecord('supportcase', null, filters2, columns2);

            if (msgAttRecord) {
                for (i = 0; i < msgAttRecord.length; i++) {
                    msgRcrd = msgAttRecord[i];
                    msgID = msgRcrd.getValue('custrecord_ef_cu_cmf_message_id');

                    if (! msgAtt[msgID] || typeof msgAtt[msgID] === 'undefined') {
                        msgAtt[msgID] = [];
                    }

                    msgAtt[msgID].push({
                        link: nlapiLookupField('file', msgRcrd.getValue('custrecord_ef_cu_cmf_file_id'), 'url')
                    });
                }
            }

            if (caseRecord) {
                for (i = 0; i < caseRecord.length; i++) {
                    caseRcrd = caseRecord[i];
                    msgID = caseRcrd.getValue('internalid', 'messages');

                    this.caseMessages.push({
                        msgID: msgID,
                        author: caseRcrd.getText('author', 'messages'),
                        message: caseRcrd.getValue('message', 'messages'),
                        messagedate: caseRcrd.getValue('messagedate', 'messages'),
                        attachments: msgAtt[msgID]
                    });
                }

                this.caseDetail.push({label: 'Case', value: caseRecord[0].getValue('casenumber') +
                    ' ' + caseRecord[0].getValue('title') });

                this.caseDetail.push({label: 'Date', value: caseRecord[0].getValue('startdate')});
                this.caseDetail.push({label: 'Sender',
                            value:
                            (caseRecord[0].getText('company')) + ' (' + (caseRecord[0].getValue('email')) + ')'});
            }
        }
    };

    return {
        main: main
    };
}());