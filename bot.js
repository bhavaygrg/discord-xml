//his step involves building the functionality to enable users to make payments using Stellar Lumens (XLM) within your Discord shop.


const { Client, GatewayIntentBits } = require('discord.js');

// Create a new Discord bot instance
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Event handler for when the bot is ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event handler for incoming messages
client.on('messageCreate', (message) => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  }
});
client.on('messageCreate', (message) => {
  // Check if the message is from a user and starts with the !shop command
  if (message.author.bot || !message.content.startsWith('!shop')) {
    return;
  }

  // Define your shop items (sample data)
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

  // Display the shop items
  const shopMessage = shopItems.map((item, index) => {
    return `**${index + 1}. ${item.name}** - Price: ${item.price} coins\n${item.description}\n`;
  });

  message.channel.send(`**Welcome to the Shop!**\n\n${shopMessage.join('\n')}`);
});
client.on('messageCreate', (message) => {
  // Check if the message is from a user and starts with a valid command
  if (message.author.bot) {
    return;
  }

  const content = message.content.toLowerCase();

  if (content.startsWith('!shop')) {
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
  }
});


// Log in to Discord with your bot token
client.login('YOUR_BOT_TOKEN_HERE');
