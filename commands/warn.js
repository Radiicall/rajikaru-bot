const { SlashCommandBuilder } = require('@discordjs/builders');
const { userTables, userTableCreate } = require('../functions');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warns the pinged member')
        .addUserOption(option => option.setName('member').setDescription('User to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(true)),
	async execute(interaction) {
		await interaction.reply('Pong!');
        const member = interaction.options.getUser('member');
        const reason = interaction.options.getString('reason');
        const tableName = `${interaction.guild.id}-${member.id}`;
        let usertable = await userTables.findOne({ where: { name: tableName } });
        const infractions = usertable.get('infractions');

        if (!usertable) {
            usertable = userTableCreate(tableName, [reason], 1, 3);
            return interaction.reply(`${member.user} has been warned for "${reason}"`);
        } else if (infractions.length(usertable.get('maxinfractions'))) {
            await interaction.reply(`${member.user} has been banned for "Too many infractions."`);
            member.ban({ days: 0, reason: 'Too many infractions.' });
        } else {
            infractions.push(reason);
            interaction.reply(`${member.user} has been warned for "${reason}"`);
        }
	},
};
