const fs = require('fs');
const path = require('path');

const urlStyles = path.join(__dirname,'styles');
const urlDist = path.join(__dirname,'project-dist');
const urlComponents = path.join(__dirname, 'components');
let htmlFile='';

fs.promises.mkdir(urlDist, { recursive: true }, ()=>{});

const streamHtml = new fs.ReadStream(path.join(__dirname, 'template.html'));

streamHtml.on('readable', function(){
    const data = streamHtml.read();
    if(data != null) htmlFile +=data.toString();
});
streamHtml.on('end', function(){
    fs.promises.readdir(urlComponents).then(
        (items)=> {
                items.forEach(item=> {
                    const nameVar= path.basename(item,path.extname(item))
                    fs.promises.readFile(path.join(urlComponents, item)).then(text=> {
                        htmlFile=htmlFile.replace('{{'+nameVar+'}}', text.toString()); 
                        fs.promises.writeFile(path.join(urlDist, 'index.html'), htmlFile)                   
                    })
                })
        }
    )    
});

fs.promises.readdir(urlStyles).then(items => {
    const cssBundle= new fs.WriteStream(path.join(urlDist, 'style.css'));
    items.forEach(item=> {
        fs.promises.stat(path.join(urlStyles,item)).then(stats=> {
            if(stats.isFile() && path.extname(item)==='.css') {
                const streamRead= new fs.ReadStream(path.join(urlStyles, item));
                streamRead.on('readable', function(){
                    const data = streamRead.read();
                    if(data != null) cssBundle.write(data.toString()+'\n'); 
                });
            }
        })
    })
})
const urlAssets= path.join(__dirname,'assets')
const urlAssetsBundle= path.join(urlDist,'assets');


(async ()=> {
await fs.promises.rm(urlAssetsBundle, { recursive: true, force: true });
await customCopyFile(urlAssets);
})()

async function customCopyFile(dir) {
    let urlAssetsBundleF=  urlAssetsBundle
    if(path.basename(dir)!== 'assets') {
        urlAssetsBundleF= path.join(urlAssetsBundle, path.basename(dir)) 
        await fs.promises.mkdir(urlAssetsBundleF, { recursive: true });
    }
    const items = await fs.promises.readdir(dir);
    items.forEach(async (item)=> {
        const stats = await fs.promises.stat(path.join(dir,item))    
        if(stats.isDirectory()) await customCopyFile(path.join(dir,item))
        else await fs.promises.copyFile(path.join(dir,item), path.join(urlAssetsBundleF, item))
    })
}