var fs = require('fs');
var root = 'app\\';

var structure;

fs.readFile('./page-struct.json', function read(err, data) {
    if (err) {
        throw err;
    }

    var jsonString = JSON.parse(data);
    var struct = JSON.stringify(jsonString);

    //apply a name to the app
    if(process.argv[2]){
        process.argv[2] = process.argv[2].replace('\'','');
        struct = struct.replace(/@Name/g, process.argv[2]);
    } else {
        struct = struct.replace(/@Name/g, 'NewView');
    }

    structure = JSON.parse(struct);
    generateApp();
});

function generateApp() {
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