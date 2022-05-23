const fs = require('fs')
const path = require('path')
const { stdin, stdout } = require('process');
const url = path.join(__dirname,'secret-folder');
const files=  fs.readdir(url, (err, items)=> {
    items.forEach(item=> {
        fs.stat(path.join(url, item), (err,stats)=> {
            if(stats.isFile()) {
                const res=[];
                res.push(path.basename(item, path.extname(item)))
                res.push(path.extname(item))
                res.push((stats.size/1024).toFixed(2)+'kb')
                console.log(res.join(' - '))
            }            
        })
    })
   
});
