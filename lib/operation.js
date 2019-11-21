const fs = require('fs');

exports.pipeStreamToDir = pipeStreamToDir;

async function pipeStreamToDir(inputStream, dir, fileNamePrefix="archive") {
    const buildTimestamp = () =>(new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, -1);
    let currentTimestamp = buildTimestamp().slice(0,13);
    let currentWriteStream;
    function newpipe() {
        let path = dir + "/" + fileNamePrefix + "-" + currentTimestamp;
        //console.log(`Now writing to '${path}'`);
        if (currentWriteStream) {
            currentWriteStream.close();
        }
        currentWriteStream = fs.createWriteStream(path,{flags: "a"});
        //currentWriteStream.on("close",()=>console.log(`File '${path}' closed`));
        inputStream.pipe(currentWriteStream);
    }
    newpipe();
    const rotateJob = setInterval(()=>{
        //try {
            const proposalTImestamp = buildTimestamp().slice(0,13);
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
