require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("dotenv").config();

const PROVIDER_URL = "https://eth-mainnet.g.alchemy.com/v2/BJeo4E_uUCYhVbrechZUi_BKozl_SoXa";
const PRIVATE_KEY = "e4e6486dfa36baefc0c4f9abf771e66950a1ea44c253d6cc10d9db1a6bca76ce";

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: PROVIDER_URL, // Ensure this is the URL for Sepolia, e.g., https://sepolia.infura.io/v3/YOUR_PROJECT_ID
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
