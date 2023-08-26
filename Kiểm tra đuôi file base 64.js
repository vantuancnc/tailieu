/**
 * Returns the data type based on the base64 string
 * @param {String} base64String
 * @param {String} fileName
 * @returns {String}
 */
detectMimeType(base64String, fileName) {
  var ext = fileName.substring(fileName.lastIndexOf(".") + 1);
  if (ext === undefined || ext === null || ext === "") ext = "bin";
  ext = ext.toLowerCase();
  const signatures = {
    JVBERi0: "application/pdf",
    R0lGODdh: "image/gif",
    R0lGODlh: "image/gif",
    iVBORw0KGgo: "image/png",
    TU0AK: "image/tiff",
    "/9j/": "image/jpg",
    UEs: "application/vnd.openxmlformats-officedocument.",
    PK: "application/zip",
  };
  for (var s in signatures) {
    if (base64String.indexOf(s) === 0) {
      var x = signatures[s];
      // if an office file format
      if (ext.length > 3 && ext.substring(0, 3) === "ppt") {
        x += "presentationml.presentation";
      } else if (ext.length > 3 && ext.substring(0, 3) === "xls") {
        x += "spreadsheetml.sheet";
      } else if (ext.length > 3 && ext.substring(0, 3) === "doc") {
        x += "wordprocessingml.document";
      }
      // return
      return x;
    }
  }
  // if we are here we can only go off the extensions
  const extensions = {
    xls: "application/vnd.ms-excel",
    ppt: "application/vnd.ms-powerpoint",
    doc: "application/msword",
    xml: "text/xml",
    mpeg: "audio/mpeg",
    mpg: "audio/mpeg",
    txt: "text/plain",
  };
  for (var e in extensions) {
    if (ext.indexOf(e) === 0) {
      var xx = extensions[e];
      return xx;
    }
  }
  // if we are here – not sure what type this is
  return "unknown";
}
