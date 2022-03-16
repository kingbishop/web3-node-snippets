require('dotenv').config()
const app = require('express')()
const Web3 = require('web3')

const rinkeby = `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
const APIKEY = `${process.env.API_KEY}`
const web3 = new Web3(new Web3.providers.HttpProvider(rinkeby))

const ERC721_ABI = require('./abi/ERC721.json')
const ERC1155_ABI = require('./abi/ERC1155.json')


function response_error(res, message) {
    res.statusCode = 400
    res.end(JSON.stringify({error:message}))
}

function auth_check(req,res){
    var auth = req.query.auth
    if(!auth || auth != APIKEY){
        response_error(res,"Invalid or missing api key")
        return false
    }
    return true
}


app.use('/api',(req, res, next) => {
    if(!auth_check(req,res)){
        return
    }
    next()
})


app.get('/api',(req,res) => {
    res.setHeader('Content-Type','application/json')
    res.statusCode = 200
    res.end(JSON.stringify({status: 'healthy'}))
})


app.get('/api/account/transaction/count', async (req,res) => {
    res.setHeader('Content-Type','application/json')
    try {
        var address = req.query.address
        var count = await web3.eth.getTransactionCount(address)
        res.end(JSON.stringify({count: count}))
    }catch(e){
        response_error(res,e.message)
    }
})


app.get('/api/gas/price', async (req,res) => {
    res.setHeader('Content-Type','application/json')
    try {
        var gasPrice = await web3.eth.getGasPrice()
        res.end(JSON.stringify({gasPrice: gasPrice}))
    } catch (e) {
        response_error(res,e.message)
    }

})

app.get('/api/recover',async (req,res) => {
    res.setHeader('Content-Type','application/json')
    try {
        var message = req.query.message
        var signature = req.query.signature
        
        var recovered = await web3.eth.accounts.recover(message,signature)
        
        res.end(JSON.stringify({address: recovered}))
    } catch (e) {
        response_error(res,e.message)
    }
    
})

app.get('/api/erc721/balanceof', async (req,res) => {
    res.setHeader('Content-Type','application/json')
    try {
        var contractAddress = req.query.contractAddress
        var accountAddress = req.query.accountAddress

        if(!contractAddress || !accountAddress) {
            response_error(res,"required parameters - contractAddress AND accountAddress")
            return
        }

        var contract = new web3.eth.Contract(ERC721_ABI,contractAddress)

        var accountBalance = await contract.methods.balanceOf(accountAddress).call()
        var tokenName = await contract.methods.name().call()

        res.end(JSON.stringify({name: tokenName, balance: accountBalance}))

    }catch(e) {
        response_error(res,e.message)
    }
})

module.exports = app;