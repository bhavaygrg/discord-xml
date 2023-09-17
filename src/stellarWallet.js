// stellarWallet.js
const { Keypair, Network } = require('stellar-sdk');

// Set the Stellar network (e.g., 'testnet' for testing)
Network.useTestNetwork();

// Function to create a new Stellar key pair for a user
function createUserWallet() {
  const userKeyPair = Keypair.random();
  return userKeyPair;
}

// Function to associate a user wallet with a Discord user ID
function associateUserWallet(userWallets, userId) {
  if (!userWallets[userId]) {
    userWallets[userId] = createUserWallet();
  }
}

module.exports = {
  createUserWallet,
  associateUserWallet,
};
