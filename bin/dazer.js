var cli = require('commander');

cli
    .version('0.0.1');

cli
    .command('*')
    .action(function(env){
    console.log('Enter a Valid command');
});

cli.parse(process.argv);