const electron = require('electron');
const url = require('url');
const path = require('path');

//app and browserWindow opject from electron
const {app, BrowserWindow, Menu, ipcMain} = electron;

//create variable to represent main window and submenu
let mainWindow;

//
let addWindow;

// set env
//process.env.NODE_ENV = 'production';

// app to ready
app.on('ready', function(){
    // create new window
    mainWindow = new BrowserWindow({});

    // load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:"file:",
        slashes: true
    }));// what is does is:
        // win.loadURL(`file://${__dirname}/app/index.html`)
    
    //quit app when clicked on the close button
    mainWindow.on('closed', function(){
        app.quit();
    });
    
    //build menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // create menu template inside window
    Menu.setApplicationMenu(mainMenu);




});

// Handle create add window
function createAddWindow(){
    // create new window
    addWindow = new BrowserWindow({
        width: 300, height:200,
        title: 'Add'
    });
    addWindow.loadURL(url.format ({
        pathname: path.join(__dirname,'addWindow.html'),
        protocol: 'file',
        slashes: true
    }))

    //garbage collection handle, 
    addWindow.on('close', function(){
        addWindow: null;
    });


}

// catch item: add
ipcMain.on('item:add', function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    
});

// create menu template

const mainMenuTemplate = [
    {
    label: 'file',
    submenu: [
        {
            label: 'Add',
            accelerator: process.platform == 'darwin' ? 'Command + S':
            'Ctrl+S',
            click(){
                createAddWindow();
            }
        },   
        {
            label: 'Clear All',
            accelerator: process.platform == 'darwin' ? 'Command + C':
            'Ctrl+C',
            click(){
                mainWindow.webContents.send('item:clear')
            }
        },
        {
            label: 'Exit',
            //what is does is, if this run on mac, then use command 
            //: = else, then use Ctrl
            accelerator: process.platform == 'darwin' ? 'Command + E':
            'Ctrl+E',
            click(){
                app.quit();
            }
        }
    ]

}];

// if on mac, it wil show electron insteed of file,what you dont want
// and delete the empty space at the beginning
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}


// Add developer tools item 
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Devtools',

                accelerator: process.platform == 'darwin' ? 'Command+D':
                'Ctrl+D',

                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                },

               
            },
            {
                role: 'reload'
            }
        ]
    }
    )}