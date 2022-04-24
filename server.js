const http = require("http")
const { spawn } = require("process")
const SECRET = '123456';

function getSign(body) {
    return `sha1=${ crypto.creteHmac('sha1', SECRET).update(body).digest('hex') }`
}

const server = http.createServer((req, res) => {
    console.log(req.method, req.url)
    let buffers = []
    if(req.method === 'POST' && req.url === '/webhook') {
        req.on('data', buffer => {
            buffers.push(buffer)
        })
        req.on("end", buffer => {
            let body = Buffer.concat(buffers)
            let event = req.header['x-github-event']        // push
            let signature = req.header['x-hub-signature']   // 签名
            if(signature !== getSign(body)) {
                return res.end("Not Allowed!")   // 非法请求
            }

            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify({code: 0, msg: 'success'}))
    
            // 开始部署
            if(event === 'push') {
                let payload = JSON.parse(body);
                // 开启子进程
                let child = spawn('sh', [`./${ payload.repository.name }.sh`]);
                let buffers = [];
                child.stdout.on('data', buffer => {
                    buffers.push(buffer)
                })
                child.stdout.on('end', buffer => {
                    let log = Buffer.concat(buffers);
                    console.log(log);
                })
            }
        })

    }else{
        res.end("Not Found!")
    }
})

server.listen(4000, () => {
    console.log("webhook服务已经运行在4000端口")
})