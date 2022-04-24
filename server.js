const http = require("http")
const crypto = require("crypto")
const { spawn } = require("child_process")
const sendMail = require("./sendMail")
const SECRET = '123456';

function getSign(body) {
    return `sha1=${ crypto.createHmac('sha1', SECRET).update(body).digest('hex') }`
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
            let event = req.headers['x-github-event']        // push
            let signature = req.headers['x-hub-signature']   // 签名
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
                    sendMail(`
                        <p>部署日期：${ new Date() }</p>
                        <p>部署人：${ payload.pusher.name }</p>
                        <p>部署邮箱：${ payload.pusher.email }</p>
                        <p>提交信息：${ payload.head_commit && payload.head_commit['message'] }</p>
                        <p>部署日志：${ log.toString().replace("\r\n", '<br/>') }</p>
                    `)
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