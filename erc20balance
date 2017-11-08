window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
    }
})

const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res);
            }
        })
    );

function getBalance() {
    var address, wei, balance
    address = document.getElementById("address").value
    try {
        web3.eth.getBalance(address, function (error, wei) {
            if (!error) {
                var balance = web3.fromWei(wei, 'ether');
                document.getElementById("output").innerHTML = balance + " ETH";
            }
        });
    } catch (err) {
        document.getElementById("output").innerHTML = err;
    }
}
function getERC20Balance() {
    var address, contractABI, contractAddress, balance, decimals, tokenName, tokenSymbol, adjustedBalance
    address = document.getElementById("address").value
    contractAddress = document.getElementById("contractAddress").value
    contractABI = human_standard_token_abi

    tokenContract = web3.eth.contract(contractABI).at(contractAddress)

    var dec = promisify(cb => tokenContract.decimals(cb))
    var bal = promisify(cb => tokenContract.balanceOf(address, cb))
    var tokName = promisify(cb => tokenContract.name(cb))
    var tokSym = promisify(cb => tokenContract.symbol(cb))

    Promise.all([dec, bal, tokName, tokSym]).then(function ([decimal, balance, tokenName, tokenSymbol]) {
        var adjustedBalance = balance / Math.pow(10, decimal)
        document.getElementById("output2").innerHTML = adjustedBalance + " " + tokenSymbol + " (" + tokenName + ")";
    })
}
