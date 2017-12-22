var cron = require('node-cron');
 
cron.schedule('*/15 * * * *', function(){
    const { fork } = require('child_process');
    const forked = fork('client.js');

    console.log('done')
    });