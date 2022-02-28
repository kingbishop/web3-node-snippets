require('dotenv').config()
const app = require('express')()
const Web3 = require('web3')

const infura = `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
const web3 = new Web3(new Web3.providers.HttpProvider(infura))

app.get('/api',(req,res) => {
    res.setHeader('Content-Type','application/json')
    res.statusCode = 200
    res.end(JSON.stringify({status: 'healthy'}))
})

app.get('/api/recover',async (req,res) => {
    try {
        var message = req.query.message
        var signature = req.query.signature
        var recovered = await web3.eth.accounts.recover(message,signature)
        res.setHeader('Content-Type','application/json')
        res.end(JSON.stringify({address: recovered}))
    } catch (e) {
        res.statusCode = 400
        res.end(JSON.stringify({error: e.message}))
    }
    
})

module.exports = app;