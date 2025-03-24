const http = require('http');
const express = require('express');
const { Server: SocketServer } = require('socket.io');
const pty = require('node-pty');
const fs = require('fs/promises')
const path = require('path')
const app = express();
const server = http.createServer(app);
const cors = require('cors')
const chokidar = require('chokidar')

const ptyProcess = pty.spawn('bash', [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.INIT_CWD + '/user' ,
    env: process.env,
});

const io = new SocketServer({
    cors: '*',
});
app.use(cors())

io.attach(server);

chokidar.watch('./user').on('all', (event,path) => {
    io.emit('file:refresh', path)
}) 

ptyProcess.on('data', (data) => {
    io.emit('terminal:data', data);
});


io.on('connection', (socket) => {
    console.log('Client connected', socket.id); 

    socket.on('file:change',async ({path,content})=>{
        await fs.writeFile(`./user/${path}`, content)
        socket.broadcast.emit('file:change', {path,content})
    })

    socket.on('terminal:write', (data) => {
        ptyProcess.write(data);
    });

    socket.on('mouse:move', ({x,y,person}) => {
        socket.broadcast.emit('mouse:move', {x,y,person});
    });
});

app.get('/files', async (req,res) => {
    const filetree = await genFileTree('./user');
    return res.json({ tree:filetree });
})

app.get('/files/content', async (req,res)=>{
    const path = req.query.path;
    const content = await fs.readFile(`./user/${path}`, 'utf8');
    return res.json({ content })
})

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});

async function genFileTree(directory){
    const tree = {}
    async function buildTree(currdir,currtree){
        const files = await fs.readdir(currdir)
        for (const file of files){
            const filePath = path.join(currdir, file)
            const type = await fs.stat(filePath)
            if (type.isDirectory()){
                currtree[file] = {}
                await buildTree(filePath, currtree[file])
            }
            else{
                currtree[file]=null
            }
        }
    }

    await buildTree(directory, tree);
    return tree;
}