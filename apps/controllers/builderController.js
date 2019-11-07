/* 
 * Takes care of the builder page
 */


var builderC = {};
var controller = {};

builderC.init = function () {
    controller = require('../controllers/controller');
    //global.prompt = require('electron-prompt');
    var Store = require('electron-store');
    this.conf = new Store({name:'projects_data.ini'});
    controller.init();
    this.events();
};
builderC.events = function () {//carensmith46@gmail.com, business writng
    //3085182933
    var args = controller.windows.ipc.sendSync('builder-info-request', 'builder');
    args = JSON.parse(args);
    builderC.rendererConfig = args;
    builderC.name = args.name;
    builderC.location = args.location;
    builderC.plugin = args.plugin;
    builderC.pageTitle = "{1} | KKWS {0} Project".f(args.plugin.name, args.name);
    builderC.angular();
};
builderC.angular = function () {
    builderC.$module = angular.module('builder', []);
    builderC.angularControl();
};
builderC.angularControl = function () {
    builderC.$module.controller("Controller", function ($scope) {
        builderC.$scope = $scope;
        builderC.$scope.promptValue = "";
        builderC.$scope.filenameModalStatus = "";
        builderC.$scope.deleteProjectFile = builderC.deleteProjectFile;
        builderC.setupProjectFiles();
        builderC.metaControl();
        builderC.mainNavControl();
        builderC.setupTabs();
    });
};
builderC.metaControl = function () {
    builderC.$scope.pageTitle = builderC.pageTitle;
};
builderC.mainNavControl = function () {
    builderC.$scope.quit = function () {
        if (confirm('Quitting? Any unsaved changes will not be saved!'))
            controller.windows.curWindow.close();
    };
    this.$scope.minimize = function () {
        controller.windows.curWindow.minimize();
    };
};
//var tmpC = 0;
builderC.setupTabs = function () {
    let tabGroup = new TabGroup();
    builderC.$scope.filenameModalStatus = "";
    function addTab(name = null) {
        if (name === null) {
            $('#modal-filename').modal('show');
            return;
        }
        if(!name.endsWith('.html') && !name.endsWith('(_)html')){
            builderC.$scope.filenameModalStatus = 'Must specify *.html file name';
            return;
        }
        if(!name.endsWith('(_)html'))
            name = name.replace('(_)','.');
        $('#modal-filename').modal('hide');
        builderC.rendererConfig.filename = name;
        builderC.rendererConfig.pluginPath = controller.pathUtil.getPath('pluginsPath')+builderC.plugin.name+"/";
        
        /*var canvasWin = controller.windows.createWindow({
            windowTitle: "KKWS - {0} Project | {1}",
            hasFrame: false,
            BrowserWindow: controller.windows.browserWindow,
            //parentWindow: controller.windows.curWindow,
            width: 1000
        });
        canvasWin.win.loadURL(`${controller.pathUtil.path.viewsPath}sub-views/builder-sub.html?data=${builderC.rendererConfig}`);//(controller.pathUtil.getView("dashboard"));
        canvasWin.win.show_();*/
        
        var tab = tabGroup.addTab({
            src: `${controller.pathUtil.path.viewsPath}sub-views/builder-sub.html?data=`+JSON.stringify(builderC.rendererConfig),
            visible: true,
            active: true,
            webviewAttributes: {nodeIntegration:true}
        });
        builderC.addProjectFile(name);
        tab.setTitle(name);
        //$('body').css('margin-top','7px');
    };
    builderC.$scope.addTab = addTab;
};
builderC.setupProjectFiles = function(){
    //builderC.conf.clear();
    builderC.$scope.projectFiles = [];
    builderC.addProjectFile('index.html');
    builderC.loadProjectFiles();
};
builderC.loadProjectFiles = function(){
    var tmp = builderC.conf.get('project-{0}'.f(builderC.name));
    builderC.$scope.projectFiles = [];
    for(var i in tmp){
        tmp[i].filename = tmp[i].filename.replace('(_)','.').trim();
        builderC.$scope.projectFiles.push(tmp[i]);
    }
};
builderC.deleteProjectFile = function(filename){
    if(!confirm('Sure you want to delete Web Page?'))
        return;
    builderC.conf.delete('project-{0}.{1}'.f(builderC.name, filename));
    builderC.loadProjectFiles();
};
builderC.addProjectFile = function(filename){
    filename = filename.replace('.','(_)').trim().replace(' ','-');
    builderC.conf.set('project-{0}.{1}'.f(builderC.name, filename), {
        filename: filename
    });
    builderC.loadProjectFiles();
};

