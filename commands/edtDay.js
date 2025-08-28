const { SlashCommandSubcommandBuilder, EmbedBuilder, time } = require("discord.js");
const { loadedData, database } = require("..");
const { dateToDayString, toEUHourString, toEUDayString, getDate, formatDate, increaseDate} = require("./util/date");
const { isException, checkOption, getAcceptedRole } = require("./util/edtUtil");

const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');

function loadEvent(data,roles,options,exceptions,formatedDate){
    var index = 0;
    const keeped = [];
    console.log(options);
    
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

        console.log(data[index]);
        console.log(roles);
        console.log(options);
        
        console.log(checkOption(data[index],roles,options));
        
        
        if (checkOption(data[index],roles,options) == 0){
            console.log("not an option");
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
        const acceptedRoles = getAcceptedRole(interaction,database);
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const userRoles = member.roles.cache;
        const roles = userRoles.filter(role => role.id !== interaction.guild.id).map( role => role.id);
        console.log(roles);
        
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
                except = getExcept(database,interaction,role) || [];
                options = getOption(database,interaction,role) || [] ;
                events = events.concat(loadEvent(loadedData[role],roles,options,except,formatedDate));
            }
            increaseDate(date);
            formatedDate = formatDate(date);
        }

        // sort to collapse the differents sources
        events.sort((a,b) => a.Start < b.Start ? -1 : a.Start == b.Start ? 0 : 1);

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