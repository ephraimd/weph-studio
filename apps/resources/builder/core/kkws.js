var editor = grapesjs.init({
    allowScripts: 1,
    showOffsets: 1,
    autorender: 0,
    noticeOnUnload: 0,
    container: '#gjs',
    height: '100%',
    fromElement: true,
    clearOnRender: 0,
    plugins: [
        'gjs-plugin-export'
    ],
    pluginsOpts: {
        'gjs-plugin-export': {
            btnLabel: 'Download Zip',
            preHtml: `<!doctype html>
                        <html>
                        <head>
                        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
                        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
                        <link rel="stylesheet" href="dist/themes/materialize/materialize.min.css">
                        <link rel="stylesheet" href="css/style.css">
                        <script src="dist/themes/jquery/jquery.min.js"></script>
                        <script src="dist/themes/materialize/materialize.min.js"></script>
                        </head>
                        <body>`,
            postHtml: `<!-- this page is generateded by KKWS -->
                        </body>
                        </html>`
        }
    },
    canvas: {
        styles: options.base_style,
        scripts: options.base_scripts
    },
    commands: {
        defaults: [
            {
                id: 'undo',
                run: function (editor, sender) {
                    sender.set('active', false);
                    editor.UndoManager.undo(true);
                }
            }, {
                id: 'redo',
                run: function (editor, sender) {
                    sender.set('active', false);
                    editor.UndoManager.redo(true);
                }
            }, {
                id: 'clean-all',
                run: function (editor, sender) {
                    sender.set('active', false);
                    if (confirm('Are you sure to clean the canvas?')) {
                        var comps = editor.DomComponents.clear();
                    }
                }
            }]
    },

    assetManager: {
        embedAsBase64: 1,
        upload: 'https://test.page',
        params: {
          _token: 'pCYrSwjuiV0t5NVtZpQDY41Gn5lNUwo3it1FIkAj',
        },
        assets: [
           { type: 'image', src : 'http://placehold.it/350x250/78c5d6/fff/image1.jpg', height:350, width:250},
           { type: 'image', src : 'http://placehold.it/350x250/459ba8/fff/image2.jpg', height:350, width:250},
           { type: 'image', src : 'http://placehold.it/350x250/79c267/fff/image3.jpg', height:350, width:250},
           { type: 'image', src : 'http://placehold.it/350x250/c5d647/fff/image4.jpg', height:350, width:250},
           { type: 'image', src : 'http://placehold.it/350x250/f28c33/fff/image5.jpg', height:350, width:250},
           { type: 'image', src : 'http://placehold.it/350x250/e868a2/fff/image6.jpg', height:350, width:250},
           { type: 'image', src : 'http://placehold.it/350x250/cc4360/fff/image7.jpg', height:350, width:250},
           { type: 'image', src : './img/work desk.jpg', date: '2015-02-01',height:1080, width:1728},
           { type: 'image', src : './img/phone-app.png', date: '2015-02-01',height:650, width:320},
           { type: 'image', src : './img/bg-gr-v.png', date: '2015-02-01',height:1, width:1728},
         ]
      },
	  blockManager: {
        blocks: blocksManager,
    },
    storageManager: {
        id: sessionID+'gjs-',
        type: 'local',
        autosave: 1,
        autoload: 1,
        stepsBeforeSave: 1,
        storeComponents: 1,
        storeStyles: 1,
        storeHtml: 1,
        storeCss: 1,
    },
    customStyleManager: editorConfig.customStyleManager
});

