function getNSFileType(request) {
    var testfile = nlapiLoadFile(request.getParameter('fileid'));
    var type = testfile.getType();
    response.write(type);
}
