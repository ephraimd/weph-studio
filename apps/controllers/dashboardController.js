/* 
 * Takes care of the dashboard page
 */



var dashboardC = {};
var controller;
dashboardC.init = function () {
    controller = require('../controllers/controller');
    controller.init();
    var Store = require('electron-store');
    this.conf = new Store({name:'prefdata.ini'});
    //dashboardC.events();
    dashboardC.angular();
};
dashboardC.angular = function () {
    dashboardC.$module = angular.module('dashboard', []);
    dashboardC.loadPlugins();
    dashboardC.angularControl();
};
dashboardC.angularControl = function () {
    dashboardC.$module.controller("Controller", function ($scope) {
        dashboardC.$scope = $scope;
        dashboardC.metaControl();
        dashboardC.initVars();
        dashboardC.mainNavControl();
        $scope.openPluginDialog = () => {
            $("#modal-add-plugin").modal('show');
        };
        dashboardC.$scope.staticPlugins = dashboardC.pluginList;
        //dashboardC.$scope.rcProjects.push({title:''});
        dashboardC.$scope.doAddPlugin = dashboardC.doAddPlugin;
        dashboardC.$scope.deletePlugin = dashboardC.deletePlugin;
        dashboardC.$scope.openFolderDialog = dashboardC.openFolderDialog;
        dashboardC.$scope.createProject = dashboardC.createProject;
        dashboardC.$scope.doCreateProject = dashboardC.doCreateProject;
        dashboardC.$scope.openRecentProject = dashboardC.openRecentProject;
        dashboardC.$scope.deleteRecentProject = dashboardC.deleteRecentProject;
        dashboardC.$scope.clearRecentProjects = dashboardC.clearRecentProjects;
        dashboardC.$scope.test = () => {
            dashboardC.$scope.rcProjects.push({title: 'ssdd'});
        };
    });
};
dashboardC.initVars = function () {
    this.$scope.dialogPluginPath = "";
    this.$scope.pluginModalStatusColor = 'text-muted'; //
    this.$scope.pluginModalStatus = 'Please ensure you select a valid *.kplugin file';
    this.$scope.projectModalStatus = '';
    this.initProjectsFunc();
};
dashboardC.initProjectsFunc = function () {
    dashboardC.$scope.curProject = {};
    this.$scope.curProject.location = "";
    this.$scope.curProject.name = "";
    this.$scope.curProject.plugin = "";
    dashboardC.$scope.rcProjects = [];
    dashboardC.loadRecentProjects();
};
dashboardC.metaControl = function () {
    this.$scope.pageTitle = "KKWS - dashboard";
    /*this.$scope.cssFiles = [
     controller.pathUtil.getCss('_default_', 'font-awesome.min'),
     controller.pathUtil.getCss('_default_', 'theme'),
     controller.pathUtil.getCss('dashboard', 'mystyle')
     ];*/
};
dashboardC.mainNavControl = function () {
    this.$scope.quit = function () {
        if (confirm('Sure you want to quit?'))
            controller.windows.curWindow.close();
    };
    this.$scope.minimize = function () {
        controller.windows.curWindow.minimize();
    };
};
dashboardC.openFolderDialog = function (job) {
    if (job === "plugin") {
        dashboardC.$scope.dialogPluginPath = controller.pathUtil.openFileDialog({
            title: "KKWS Plugin File",
            exts: ['kplugin']
        })[0]; //just the first is needed
    } else if (job === "project") {
        dashboardC.$scope.curProject.location = controller.pathUtil.openFileDialog()[0]; //just the first is needed
    }
};
dashboardC.doAddPlugin = function () {
    var addPluginCb = function (pluginName, err) {
        dashboardC.$scope.pluginModalStatusColor = 'text-danger text-bold';
        if (err)
            dashboardC.$scope.pluginModalStatus = "Error: {1}".f(pluginName, err.message);
        //not loaded yet, lets go on to load it
        var resp = dashboardC.pluginer.loadPlugin(pluginName);
        if (resp.error === undefined) {
            dashboardC.$scope.pluginModalStatus = "Successfully loaded Plugin ".f(pluginName);
            alert(dashboardC.$scope.pluginModalStatus);
            dashboardC.$scope.pluginModalStatusColor = 'text-success text-bold';
            dashboardC.pluginList = dashboardC.pluginer.loadPluginsList();
            controller.windows.curWindow.reload();
        } else {
            dashboardC.$scope.pluginModalStatus = "Error: {0}".f(resp.error);
            alert(dashboardC.$scope.pluginModalStatus);
        }
    };
    dashboardC.pluginer.addPlugin(dashboardC.$scope.dialogPluginPath, addPluginCb);
};
dashboardC.loadPlugins = function () {
    this.pluginer = require('pluginer');
    this.pluginer.init(controller.pathUtil.getPath('pluginsPath'));
    this.pluginList = this.pluginer.loadPluginsList();
};
dashboardC.deletePlugin = function (name) {
    if (!confirm('Are sure you want to delete this plugin?'))
        return false;
    var resp = dashboardC.pluginer.deletePlugin(name);
    if (resp.error !== undefined)
        alert(resp.error);
    else {
        alert('Plugin Deleted!');
        controller.windows.curWindow.reload();
    }
};
dashboardC.createProject = function (plugin, isStealth = false) {
    dashboardC.$scope.curProject.plugin = plugin;
    if (!isStealth)
        $('#modal-create-project').modal('show');
};
dashboardC.addRecentProject = function () {
    this.conf.set('recent_projects.{0}'.f(dashboardC.$scope.curProject.name), {
        name: dashboardC.$scope.curProject.name,
        location: dashboardC.$scope.curProject.location,
        plugin: dashboardC.$scope.curProject.plugin
    });
    dashboardC.$scope.rcProjects.push(this.conf.get('recent_projects.{0}'.f(dashboardC.$scope.curProject.name)));
};
dashboardC.openRecentProject = function (name) {
    var project = dashboardC.conf.get('recent_projects.{0}'.f(name));
    if(!project){
        alert('Failed to find saved project name.');
        return;
    }
    alert('Open project {0}?'.f(name));
    dashboardC.$scope.curProject.name = project.name;
    dashboardC.$scope.curProject.plugin = project.plugin;
    dashboardC.$scope.curProject.location = project.location;
    dashboardC.doCreateProject(true);
};
dashboardC.loadRecentProjects = function () {
    var get = dashboardC.conf.get('recent_projects');
    dashboardC.$scope.rcProjects = [];
    for (var i in get) {
        dashboardC.$scope.rcProjects.push(get[i]);
    }
};
dashboardC.clearRecentProjects = function () {
    if (!confirm('Are sure you want to clear the recent project history?'))
        return;
    dashboardC.conf.clear();
    dashboardC.$scope.rcProjects = [];
};
dashboardC.deleteRecentProject = function (name) {
    dashboardC.conf.delete('recent_projects.{0}'.f(name));
    dashboardC.loadRecentProjects();
};
dashboardC.doCreateProject = function (isStealth = false) {
    if (dashboardC.$scope.curProject.location === '') {
        dashboardC.$scope.projectModalStatus = 'Error: Please select a valid folder to store the project in';
        return;
    } else if (dashboardC.$scope.curProject.name === '') {
        dashboardC.$scope.projectModalStatus = 'Error: Please specify a project name';
        return;
    } else
        dashboardC.$scope.projectModalStatus = '';
    if (!isStealth) {
        $('#modal-create-project').modal('hide');
    }else{
        dashboardC.deleteRecentProject(dashboardC.$scope.curProject.name);
    }
    dashboardC.addRecentProject();

    var canvasWin = controller.windows.createWindow({
        windowTitle: "KKWS - {0} Project | {1}".f(dashboardC.$scope.curProject.plugin.name, dashboardC.$scope.curProject.name),
        hasFrame: false,
        BrowserWindow: controller.windows.browserWindow,
        //parentWindow: controller.windows.curWindow,
        width: 1000
    });
    var obj = {
        name: dashboardC.$scope.curProject.name,
        location: dashboardC.$scope.curProject.location,
        plugin: dashboardC.$scope.curProject.plugin
    };
    controller.windows.ipc.send('builder-info-provided', JSON.stringify(obj));
    canvasWin.win.loadURL(controller.pathUtil.getView("builder")); //(controller.pathUtil.getView("dashboard"));
    canvasWin.win.show_();
};
/**
 * this.pluginList = [];
 * [{name:,]
 */