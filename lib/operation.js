const fs = require('fs');

exports.pipeStreamToDir = pipeStreamToDir;

async function pipeStreamToDir(inputStream, dir) {
    const buildTimestamp = () =>new Date().toISOString().slice(0,13);
    let currentTimestamp = buildTimestamp();
    let currentWriteStream;
    function newpipe() {
        let path = dir + "/" + "archive-" + currentTimestamp;
        //console.log(`Now writing to '${path}'`);
        currentWriteStream = fs.createWriteStream(path,{flags: "a"});
        //currentWriteStream.on("close",()=>console.log(`File '${path}' closed`));
        inputStream.pipe(currentWriteStream);
    }
    newpipe();
    const rotateJob = setInterval(()=>{
        //try {
            const proposalTImestamp = buildTimestamp();
            if (proposalTImestamp!==currentTimestamp) {
                inputStream.unpipe(currentWriteStream);
                //currentWriteStream.end();
                currentTimestamp = proposalTImestamp;
                newpipe();
            }
        //}
        // catch(e) {
        //     console.error(e);
        //     process.exit(-2);
        // }
    },1000);
    inputStream.on("end",()=>clearInterval(rotateJob));
}



if (require.main === module) {
    let path = require('os').homedir()+"\\tmp\\testdata_20s.jsonl";
    console.log(path);
    pipeStreamToDir(fs.createReadStream(path),"../var").catch(console.error);
}
