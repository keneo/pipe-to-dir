const fs = require('fs');

const operation = require("./lib/operation");

var myArgs = process.argv.slice(2);

if (myArgs.length!==1) {
    console.error("please pass dir as argument");
    process.exit(-1);
}

const dir = myArgs[0];

fs.access(dir, fs.constants.W_OK, function(err) {
    if(err){
        console.error(`dir '${dir}' seems not writable`,err);
        process.exit(1);
    } else {
        operation.pipeStreamToDir(process.stdin, dir)
        //     .catch(e=>{
        //     console.error(e);
        //     process.exit(-5);
        // });
    }
});


