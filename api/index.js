const app = require('express')()

app.get('/api',(req,res) => {
    res.setHeader('Content-Type','application/json')
    res.statusCode = 200
    res.end(JSON.stringify({status: 'healthy'}))
})

module.exports = app;