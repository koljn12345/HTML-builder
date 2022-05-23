const fs = require('fs');
const path = require('path');

const url = path.join(__dirname, 'styles');
const urlBundle = path.join(__dirname, 'project-dist');
const streamWrite = new fs.WriteStream(path.join(urlBundle, 'bundle.css'))
fs.promises.readdir(url).then(items => {
    items.forEach(item=> {
        fs.promises.stat(path.join(url,item)).then(stats=> {
            if(stats.isFile() && path.extname(item)==='.css') {
                const streamRead= new fs.ReadStream(path.join(url, item));
                streamRead.on('readable', function(){
                    const data = streamRead.read();
                    if(data != null) streamWrite.write(data.toString()+'\n');
                });
            }
        })
    })
})