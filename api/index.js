const app = require('express')()

app.get('/api',(req,res) => {
    res.end("Hello World")
})

module.exports = app;