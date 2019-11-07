/* 
 * Controller template
 */



KController = {};
KController.init = function () {
    if(this.isDevMode())
        this.baseDir = "./";//for now please
    else
        this.baseDir = "./resources/app";
    this.setupWindows();
    //this.getRendererConfig();
    this.setupPaths();
};
KController.setupWindows = function () {
    this.windows = require('../../core/windows');
    this.windows.setupRendererWindowInstance();
};
KController.getRendererConfig = function () {
    this.windows.ipc.send('need-app-config', 'dashboard');
    this.windows.ipc.on('take-app-config', function (ev, args) {
        KController.baseDir = args;
        KController.setupPaths();
    });
};
KController.setupPaths = function () {
    this.pathUtil = require("../../core/path_utils");
    this.pathUtil.setup(this.baseDir);
    //alert(KController.pathUtil.getCss('_default_', 'font-awesome.min'));
};
KController.isDevMode = function(){
    return require('process').mainModule.filename.indexOf('app.asar') === -1;
}
String.prototype.format = String.prototype.f = function(){
    var s = this,
            i = arguments.length;
    while(i--){
        s = s.replace(new RegExp('\\{'+i+'\\}', 'gm'), arguments[i]);
    }
    return s;
};

module.exports = KController;