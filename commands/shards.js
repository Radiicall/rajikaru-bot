const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shards')
		.setDescription('Shows Shards!'),
	async execute(interaction) {
		// Reply with pong
		const shards = await interaction.client.shard.fetchClientValues('guilds.cache.size');
        let string = '';
        for (let i = 1; i <= shards.length; i++) {
            string += `Shard ${i} has ${shards[i - 1]} guilds.\n`;
        }
        return interaction.reply({ content: string, ephemeral: true });
	},
};
