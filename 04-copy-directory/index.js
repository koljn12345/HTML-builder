const fs = require('fs');
const path = require('path');
const url = path.join(__dirname,'files');
const urlCopy = path.join(__dirname,'files-copy');

fs.promises.mkdir(urlCopy, { recursive: true }, ()=>{});
fs.promises.readdir(urlCopy).then((items)=> {
    if(items.length) {
        items.forEach(item=> {
            fs.unlink(path.join(urlCopy,item), ()=>{})
        })
    }    
}).then (()=>{
    fs.readdir(url, (err, items)=> {
        items.forEach(item=> {
            fs.copyFile(path.join(url,item), path.join(urlCopy, item), ()=>{})
        })
    })
})