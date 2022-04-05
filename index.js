const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
const settings = require('./settings.json');
const axios = require('axios');
const { watch } = require('fs');

const akaSwapFA2 = 'KT1AFq5XorPduoYyWxs5gEyrFK6fVjJVbtCj'
const TezDozenFA2 = 'KT1Xphnv7A1sUgRwZsecmAGFWm7WNxJz76ax'
const TezDozenGuardianFA2 = 'KT1ShjqosdcqJBhaabPvkCwoXtS1R2dEbx4W'
const ASMeiRFA2 = 'KT1VTBuWpY5f4sEdCHVWRSn99yUS5HqVWVk2'
const HicetnuncFA2 = 'KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton'
var watchList = []

sendSalesInfo = (id, name, fa2, price, seller, market, channelId) => {
    console.log(`${name} #${id} sell at for ${price / 1000000}xtz on ${market}!`)

    var type = null
    switch (fa2) {
        case akaSwapFA2:
            type = 'akaobj'
            break;
        case TezDozenFA2:
            type = 'tezdozen'
            break;
        case ASMeiRFA2:
            type = 'asmeir'
            break;
        case TezDozenGuardianFA2:
            type = 'td-guardian'
            break;
        case HicetnuncFA2:
            type = 'hicetnunc'
            break;
        default:
            break;
    }


    // send message
    var fields, url
    if (market == 'objkt') {
        url = `https://objkt.com/asset/${fa2}/${id},`
        fields = [
            { name: 'Seller', value: `[${seller.substring(0, 5)}...${seller.substring(seller.length - 5, seller.length)}](https://objkt.com/profile/${seller}/activity)` },
            { name: 'On Sale for', value: `${price / 1000000} xtz`, inline: true },
            { name: 'View ↗', value: `[objkt.com](https://objkt.com/asset/${fa2}/${id})`, inline: true },
        ]
    } else {
        url = `https://akaswap.com/${type}/${id}`,
            fields = [
                { name: 'Seller', value: `[${seller.substring(0, 5)}...${seller.substring(seller.length - 5, seller.length)}](https://akaswap.com/tz/${seller})` },
                { name: 'on Sale for', value: `${price / 1000000} xtz`, inline: true },
                { name: 'View ↗', value: `[akaSwap.com](https://akaswap.com/${type}/${id})`, inline: true },
            ]
    }
    
    const embed = {
        embeds: [{
            color: 0x36cb9f,
            title: `${name} #${id}`,
            url: url,
            author: {
                name: 'Floor Price Updated'
            },
            fields: fields
        }]
    };
    client.channels.cache.get(channelId).send(embed);
}

getFloorPrice = ({name, fa2, channel, floorPrice}, index) => {
    var newFloorPrice = floorPrice
    var market
    var id
    var seller

    var OBJKTurl = `${settings.tzktapi}bigmaps/5909/keys?value.fa2=${fa2}&active=true&limit=9999&select=value`
    var akaSwapurl = `${settings.tzktapi}bigmaps/55662/keys?value.token_fa2=${fa2}&active=true&limit=9999&select=value`

    axios.get(OBJKTurl)
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function (response) {
            if (response && response.data && response.data[0]) {
                response.data.forEach(ask => {
                    price = parseInt(ask.xtz_per_objkt)
                    if (!newFloorPrice || price < newFloorPrice) {
                        console.log(OBJKTurl)
                        newFloorPrice = price
                        id = ask.objkt_id
                        seller = ask.issuer
                        market = 'objkt'
                    }
                });
            }
            axios.get(akaSwapurl)
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function (response) {
                    if (response != undefined) {
                        response.data.forEach(swap => {
                            price = parseInt(swap.xtz_per_token)
                            if (!newFloorPrice || price < newFloorPrice) {
                                console.log(akaSwapurl)
                                newFloorPrice = price
                                id = swap.token_id
                                seller = swap.issuer
                                market = 'akaswap'
                            }
                        });
                    }

                    // send message
                    if (newFloorPrice !== floorPrice)
                        sendSalesInfo(id, name, fa2, newFloorPrice, seller, market, channel)

                    watchList[index].floorPrice = newFloorPrice
                })
        })
}

fetchAll = () => {
    watchList.forEach((watch, i) => {
        getFloorPrice(watch, i)
    })
}

client.on('ready', () => {
    console.log(`${client.user.tag} is ready`);
    client.once('ready', () => {
        console.log('Ready!');
    });

    fetchAll()
    setInterval(fetchAll, 60000)
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    var channel = interaction.channelId
    if (commandName === 'watch') {
        var name = interaction.options.getString('tokenname')
        var fa2 = interaction.options.getString('tokenfa2')
        newWatch = {
            name: name,
            fa2: fa2,
            channel: channel,
            floorPrice: null
        }
        watchList.push(newWatch)
        console.log(watchList)
        await interaction.reply(`This channel will get updates of ${name} floor price!`);
    } else if (commandName === 'stop') {
        var name = interaction.options.getString('tokenname')
        var found = false
        watchList.forEach((watch, i) => {
            if (name == watch.name && channel == watch.channel){
                watchList.splice(i, 1)
                console.log(watchList)
                found = true
            }
        })
        await interaction.reply(found?`Stop watching ${name} from this channel`: `${name} not found in watch list`);

    } else if (commandName === 'watchlist') {
        var message = ''
        watchList.forEach((watch) => {
            if (watch.channel == channel)
                message += `${watch.name}\n`
        })
        console.log('list:'+message)
        await interaction.reply('Watchlist:\n' + message);
    }
});
client.login(settings.token);