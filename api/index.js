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
        var message = web3.utils.utf8ToHex("Verify Asset")
        // var signature = req.query.signature
        // var recovered = await web3.eth.personal.ecRecover(message,signature)
        // res.setHeader('Content-Type','application/json')
        // res.statusCode = 200
        res.end(JSON.stringify({address: message}))
    } catch (error) {
        res.end(error)
    }
    
})

module.exports = app;