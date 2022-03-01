require('dotenv').config()
const app = require('express')()
const Web3 = require('web3')

const rinkeby = `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
const web3 = new Web3(new Web3.providers.HttpProvider(rinkeby))

const ERC721_ABI = require('./abi/ERC721.json')
const ERC1155_ABI = require('./abi/ERC1155.json')

app.get('/api',(req,res) => {
    res.setHeader('Content-Type','application/json')
    res.statusCode = 200
    res.end(JSON.stringify({status: 'healthy'}))
})

app.get('/api/recover',async (req,res) => {
    res.setHeader('Content-Type','application/json')
    try {
        var message = req.query.message
        var signature = req.query.signature
        
        var recovered = await web3.eth.accounts.recover(message,signature)
        
        res.end(JSON.stringify({address: recovered}))
    } catch (e) {
        res.statusCode = 400
        res.end(JSON.stringify({error: e.message}))
    }
    
})

app.get('/api/erc721/balanceof', async (req,res) => {
    res.setHeader('Content-Type','application/json')
    try {
        var contractAddress = req.query.contractAddress
        var accountAddress = req.query.accountAddress

        if(!contractAddress || !accountAddress) {
            res.statusCode = 400
            res.end(JSON.stringify({error: "required parameters - contractAddress AND accountAddress"}))
            return
        }

        var contract = new web3.eth.Contract(ERC721_ABI,contractAddress)

        var accountBalance = await contract.methods.balanceOf(accountAddress).call()
        var tokenName = await contract.methods.name().call()

        res.end(JSON.stringify({name: tokenName, balance: accountBalance}))

    }catch(e) {
        res.statusCode = 400
        res.end(JSON.stringify({error: e.message}))
    }
})

module.exports = app;