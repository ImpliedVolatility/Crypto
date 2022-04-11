const Web3 = require("web3")
const ganache = require("ganache")

let web3 = new Web3("infura endpoint url")
let mevaccount = ""
// let senttxs = [array of sent tx objects]
// let senttxcalls = [array of sent tx calls]
// mapping of calldata to nonce

function copyTransaction(tx) {
    web3.eth.getTransactionCount().then((nonce) => {
        web3.eth.sendTransaction(
            {
                from: mevaccount,
                to: tx.to,
                gasPrice: tx.gasPrice + 1,
                nonce: nonce,
                input: tx.input
            }
        )
        // .then(() => {
        //     senttxs.push(tx)
        //     update mapping
        //     senttxcalls.push(tx.input)
        // }).on("receipt", () => {
        //     senttxs.pop(tx.input)
        // })
    })
    
}

web3.eth.subscribe("penidngTransactions").on("data", pendingtxhash => {
    web3.eth.getTransaction(pendingtxhash).then((pendingtx => {
        
        if (pendingtx.from != mevaccount){

            // if (pendingtx.input is in senttxcalls[]){
            //     web3.eth.sendTransaction({
            //         from: mevaccount,
            //         to: pendingtx.to,
            //         gasPrice: pendingtx.gasPrice + 1,
            //         nonce: call mapping
            //     })
            // }
            // else {
            //      all of the code below
            // }

            const localweb3 = new Web3(ganache.provider({
                fork: web3.currentProvider
            }))
            localweb3.eth.getAccounts().then((accounts) => {
                defaultlocal = accounts[0]
                localweb3.eth.getBalance(defaultlocal).then((startbalance) => {
                    localweb3.eth.getTransactionCount(defaultlocal).then(localnonce => {
                        localweb3.eth.sendTransaction(
                            {
                                from: defaultlocal,
                                to: pendingtx.to,
                                gasPrice: pendingtx.gasPrice + 1,
                                nonce: localnonce,
                                input: pendingtx.input
                            }
                        )
                        .then(() => {
                            localweb3.eth.getBalance(defaultlocal)
                            .then((endbalance) => {
                                if (endbalance > startbalance){
                                    copyTransaction(pendingtx)
                                }
                            })
                        })
                    })
                })
                
            })
        }
    }))
})
