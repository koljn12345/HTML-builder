const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');

const streamWrite = new fs.WriteStream(path.join(__dirname, 'text.txt'))
stdout.write('Hi, write something! \n')
process.on('SIGINT', () => process.exit());
stdin.on('data', (data)=> {
  if(data.toString().trim()==='exit') process.exit();
  streamWrite.write(data.toString());
})
process.on('SIGINT', () => process.exit());
process.on('exit', ()=> stdout.write('Bye-Bye!'))

