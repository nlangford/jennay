var rl = require('readline').createInterface(
    process.stdin, process.stdout
    ),
    prompts = ['1. New application\n2. New View\n3. New Service\n4. New ', 'App/View name'],
    p = 0,
    data = {};

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

    if(data[prompts[0]])

    if(p === prompts.length) {
        return rl.close();
    }

    get();

}).on('close', function() {
    if(runScript){
        require('fs').writeFileSync('info.json', JSON.stringify(data));
        console.log('Settings saved, run Jennay, run.');
    }
});