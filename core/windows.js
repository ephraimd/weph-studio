"use strict";
/* 
 * This class is a self serving window constructor.
 * It can be a child window or main window.
 * It can manage the list of child windows its been connected to with their reference names
 */

var Window = {};

Window.setup = function (opts = null) {
    this.windowsList = {};
    this.winListCount = 0;
    if (opts)
        return this.createWindow(opts);
};
Window.createWindow = function(opts){
    {
        var bounds;
        bounds = {
            x: 20,
            y: 10,
            width: opts.width === undefined ? 1200 : opts.width,
            height: opts.height === undefined ? 700 : opts.height
        };
        var windowOptions = {
            title: opts.windowTitle,
            backgroundColor: '#333',
            width: bounds.width,
            height: bounds.height,
            minWidth: 900,
            minHeight: 700,
            //icon: 'pingendo.ico',
            acceptFirstMouse: true,
            x: bounds.x,
            y: bounds.y,
            show: opts.show === undefined ? false : opts.show,
            frame: opts.hasFrame === undefined ? true : opts.hasFrame,
            modal: opts.isModal === undefined ? false : opts.isModal,
            resizable: opts.isResizable === undefined ? true : opts.isResizablefalse,
            webPreferences: {
                "webSecurity": false
            }
        };
        if (opts.parentWindow)
            windowOptions.parent = opts.parentWindow;
        var win = opts.BrowserWindow;
        win = new win(windowOptions);
        win.show_ = function () {
            win.on('ready-to-show', () => {
                win.show();
            });
        };

        return this.saveNewWindow(win);
    }
};

Window.saveNewWindow = function(window){
    var winName = "win" + this.winListCount++;
        this.windowsList[winName] = window;
        return {"name": winName, "win": window};
};
Window.getWindowInstance = function(windowName){
    return this.windowsList[windowName];
};
Window.setupRendererWindowInstance = function(){
    this.windowsList = {};
    this.electronInstance = require('electron');
    //const {app, Menu, globalShortcut, dialog, ipcMain} = this.electronInstance;
    this.ipc = this.electronInstance.ipcRenderer;
    this.curWindow = this.electronInstance.remote.getCurrentWindow();
    this.browserWindow = this.electronInstance.remote.BrowserWindow;
    //const {app, Menu, BrowserWindow, globalShortcut, dialog, ipcMain} = electron;
};
Window.close = function(){
    this.curWindow.close();
};

module.exports = Window;