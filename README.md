# Tezos-floorprice-dcbot

## Features
- Support multiple channels.
- Support multiple fa2 tokens.
- Supported market: OBJKT (maketplace V2) and akaSwap (metaverse V2.1)
- Fetch every 1 min.
- Limit set to 9999.

## Commands and options
Use **slash command** to interact with the bot.
- `/watch` : Add fa2 token to watch list of the channel. When floor price changes, the bot will push a message in the channel.
    - `tokenname(string, required)` : A name to identify the token.
    - `tokenfa2(string, required)` : The fa2 contract address of the token.
- `/watchlist` : list all the fa2 tokens watch in the channel.
- `/stop` : stop watching specifed token.
    - `tokenname(string, required)`: The name of the token.

## Usage
1. Modify `exampleSettings.json` and rename to `settings.json`
    -  Generate a token in [Discord Developer Portals](https://discord.com/developers/applications), [read more >>](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
    - Client ID is the ID of your bot.
2. Add the bot to your server
## References:
- TZKT API Documentation
    [TzKT API - Tezos API Documentation](https://api.tzkt.io/#section/Introduction)

- Discord Developer Guide and Documentation:
    [Discord Developer Portal — Documentation — Intro](https://discord.com/developers/docs/intro)
    [Introduction | discord.js Guide](https://discordjs.guide/#before-you-begin)

