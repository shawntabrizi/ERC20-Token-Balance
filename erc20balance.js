var selectList = document.getElementById("tokenList")
var topTokens = null
var tokenList = []
var percentageList = []

window.addEventListener('load', function () {
    if (typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name)
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log('No Web3 Detected... using HTTP Provider')
        window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
    }

    getTopTokens()

    selectList.addEventListener("change", function () {
        document.getElementById("contractAddress").value = selectList.value
    })
})

const promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

async function getBalance(address) {
    var wei, balance
    wei = promisify(cb => web3.eth.getBalance(address, cb))
    balance = web3.fromWei(await wei, 'ether')
    return [balance, 'ETH', 'Ether']
}

async function displayBalance() {
    try {
        var address, balance
        address = document.getElementById("address").value;
        result = await getBalance(address)
        adjustedBalance = result[0]
        symbol = result[1]
        name = result[2]

        document.getElementById("output").innerHTML = adjustedBalance + " " + symbol + " (" + name + ")"; 
    } catch (error) {
        document.getElementById("output").innerHTML = error;
    }
}

async function getERC20Balance(address, contractAddress) {
    try {
        var contractABI, tokenContract, decimals, balance, name, symbol, adjustedBalance
        contractABI = human_standard_token_abi

        tokenContract = web3.eth.contract(contractABI).at(contractAddress)

        decimals = promisify(cb => tokenContract.decimals(cb))
        balance = promisify(cb => tokenContract.balanceOf(address, cb))
        name = promisify(cb => tokenContract.name(cb))
        symbol = promisify(cb => tokenContract.symbol(cb))

        adjustedBalance = await balance / Math.pow(10, await decimals)

        console.log(adjustedBalance, await symbol, await name)

        return [adjustedBalance, await symbol, await name]
    } catch (error) {
        console.log(error)
        return [-1,-1,-1]
    }
}

async function displayERC20Balance() {
    try {
        var address, contractAddress, result, adjustedBalance, symbol, name
        address = document.getElementById("address").value
        contractAddress = document.getElementById("contractAddress").value

        result = await getERC20Balance(address, contractAddress)
        adjustedBalance = result[0]
        symbol = result[1]
        name = result[2]
        document.getElementById("output2").innerHTML = adjustedBalance + " " + symbol + " (" + name + ")";
    } catch (error) {
        document.getElementById("output2").innerHTML = error
    }
}

async function getTopTokens() {
    try {
        var response = await fetch('https://cdn.rawgit.com/shawntabrizi/etherwallet/mercury/app/scripts/tokens/ethTokens.json')
        var data = await response.json()

        topTokens = data
        console.log(data)
        for (tok in data) {
            token = data[tok]
            
            let option = document.createElement("option")
            option.text = token.symbol
            option.value = token.address
            selectList.add(option)
        }
    } catch (error) {
        console.log(error)
    }
}

async function getAllBalances(address) {
    var tokenList = []

    var promises = topTokens.map(token => getERC20Balance(address, token.address))

    promises.push(getBalance(address))

    promises = promises.map(p => p.catch(e => e))

    await Promise.all(promises)

    for (prom in promises) {
        let result = await promises[prom]
        var adjustedBalance, symbol, name
        adjustedBalance = result[0]
        symbol = result[1]
        name = result[2]

        if (adjustedBalance > 0)
        {
            tokenList.push([adjustedBalance, symbol, name])
        }
    }

    return tokenList
}

async function displayAllBalances() {
    var address, prices
    address = document.getElementById("address").value
    tokenList = await getAllBalances(address)
    prices = await getPrice(tokenList)
    document.getElementById("output2").innerHTML = ""

    totalPrice = 0

    for (tok in tokenList) {
        result = tokenList[tok]
        adjustedBalance = result[0]
        symbol = result[1]
        name = result[2]
        try {
            price = prices[symbol]['USD']
        } catch (error) {
            console.log(error)
            price = 0
        }
        tokenList[tok].push(price)

        document.getElementById("output2").innerHTML += adjustedBalance + " " + symbol + " (" + name + ") @ $" + price + " [" + (price * adjustedBalance) + "]" + "<br>"

        totalPrice += adjustedBalance * price
    }

    document.getElementById("output2").innerHTML += "TOTAL PRICE: $" + totalPrice + "<br>"

    console.log(tokenList)

}

async function getPrice(tokenList) {

    loops = Math.ceil(tokenList.length / 50)

    var totalData

    for (loop = 0; loop < loops; loop++) {
        tokenSymbols = []
        for (i = loop * 50; (i < loop * 50 + 50) && (i < tokenList.length); i++) {
            token = tokenList[i]
            symbol = token[1]
            tokenSymbols.push(symbol)
        }
        tokenSymbolsString = tokenSymbols.join()
        
        var response = await fetch('https://min-api.cryptocompare.com/data/pricemulti?tsyms=USD&fsyms=' + tokenSymbolsString)
        var data = await response.json();

        console.log(data)
        totalData = Object.assign({},totalData,data)
        
    }

    console.log(totalData)
    return totalData
}

function tokenDistribution() {
    var totalPrice = 0

    for (tok in tokenList)
    {
        token = tokenList[tok]
        adjustedBalance = token[0]
        price = token[3]
        relativePrice = adjustedBalance * price

        totalPrice += relativePrice

        tokenList[tok].push(relativePrice)

    }

    for (tok in tokenList)
    {
        token = tokenList[tok]
        symbol = token[1]
        relativePrice = token[4]
        percentagePrice = relativePrice / totalPrice

        tokenList[tok].push(percentagePrice)

        percentageList.push([symbol, percentagePrice])
    }

    console.log(percentageList)
}