var pnm = editor.Panels;
pnm.addButton('options', [{
        id: 'undo',
        className: 'fa fa-undo icon-undo',
        command: function (editor, sender) {
            sender.set('active', 0);
            editor.UndoManager.undo(1);
        },
        attributes: {
            title: 'Undo (CTRL/CMD + Z)'
        }
    },
    {
        id: 'redo',
        className: 'fa fa-repeat icon-redo',
        command: function (editor, sender) {
            sender.set('active', 0);
            editor.UndoManager.redo(1);
        },
        attributes: {
            title: 'Redo (CTRL/CMD + SHIFT + Z)'
        }
    },
    {
        id: 'import',
        className: 'fa fa-edit',
        command: 'html-edit',
        attributes: {
            title: 'Edit and Import'
        }
    }, {
        id: 'clean-all',
        className: 'fa fa-trash icon-blank',
        command: function (editor, sender) {
            if (sender)
                sender.set('active', false);
            if (confirm('Are you sure to clean the canvas?')) {
                editor.DomComponents.clear();
                setTimeout(function () {
                    localStorage.setItem(sessionID+'gjs-assets', '');
                    localStorage.setItem(sessionID+'gjs-components', '');
                    localStorage.setItem(sessionID+'gjs-html', '');
                    localStorage.setItem(sessionID+'gjs-css', '');
                    localStorage.setItem(sessionID+'gjs-styles', '');
                }, 0);
            }
        },
        attributes: {
            title: 'Empty canvas'
        }
    },
    {
        id: 'clear-local',
        className: 'fa fa-close',
        command: function () {
            if (confirm('Reset to original?')) {
                localStorage.setItem(sessionID+'gjs-assets', '');
                localStorage.setItem(sessionID+'gjs-components', '');
                localStorage.setItem(sessionID+'gjs-html', '');
                localStorage.setItem(sessionID+'gjs-css', '');
                localStorage.setItem(sessionID+'gjs-styles', '');
                location.reload();
            }
        },
        attributes: {
            title: 'Reset'
        }
    },
    {
        id: 'save-project',
        className: 'fa fa-save',
        command: function (editor, sender) {
            sender.set('active', 0);
            editor.store();
            var htmlCode = editor.getHtml();
            var cssCode = editor.getCss();
            if(htmlCode.indexOf('<head') === -1 || htmlCode.indexOf('<meta') === -1){
                htmlCode = editorConfig.preHtmlBlock + htmlCode;
                htmlCode = htmlCode + editorConfig.postHtmlBlock;
            }
            //showMessage(pageData.location+ID);
            if(saveFile(pageData.location+ID, htmlCode) && saveFile(pageData.location+ID+'.css', cssCode))
                showMessage(`Saved ${ID} successfully!`);
            
        },
        attributes: {
            title: 'Save Web Page'
        }
    }
]);


// ---------------------
// Import/Edit
// ---------------------
var gra = {
    // append in container
    _a: function (appendName) {
        return container.appendChild(appendName);
    },
    // create elements
    _c: function (tagName) {
        return document.createElement(tagName);
    },
    // check extensions
    _e: function (fname) {
        var ext = /^.+\.([^.]+)$/.exec(fname);
        return ext == null ? "" : ext[1];
    },
    // select id
    _d: function (name, tag) {
        switch (tag) {
            case 'class':
                return document.getElementsByClassName(name);
                break;
            case 'id':
                return document.getElementById(name);
                break;
            default:
                return document.getElementById(name);
        }
    }
}


var pmodel = gra._d("modelPopup", "class");
var pfx = editor.getConfig().stylePrefix;
var modal = editor.Modal;
var cmdm = editor.Commands;
var pnm = editor.Panels;
var container = gra._c("div");
var btnEdit = gra._c("button");
var copyHtml = gra._c("button");
var copyCss = gra._c("button");
var anchor = gra._c("a");


function buildCodeEditor(type) {
    var codeEditor = editor.CodeManager.getViewer('CodeMirror').clone();
    codeEditor.set({
        codeName: type === 'html' ? 'htmlmixed' : 'css',
        readOnly: 0,
        theme: 'hopscotch',
        autoBeautify: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineWrapping: true,
        styleActiveLine: true,
        smartIndent: true,
        indentWithTabs: true
    });
    return codeEditor;
}
var htmlCodeEditor = buildCodeEditor('html');
var cssCodeEditor = buildCodeEditor('css');

