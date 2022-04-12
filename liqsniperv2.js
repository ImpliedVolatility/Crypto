const Web3 = require("web3")
const web3 = new Web3("infura eendpoint url")
const mevaccount = ""
ABI = ""
uniswapfactory = new web3.eth.Contracts(ABN)
const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"

function sendtx(pendingtx, token) {
    // fb bundle
}

web3.eth.subscribe("pendingTransactions").on("data", (pendingtxhash) => {
    web3.eth.getTransaction(pendingtxhash).then((pendingtx) => {
        if (pendingtx.from != mevaccount) {
            let functionidentifier = ((pendingtx.input).toString()).substring(0,8)
            if (functionidentifier == "f305d719" && pendingtx.to == "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D") {
                let token = ""
                uniswapfactory.methods.getPair(token, weth).call().then((address) => {
                    if (address == address(0)){
                        sendtx(pendingtx, token)
                    }
                })
            }
        }
    })
})

// s/w attacks on new listings
