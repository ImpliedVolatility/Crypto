const Web3 = require("web3")
const ganache = require("ganache")
const solc = require("solc")
const fs = require("fs")
const web3 = new Web3(ganache.provider())

let filecontent = fs.readFileSync("events.sol").toString()

var compilerinput = {
    language: "Solidity",
    sources: {
        "events.sol":{
            content: filecontent
        },
    },

    settings: {
        outputSelection:{
            "*":{
                "*":["*"]
            },
        },
    },
}

var output = JSON.parse(solc.compile(JSON.stringify(compilerinput)))
ABI = output.contracts["events.sol"]["Events"].abi 
bytecode = output.contracts["events.sol"]["Events"].evm.bytecode.object

contract = new web3.eth.Contract(ABI)
web3.eth.getAccounts().then(accounts => {
    let defaultaccount = accounts[0]
    contract.options.address = defaultaccount
    contract.once("PairCreated", (result) => {
        console.log(result)
    })
    contract.deploy({data: bytecode})
    .send({from: defaultaccount, gas: 5000000})
    .on("receipt", (receipt) => {
        console.log("deployed at ", receipt.events["PairCreated"].returnValues.token1)
    }).then((contract) => {
        contract.methods.callEvent().send({
            from: defaultaccount,
            gas: 500000
        }).on("receipt", receipt => {
            console.log("Tx receipt ", receipt.events["PairCreated"].returnValues.token1)
        })
    })

})

