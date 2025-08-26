const { SlashCommandSubcommandBuilder, EmbedBuilder} = require('discord.js');
const { loadedData, database} = require('../index');
const { toEUHourString, toEUDayString, getDate, toIsoString } = require('./util/date');
const { isException, checkOption, getAcceptedRole } = require('./util/edtUtil');


function loadEvent(data,roles,options,exceptions,formatedDate){
	var index = 0 ;
	while (data[index].Start < formatedDate || isException(data[index],exceptions) || checkOption(data[index],roles,options) == 0){
		index ++;
	}

	const keeped = { onAir : [], next : [] };

	if (index != 0 && data[index - 1].Start < formatedDate && data[index -1].End > formatedDate && !isException(data[index - 1], exceptions) && checkOption(data[index - 1],roles,options) == 0)
			keeped.onAir.push(data[index-1]);

	keeped.next.push(data[index]);
	return keeped;
}

function concatEvent(event1,event2){
	return {
		onAir : event1.onAir.concat(event2.onAir),
		next : event1.next.concat(event2.next)
	}
}

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('next')
		.setDescription('see your next event'),
	async execute(interaction) {
		const acceptedRoles = getAcceptedRole(interaction);
		const date = getDate();
		const formatedDate = toIsoString(date);
		const roles = interaction.member.roles.cache.map(role => role.id);
		const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle("Emploi du temps")
		var exceptions;
		var options;
		var keeped = { onAir : [], next : [] };
		var description ;
		var val = "";

		if (acceptedRoles.length == 0) {
			await interaction.reply("votre serveur n'est pas enregistrer, enregistrez vous avec /edt register");
			return ;
		}

		for (const role of acceptedRoles){
			exceptions = database[interaction.guild.id].roles[role].except;
			options = database[interaction.guild.id].roles[role].option_rules;
			keeped = concatEvent(keeped,loadEvent(loadedData[role],roles,options,exceptions,formatedDate));
		}

		if (keeped.onAir.length != 0)
			description = "Les evenements en cours et les evenements suivants";
		else
			description = "Les évènements suivants";

		keeped.onAir.forEach( event =>
			val += `Le ${toEUDayString(event.StartDate)} de ${toEUHourString(event.StartDate)} à ${toEUHourString(event.EndDate)}
			📍 : ${event.Location }
			📝 : ${event.Summary}\n`
		);
		if (val.length != 0)
			embed.addFields({ name : "Les évènements en cours", value : val});

		val = "";
		keeped.next.forEach( event =>
			val += `Le ${toEUDayString(event.StartDate)} de ${toEUHourString(event.StartDate)} à ${toEUHourString(event.EndDate)}\n
			📍 : ${event.Location }
			📝 : ${event.Summary}\n`
		);
		embed.addFields({ name : "Les évènements à venir", value : val});
		embed.setDescription(description);
		embed.setFooter({text : "Reminder bot"});
		await interaction.reply({embeds : [embed]});
	}
}