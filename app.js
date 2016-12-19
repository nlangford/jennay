var fs = require('fs');
var rl = require('readline').createInterface(
    process.stdin, process.stdout
    ),
    prompts = ['1. New application\n2. New View\n3. New Service\n4. New ', 'App/View name: ', 'App/View description: '],
    p = 0,
    data = {};

var root = 'app\\';

var structure;

var runScript = true;


var get = function() {
    rl.setPrompt(prompts[p] + '> ');
    rl.prompt();

    p++
};

init();

function init(){
    console.log('*******************************************************\n******██╗███████╗███╗***██╗███╗***██╗*█████╗*██╗***██╗*\n******██║██╔════╝████╗**██║████╗**██║██╔══██╗╚██╗*██╔╝*\n******██║█████╗**██╔██╗*██║██╔██╗*██║███████║*╚████╔╝**\n*██***██║██╔══╝**██║╚██╗██║██║╚██╗██║██╔══██║**╚██╔╝***\n*╚█████╔╝███████╗██║*╚████║██║*╚████║██║**██║***██║****\n**╚════╝*╚══════╝╚═╝**╚═══╝╚═╝**╚═══╝╚═╝**╚═╝***╚═╝****\n*******************************************************');
    console.log('Welcome to Jennay, an AngularJS application generator.\n\nPlease answer the following questions:\n');
    get();
}

rl.on('line', function(line) {
    data[prompts[p - 1]] = line;

    if(isNaN(data[prompts[0]])){
        console.log('Expected a number, got "' + data[prompts[p - 1]] + '". Restart and try again.');
        runScript = false;
        process.exit(0);
    }

    if(p === prompts.length) {
        return rl.close();
    }

    get();

}).on('close', function() {
    if(runScript){
        //require('fs').writeFileSync('info.json', JSON.stringify(data));
        console.log('Settings saved, run Jennay, run.');
        if(data[prompts[0]] == 1){
            removeRoot();
            readStruct(data);;
            generateApp();
        }
    } else{
        readStruct();
        generateApp();
    }
});

function removeRoot(){
    console.log('Removing existing "app" folder structure.');
    if (fs.existsSync(root)) {
        deleteFolderRecursive(root);
        function deleteFolderRecursive(path) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }
}

function readStruct(){
    console.log(data);
    console.log('Reading application structure.');
    fs.readFile('./app-struct.json', function read(err, data) {
        if (err) {
            throw err;
        }

        var jsonString = JSON.parse(data);
        var struct = JSON.stringify(jsonString);

        //apply a name to the app
        if (data[prompts[1]]) {
            data[prompts[1]] = data[prompts[1]].replace('\'', '');
            struct = struct.replace(/@App/g, data[prompts[1]]);
        } else {
            struct = struct.replace(/@App/g, 'App');
        }

        //apply a description to the app
        if (data[prompts[2]]) {
            data[prompts[2]] = data[prompts[2]].replace('\'', '');
            struct = struct.replace(/@Description/g, data[prompts[2]]);
        } else {
            struct = struct.replace(/@Description/g, '');
        }

        structure = JSON.parse(struct);
    });
}

function generateApp() {
    console.log('Generating application structure!');
    if (!fs.existsSync(__dirname + '\\app')) {
        fs.mkdirSync(__dirname + '\\app');
    }

    for (var file in structure) {
        if (structure.hasOwnProperty(file)) {

            if (file.split('\\').length > 1) {
                var folder = file.split('\\');
                var path = folder;
                path.pop();
                var currentFile = folder[folder.length - 1];

                var folderStructure = '';

                for (var i = 0; i < path.length; i++) {

                    folderStructure += path[i] + '\\';

                    if (!fs.existsSync(root + folderStructure)) {
                        fs.mkdirSync(root + folderStructure);
                    }

                    if (i === path.length - 1) {
                        fs.writeFile(__dirname + '\\app\\' + file, structure[file], function (err) {
                            if (err) {
                                console.log('File exists - skipping');
                            }
                        });
                    }
                }
            } else if (file.split('\\').length = 1) {
                fs.writeFile(__dirname + '\\app\\' + file, structure[file], function (err) {
                    if (err) {
                        console.log('File exists - skipping');
                    }
                });
            }
        }
    }
}