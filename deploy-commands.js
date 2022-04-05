const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./settings.json');

const commands = [
   new SlashCommandBuilder()
        .setName('watch')
        .setDescription('Add fa2 token to watch list')
        .addStringOption(option => option.setName('tokenname').setDescription('The name of the token').setRequired(true))
        .addStringOption(option => option.setName('tokenfa2').setDescription('The fa2 contract address of the token').setRequired(true)),
    new SlashCommandBuilder()
        .setName('watchlist')
        .setDescription('list all watched fa2 token in this channel '),
    new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop watching floor price of fa2 token')
        .addStringOption(option => option.setName('tokenname').setDescription('The name of the token').setRequired(true))]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);