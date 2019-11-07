/**
 * By Ephrahim Adedamola
 */
"use strict";

var utils = {};
utils.hide = function (dom) {
    dom.style.visibility = 'hidden';
    dom.style.display = 'none';
};
utils.show = function (dom) {
    dom.style.visibility = 'visible';
    dom.style.display = 'block';
};
utils.isHidden = function (dom) {
    return dom.style.visibility === 'hidden';
};

var domHandles = {};
domHandles.staticList = document.querySelector("#static-plugin-listing");
domHandles.kfList = document.querySelector("#kfusion-plugin-listing");

var initJobs = function () {
    utils.hide(domHandles.staticList);
};
var pluginListSwitchJob = function () {
    var swtcher = document.querySelector("#floater");//switch-plugin-list
    swtcher.addEventListener('click', function (e) {
        if (utils.isHidden(domHandles.staticList)) {
            utils.hide(domHandles.kfList);
            utils.show(domHandles.staticList);
        } else {
            utils.hide(domHandles.staticList);
            utils.show(domHandles.kfList);
        }
        e.preventDefault();
    });
    var tester = document.querySelector("#test-debug");
    tester.addEventListener('click', function (e) {
        var win = global.windowHandle.createWindow({
            windowTitle: "My New Window",
            hasFrame: false
        });
        win.win.loadURL('file://' + __dirname + '/dashboard/subwindow_dashboard.html');
        win.win.show();
    });
};
var openWindow = function () {
    window.open(document.URL, '_blank', 'location=yes,height=570,width=520,scrollbars=no,status=no');
};
try {
    initJobs();
    pluginListSwitchJob();
} catch (er) {
    alert(er);
}






