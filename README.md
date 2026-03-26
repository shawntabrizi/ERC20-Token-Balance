# ERC-20 Token Balance

Query the ERC-20 token balance of any Ethereum address — a simple "Hello World" for interacting with smart contracts.

**Try it out: [shawntabrizi.com/ERC20-Token-Balance](https://shawntabrizi.com/ERC20-Token-Balance/)**

## How It Works

1. Enter an Ethereum address to get its ETH balance
2. Enter an ERC-20 token contract address to get the token balance, name, and symbol

Uses [ethers.js](https://docs.ethers.org/) to query the Ethereum blockchain. Connects to your browser wallet (MetaMask, etc.) if available, otherwise falls back to a free public RPC endpoint.

## Example Token Contracts

| Token | Contract Address |
|-------|-----------------|
| USDC  | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| USDT  | `0xdAC17F958D2ee523a2206206994597C13D831ec7` |
| DAI   | `0x6B175474E89094C44Da98b954EedeAC495271d0F` |

## Related Projects

- [ETH Balance](https://github.com/shawntabrizi/ethbalance) — Get the ETH balance of an address
- [ETH Transaction Graph](https://github.com/shawntabrizi/ETH-Transaction-Graph) — Visualize Ethereum transactions in real time

## License

[MIT](LICENSE)
