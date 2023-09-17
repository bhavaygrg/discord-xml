// shopWallet.js
const { Keypair, Network } = require('stellar-sdk');

// Set the Stellar network (e.g., 'testnet' for testing)
Network.useTestNetwork();

// Create a new Stellar key pair for your shop
const shopKeyPair = Keypair.random();

// Log the shop's public key (used to receive payments)
console.log('Shop Public Key:', shopKeyPair.publicKey());

// Export the shop's public key
module.exports = {
  shopPublicKey: shopKeyPair.publicKey(),
};
