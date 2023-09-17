const { Client, GatewayIntentBits } = require('discord.js');
const SorobanClient = require('soroban-client'); // Import Soroban Client

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Placeholder for user balances (replace with your user wallet logic)
const userBalances = {};

// Placeholder for the shop's Stellar wallet address (replace with your shop's wallet)
const shopStellarAddress = 'GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW';

// Event handler for when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event handler for incoming messages
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (content === '!ping') {
    message.reply('Pong!');
  } else if (content.startsWith('!shop')) {
    // Display available shop items (sample data)
    const shopItems = [
      {
        name: 'Item 1',
        description: 'Description of Item 1',
        price: 10,
      },
      {
        name: 'Item 2',
        description: 'Description of Item 2',
        price: 20,
      },
      // Add more items as needed
    ];

    const shopMessage = shopItems.map((item, index) => {
      return `**${index + 1}. ${item.name}** - Price: ${item.price} coins\n${item.description}\n`;
    });

    message.channel.send(`**Welcome to the Shop!**\n\n${shopMessage.join('\n')}`);
  } else if (content.startsWith('!item')) {
    // Extract the item number from the command
    const args = content.split(' ');
    if (args.length === 2 && !isNaN(args[1])) {
      const itemNumber = parseInt(args[1]) - 1;

      // Check if the item number is valid
      if (itemNumber >= 0 && itemNumber < shopItems.length) {
        const selectedItem = shopItems[itemNumber];
        message.channel.send(`**${selectedItem.name}**\nPrice: ${selectedItem.price} coins\n${selectedItem.description}`);
      } else {
        message.channel.send('Invalid item number.');
      }
    } else {
      message.channel.send('Invalid command. Use !item [item_number] to view item details.');
    }
  } else if (content.startsWith('!buy')) {
    // Placeholder for item price (replace with your item pricing logic)
    const itemPrice = getItemPrice(content);

    if (itemPrice !== null) {
      const userId = message.author.id;

      // Check if the user has enough balance (replace with your user wallet logic)
      if (userBalances[userId] >= itemPrice) {
        // Placeholder for generating payment summary
        const paymentSummary = generatePaymentSummary(content, itemPrice);

        // Send payment summary to the user
        message.channel.send(paymentSummary);

        // Check if the user wants to proceed with the payment
        const filter = (response) => response.author.id === userId;
        const userResponse = await message.channel.awaitMessages({ filter, max: 1, time: 30000 });

        if (userResponse.size === 0 || userResponse.first().content.toLowerCase() !== 'confirm') {
          message.channel.send('Payment canceled.');
          return;
        }

        const userStellarAddress = 'USER_STELLAR_ADDRESS'; // Replace with the user's Stellar address
        const amountXLM = getItemPrice(content); // Replace with the actual item price

        try {
          // Create the payment transaction
          const transaction = await createPaymentTransaction(userStellarAddress, amountXLM);

          // Submit the transaction to Soroban
          const transactionResult = await sorobanServer.sendTransaction(transaction);

          // Handle the transaction result and notify the user of the successful payment
          if (transactionResult.isSuccess()) {
            message.channel.send('Payment successful! Your item will be delivered.');
          } else {
            message.channel.send('Payment failed. Please try again later.');
          }
        } catch (error) {
          // Handle any errors during the transaction process
          message.channel.send('Payment failed. Please try again later.');
          console.error(error);
        }
      } else {
        message.channel.send('Insufficient funds to make the purchase.');
      }
    } else {
      message.channel.send('Invalid item number.');
    }
  }
});

// Placeholder for getting item price based on item number
function getItemPrice(content) {
  // Replace with your item pricing logic
  // Example: parse item price from the command
  const args = content.split(' ');
  if (args.length === 2 && !isNaN(args[1])) {
    const itemNumber = parseInt(args[1]);
    if (itemNumber === 1) return 10;
    if (itemNumber === 2) return 20;
  }
  return null; // Item not found
}

// Placeholder for generating payment summary
function generatePaymentSummary(content, itemPrice) {
  // Replace with your payment summary generation logic
  // Example: return a formatted payment summary
  return `You are about to purchase Item ${content} for ${itemPrice} XLM. Reply with 'confirm' to proceed.`;
}

// Configure Soroban Server
const sorobanServer = new SorobanClient.Server('http://localhost:8000/soroban/rpc');

// Create Payment Transaction Function
async function createPaymentTransaction(userStellarAddress, amountXLM) {
  // Construct a transaction
  const transaction = new SorobanClient.TransactionBuilder(
    await sorobanServer.getAccount(shopStellarAddress),
    { fee: 100, networkPassphrase: SorobanClient.Networks.STANDALONE }
  )
    .addOperation(
      SorobanClient.Operation.payment({
        destination: userStellarAddress,
        asset: SorobanClient.Asset.native(),
        amount: amountXLM.toString(),
      })
    )
    .setTimeout(30)
    .build();

  // Sign the transaction
  transaction.sign(SorobanClient.Keypair.fromSecret('YOUR_SHOP_SECRET_KEY'));

  return transaction;
}

// Log in to Discord with your bot token
client.login('YOUR_BOT_TOKEN_HERE');
