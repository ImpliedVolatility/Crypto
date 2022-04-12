const solc = require("solc")
const fs = require("fs")
const ganache =require("ganache")
const Web3 = require("web3")
const web3 = new Web3("Infura Endpoint")
const mevaccount = ""

let filecontent = fs.readFileSync("liqsniper.sol").toString()

var compilerinput = {
    language: "Solidity",
    sources: {
        "liqsniper.sol":{
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
ABI = output.contracts["liqsniper.sol"]["liqsniper"].abi 
bytecode = output.contracts["liqsniper.sol"]["liqsniper"].evm.bytecode.object
contract = new localweb3.eth.Contracts(ABI)

// incorporate flashbots rpc endpoint
function testtx(pendingtx, localweb3, defaultaccount){
    let flag = false
    contract.deploy({data:bytecode}).send({
        from: defaultaccount,
        gas: 500000
    }).then((contract) => {
        contract.methods.callgetpair().call((err, pairs1) => {
            localweb3.eth.sendTransaction({
                from: pendingtx.from,
                to: pendingtx.to,
                gas: pendingtx.gas,
                data: pendingtx.input,
                value: pendingtx.value
            }).then(() => { 
                contract.methods.callgetpair().call((err, pairs2) => {
                    if (pairs2 - pairs1 == 1) {
                        flag = true
                    }
                    return flag
                })
                    
                })
            })
        })
    }

    // await localweb3.eth.sendTransaction({
    //     from: mevaccount,
    //     to: pendingtx.to,
    //     gasPrice: pendingtx.gasPrice + 1,

    // }).on("PairCreated", flag = true) // Ganache logs? Potential asynchronosity bugs


function sendtx(pendingtx) {
    // fb bundle 
}

web3.eth.subscribe("pendingtransactions").on("data", pendingtxhash => {
    web3.eth.getTransaction(pendingtxhash).then(pendingtx => {
        if (pendingtx.from != mevaccount) {
            // uniswap v2 addliquidityeth
            let functionidentifier = ((pendingtx.input).toString()).substring(0,8)
            if (functionidentifier == "f305d719" && pendingtx.to == "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D") {
                let localweb3 = new Web3(ganache.provider(
                    { fork: web3.currentProvider }
                ))
                localweb3.eth.getAccounts().then(accounts => {
                    let defaultaccount = accounts[0]
                    if(testtx(pendingtx, localweb3, defaultaccount)) {
                        // send both txs to fb
                        // optimize gas pricing function
                        sendtx(pendingtx)
                    }
                })
            }
        }
    })
})

// No local harfork at all? Basic view function => if the eth token address is a thing -- WETH?
// contract = new localweb3.eth.Contract(ABI, address) 
// contract.methods.getpair(token address, weth address[0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2]).call((err, data) => { if (data == address(0) { return true } else {contract.methods.getpair(eth address, token address).call((err, data2) => { if (data2 == address(0) { return true } else { break}) })}) })

// Math
// How much can you buy so as to not get dumped on by the minted tokens or arbed down by possible parallel listings?
