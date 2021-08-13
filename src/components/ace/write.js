/* eslint-disable */
// 读写options.ts文件
const fs=require("fs")
const path=require("path")
let fileString=""
fs.readdir(path.resolve(__dirname,"ascii../../../../../node_modules/ace-builds/src-noconflict"),function(err,files){
    console.log(files);
    files.forEach(item=>{
        fileString+=importTemplate("ace-builds/src-noconflict/"+item)
    })
    console.log(fileString);
    fs.readdir(path.resolve(__dirname,"ascii../../../../../node_modules/ace-builds/src-noconflict/snippets"),function(err1,files1){
        console.log(files1);
        files1.forEach(item=>{
            fileString+=importTemplate("ace-builds/src-noconflict/snippets/"+item)
        })
        console.log(fileString);
        fs.writeFileSync(path.resolve(__dirname,"./options.ts"),fileString)
    })
})
function importTemplate(name){
    return `import "${name}"
    `
}