const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

const randomColor = () => {
    let color = '';
    for (let i = 0; i < 6; i++) {
       const random = Math.random();
       const bit = (random * 16) | 0;
       color += (bit).toString(16);
    }
    return color;
};

function objToString(object) {
    let str = '';
    for (const k in object) {
        // eslint-disable-next-line no-prototype-builtins
        if (object.hasOwnProperty(k)) {
            str += object[k];
        }
    }
    return str;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription("Hugs the pinged member.")
        .addUserOption(option => option.setName('member').setDescription('Select a user').setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('member');
		if (user != interaction.user) {
            const img = objToString(await neko.sfw.hug());
            const hugemb = new MessageEmbed()
                .setTitle(`${interaction.user.username} hugs ${user.username}`)
                .setColor(`${randomColor()}`)
				.setImage(img);
            interaction.reply({ embeds: [hugemb] });
		} else {
            const img = objToString(await neko.sfw.hug());
            const hugemb = new MessageEmbed()
                .setTitle(`${interaction.user.username} hugs themselves`)
                .setColor(`${randomColor()}`)
				.setImage(img);
            interaction.reply({ embeds: [hugemb] });
			}
	},
};