btnEdit.innerHTML = '<i class="fa fa-code"></i> Apply';
copyHtml.innerHTML = '<i class="fa fa-copy"></i> Copy HTML';
copyCss.innerHTML = '<i class="fa fa-copy"></i> Copy CSS';

btnEdit.className = pfx + 'btn-prim ' + pfx + 'btn-import';
copyHtml.className = pfx + 'btn-prim ' + pfx + 'btn-html';
copyCss.className = pfx + 'btn-prim ' + pfx + 'btn-css';

// import button inside import editor
btnEdit.onclick = function () {
    var htmlCode = htmlCodeEditor.editor.getValue();
    var cssCode = cssCodeEditor.editor.getValue();
    editor.DomComponents.getWrapper().set('content', '');
    editor.setComponents(htmlCode.trim() + '<style>' + cssCode.trim() + '</style>');
    modal.close();
};

copyHtml.onclick = function () {
    var htmlCodes = htmlCodeEditor.editor.getValue();
    var dummy = gra._c("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', htmlCodes);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    document.execCommand('copy');
    alert('You have copied HTML codes!');
};
copyCss.onclick = function () {
    var cssCodes = cssCodeEditor.editor.getValue();
    console.log(cssCodes);
    var dummy = gra._c("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', cssCodes);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    document.execCommand('copy');
    alert('You have copied CSS codes!');
};

// import nav button click event
cmdm.add('html-edit', {
    run: function importArea(editor, sender) {
        sender && sender.set('active', 0);
        var htmlViewer = htmlCodeEditor.editor;
        var cssViewer = cssCodeEditor.editor;
        var htmlBox = gra._c('div');
        htmlBox.className = 'html-wrapper';
        htmlBox.innerHTML = "<h4>HTML</h4>";
        var cssBox = gra._c('div');
        cssBox.className = 'css-wrapper';
        cssBox.innerHTML = "<h4>CSS</h4>";
        modal.setTitle('Edit Code');
        var headline = gra._c('div');
        headline.className = 'clear-head';
        var htmlWrap = gra._c('textarea');
        var cssWrap = gra._c('textarea');
        htmlBox.appendChild(htmlWrap);
        cssBox.appendChild(cssWrap);
        if (!htmlViewer && !cssViewer) {
            gra._a(headline);
            gra._a(htmlBox);
            gra._a(cssBox);
            gra._a(copyCss);
            gra._a(copyHtml);
            gra._a(btnEdit);
            htmlCodeEditor.init(htmlWrap);
            cssCodeEditor.init(cssWrap);
        }
        modal.setContent('');
        modal.setContent(container);
        htmlCodeEditor.setContent(editor.getHtml());
        cssCodeEditor.setContent(editor.getCss({avoidProtected: true}));
        modal.open();
        htmlCodeEditor.editor.refresh();
        cssCodeEditor.editor.refresh();
    }
});

editor.BlockManager.getCategories().each(function (ctg) {
    ctg.set('open', false);
});
var domc = editor.DomComponents;
var defaultType = domc.getType('default');
// var defaultModel = defaultType.model;
var defaultView = defaultType.view;


//  editor.on('storage:load', function (e) {
//      console.log('LOAD ', e);
//  })
//  editor.on('storage:store', function (e) {
//      console.log('STORE ', e);
//  })

// var newButton = editor.Panels.addButton('myPanelID', {
//     id: 'create-comp',
//     className: 'fa fa-pencil-square-o',
//     command: 'create-comp',  // <-- the ID of the command
//     attributes: {title: 'Create element'},
//     stopDefaultCommand: 1,
// });


editor.on('styleManager:change:text-shadow', function (view) {
    var model = view.model;
    var targetValue = view.getTargetValue({
        ignoreDefault: 1
    });
    var computedValue = view.getComputedValue();
    var defaultValue = view.model.getDefaultValue();
    //console.log('Style of ', model.get('property'), 'Target: ', targetValue, 'Computed:', computedValue, 'Default:', defaultValue);
});
editor.Panels.removeButton('options', 'export-template');
editor.render();
