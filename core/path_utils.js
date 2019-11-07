/* 
 * Helps with path getting 
 */



var PathUtil = {};

PathUtil.constructor = function () {};
PathUtil.setup = function (dirname) {
    this.path = {};
    this.pather = require('path');
    dirname = this.pather.resolve(dirname);
    this.path.basePath = dirname;
    this.path.appsPath = dirname + "/apps/";
    this.path.corePath = dirname + "/core/";
    this.path.pluginsPath = dirname + "/plugins/";
    this.path.resPath = dirname + "/apps/resources/";
    this.path.imgPath = dirname + "/apps/resources/images";
    this.path.controllersPath = dirname + "/apps/controllers/";
    this.path.viewsPath = dirname + "/apps/views/";
    this.path.libsPath = dirname + "/apps/libs/";
    //
    this.setPath = PathUtil.setPath;
    this.getBaseDir = function () {
        return "JESUS JESUS JESUS";
    };
    //alert("---"+this.path.resPath);
};
PathUtil.setPath = function (alias, path) {
    this.path[alias] = path;
};
PathUtil.getPath = function (alias) {
    return this.path[alias];
};
PathUtil.getCss = function (viewName, cssFilename) {
    return this.path.resPath + viewName + "/css/" + cssFilename + ".css";
};
PathUtil.getJs = function (viewName, jsFilename) {
    return this.path.resPath + viewName + "/js/" + jsFilename + ".js";
};
PathUtil.getView = function (name) {
    return 'file://' + this.path.viewsPath + name + ".html";
};
PathUtil.getBaseDir = function () {
    return this.path.basePath;
};
PathUtil.openFileDialog = function (type=null) { //for folder, dont send an argument
    const {dialog} = require('electron').remote;
    var options = {};
    options.title = "KKWS Dialog";
    if(type === null)
        options.properties = ['openDirectory'];
    else{
        options.filters = [{name: type.title, extensions: type.exts}];
    }
    var path = dialog.showOpenDialog(options);
    return (path) ? path : null;
};

module.exports = PathUtil;