const { SlashCommandSubcommandBuilder, EmbedBuilder, time } = require("discord.js");
const { loadedData, database } = require("..");
const { dateToDayString, toEUHourString, toEUDayString, getDate, formatDate, increaseDate} = require("./util/date");
const { isException, checkOption, getAcceptedRole } = require("./util/edtUtil");


function loadEvent(data,roles,options,exceptions,formatedDate){
    var index = 0;
    const keeped = [];
    while (dateToDayString(data[index]["StartDate"]) < formatedDate){
        index ++;
    }

    const chooseDate = dateToDayString(data[index]["StartDate"]);

    
    while (dateToDayString(data[index]["StartDate"]) == chooseDate){
        // console.log(data[index]);
        if (isException(data[index],exceptions)){
            index ++;
            continue;
        }

        if (checkOption(data[index],roles,options) == 0){
            index++;
            continue;
        }

        keeped.push(data[index++]);
    }
    return keeped;
}





module.exports = {
    data : new SlashCommandSubcommandBuilder()
        .setName("day")
        .setDescription('get the edt of today')
        .addIntegerOption( option =>
            option.setName("gap")
            .setDescription("if you want an other day. get today + gap day")
            .setRequired(false)
        ),
    async execute(interaction) {
        const gap = interaction.options.getInteger("gap");
        const date = getDate(gap);
        const acceptedRoles = getAcceptedRole(interaction);
        const roles = interaction.member.roles.cache.map(role => role.id);
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Emploi du temps")
        var formatedDate = formatDate(date);
        var options ;
        var except;
        var events = [];

        // check registration
        if (acceptedRoles.length == 0) {
            await interaction.reply("you don't have a role wich is linked to an edt");
            return ;
        }

        while (events.length == 0){
            for (const role of acceptedRoles) {
                except = database[interaction.guild.id].roles[role].except || [];
                options = database[interaction.guild.id].roles[role].option_rules || [] ;
                events = events.concat(loadEvent(loadedData[role],roles,options,except,formatedDate));
            }
            increaseDate(date);
            formatedDate = formatDate(date);
        }

        // sort to collapse the differents sources
        events.sort((a,b) => a.Start.localCompare(b.Start));

        for (const event of events){
            const name = `${toEUHourString(event.StartDate)} jusqu'à ${toEUHourString(event.EndDate)}`;
            var val =
                `📍 : ${event.Location}
			    📝 : ${event.Summary}\n`;
            embed.addFields({ name : name, value : val});
        }
        embed.setDescription(`La journée du ${toEUDayString(events[0].StartDate)}`)
        .setFooter({text : "Reminder bot"});
        await interaction.reply({embeds : [embed]});
    }
}