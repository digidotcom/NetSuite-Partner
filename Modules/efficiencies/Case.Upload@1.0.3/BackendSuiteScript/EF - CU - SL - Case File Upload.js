define('EF CU SL - Case File Upload', [
    'Application',
    'Case.File.Model',
    'underscore',
    'Case.FileUpload.Configuration'
], function EFCUCaseFileUpload(Application, CaseFileModel, _, Configuration) {
    'use strict';

    var CaseMessageFile = function caseMessageFile(fileObject) {
        this.fileObject = fileObject;
        this.fileOrigName = this.fileObject.getName();
        this.fileExtension = this.fileOrigName.substring(this.fileOrigName.lastIndexOf('.'), this.fileOrigName.length);
    };

    var main = function main(request) {
        var result;
        var fileObject;
        var caseMsgFile;
        var caseID;
        var fileID;

        try {
            switch (request.getMethod()) {
            case 'POST':
                fileObject = request.getFile('file');
                caseMsgFile = new CaseMessageFile(fileObject);

                if ( caseMsgFile.validate() ) {
                    result = caseMsgFile.upload();
                    Application.sendContent(result);
                }

                break;

            case 'GET':
                caseID = request.getParameter('caseid');
                result = CaseFileModel.getMessageFiles(caseID);
                Application.sendContent(result);

                break;

            case 'DELETE':
                fileID = request.getParameter('internalid');
                nlapiDeleteFile(fileID);
                Application.sendContent({status: 'ok'});
                break;
            default: break;
            }
        }catch (e) {
            Application.sendError(e);
        }
    };

    CaseMessageFile.prototype = {
        validate: function validate() {
            if (!this.fileObject) {
                throw nlapiCreateError('ERR_FILE_NOT_PRESENT', 'No file uploaded');
            }

            if (Configuration.sizeLimit) {
                if (this.fileObject.getSize() > Configuration.sizeLimit) {
                    throw nlapiCreateError('ERR_FILE_SIZE', 'File size limit exceeded');
                }
            }

            if (Configuration.allowedTypes &&
               (_.isArray(Configuration.allowedTypes) && Configuration.allowedTypes.length > 0)) {
                if (!_.contains(Configuration.allowedTypes, this.fileObject.getType())) {
                    throw nlapiCreateError('ERR_FILE_TYPE', 'File type not allowed');
                }
            }

            return true;
        },

        upload: function uploadFile() {
            var fileID;
            var fileUrl;

            this.fileObject.setName( this.getNewFileName() );
            this.fileObject.setFolder(Configuration.temporaryFolderID);

            try {
                fileID = nlapiSubmitFile(this.fileObject);

                if (fileID) {
                    fileUrl = nlapiLookupField('file', fileID.toString(), 'url');
                }
            } catch (e) {
                if (e instanceof nlobjError) {
                    console.error(e.getCode(), e.getDetails());
                }

                throw nlapiCreateError('ERR_FILE_UPLOADED', 'Error ocurred while uploading');
            }

            return {
                fileID: fileID.toString(),
                link: fileUrl,
                oldName: this.fileOrigName
            };
        },

        getNewFileName: function getNewFileName() {
            return nlapiGetUser() + '_' +
                   new Date().getMilliseconds().toString() + parseInt(Math.random() * 10000000, 10).toString() +
                   this.fileExtension;
        }
    };

    return { main: main };
});