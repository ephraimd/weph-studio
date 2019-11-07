"use strict";
/* 
 * Getting Started Here
 */

/******************* BLESSED BE THE NAME OF THE LORD WHO REIGNS IN THE HEAVENS FOREVER AND EVER AMEN!
 * BLESSED BE THE NAME OF JESUS CHRIST, THE KING OF KINGS AND THE LORD OF LORDS AMEN!!!
 */
var electron = require('electron');
const {app, Menu, BrowserWindow, globalShortcut, dialog, ipcMain} = electron;

global.setGData = function (alias, data) {
    global.kkws[alias] = data;
};
global.getGData = function (alias) {
    return global.kkws[alias];
};

class App {
    constructor() {
        this.setup(); //first call point!
        //
        var PathUtil = require("./core/path_utils");
        var Window = require('./core/windows');
        PathUtil.setup(__dirname);
        Window.setup();
        var win1 = Window.createWindow({
            windowTitle: "KKWS Web Builder",
            hasFrame: false,
            BrowserWindow: BrowserWindow
        });
        win1.win.loadURL(PathUtil.getView("dashboard"));
        win1.win.show_();
        win1.win.on("close", ()=>{
            win1.win = null;
        });
        /*
        win1.win.on("blur", ()=>{
            win1.win.hide();
        });
        
        win1.win.on("window-all-closed", ()=>{
            globalShortcut.unregisterAll();
            if(process.platform !== 'darwin')
                app.quit();
        });
        app.on('will-quit', ()=> {
            globalShortcut.unregisterAll();
        });
        app.on('before-quit', ()=> {
            win1.win.removeAllListeners('close');
            globalShortcut.unregisterAll();
            win1.win.close();
        });
        */
        ipcMain.on('builder-info-provided', function (ev, args) {
            global.kkws.tmpData = args;
        });
        ipcMain.on('builder-config-provided', function (ev, args) {
            global.kkws.tmpData = args;
        });
        ipcMain.on('builder-info-request', function (ev, args) {
            ev.returnValue = global.kkws.tmpData;
        });
        ipcMain.on('builder-config-request', function (ev, args) {
            ev.returnValue = global.kkws.tmpData;
        });
        //win1.win.toggleDevTools();

    }

    setup() {
        
        global.kkws = {};
        

        
    }
};

app.on('ready', function () {
    new App();
});