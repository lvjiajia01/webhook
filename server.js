const http = require("http")
const server = http.createServer((req, res) => {
    console.log(req.method, req.url)
    if(req.method === 'POST' && req.url === '/webhook') {
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify({code: 0, msg: 'success'}))
    }else{
        res.end("Not Found!")
    }
})

server.listen(4000, () => {
    console.log("webhook服务已经运行在4000端口")
})