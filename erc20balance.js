// Minimal ERC-20 ABI — only the read functions we need
const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint256)"
];

// Public RPC fallback (no API key needed)
const PUBLIC_RPC = "https://cloudflare-eth.com";

function getProvider() {
    if (window.ethereum) {
        console.log("Wallet detected — using browser provider");
        return new ethers.BrowserProvider(window.ethereum);
    }
    console.log("No wallet detected — using public RPC");
    return new ethers.JsonRpcProvider(PUBLIC_RPC);
}

async function getBalance() {
    const output = document.getElementById("output");
    try {
        const address = document.getElementById("address").value;
        const provider = getProvider();
        const balance = await provider.getBalance(address);
        output.innerHTML = ethers.formatEther(balance) + " ETH";
    } catch (error) {
        output.innerHTML = error.message;
    }
}

async function getERC20Balance() {
    const output = document.getElementById("output2");
    try {
        const address = document.getElementById("address").value;
        const contractAddress = document.getElementById("contractAddress").value;
        const provider = getProvider();

        const token = new ethers.Contract(contractAddress, ERC20_ABI, provider);

        const [decimals, balance, name, symbol] = await Promise.all([
            token.decimals(),
            token.balanceOf(address),
            token.name(),
            token.symbol()
        ]);

        const adjustedBalance = ethers.formatUnits(balance, decimals);
        output.innerHTML = adjustedBalance + " " + symbol + " (" + name + ")";
    } catch (error) {
        output.innerHTML = error.message;
    }
}
