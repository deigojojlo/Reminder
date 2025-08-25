const { SlashCommandSubcommandBuilder, EmbedBuilder, time } = require("discord.js");
const { execute } = require("./ignore");
const { loadedData, database } = require("..");
const { dicoSearch } = require("./util/dicoSearch");
const { stringToDate, dayEquals, dateToDayString, toEUString, toEUHourString, toEUDayString} = require("./util/date");


function loadEvent(data,formatedDate){
    var index = 0;
    const keeped = [];

    while (dateToDayString(data[index]["StartDate"]) < formatedDate){
        // console.log("search");
        index ++;
    }

    const chooseDate = dateToDayString(data[index]["StartDate"]);

    
    while (dateToDayString(data[index]["StartDate"]) == chooseDate){
        // console.log(data[index]);
        keeped.push(data[index])
        // console.log("founded");
        index++;
    }
    return keeped;
}

function getAcceptedRole(interaction){
    const roles = interaction.member.roles.cache.map(role => role.id);
    const acceptedRoles = [];

    //search roles for edt
    for (const r of roles) {
        if (Object.keys(database[interaction.guild.id]["roles"]).includes(r))
            acceptedRoles.push(r);
    }
    return acceptedRoles;
}

function getDate(gap){
    var date = new Date();
    date.setDate(date.getDate() + gap );
    return date;
}

function formatDate(date){
    var formatedDate = date.toISOString().replaceAll("-","").replaceAll(":","");
    var dateObject = stringToDate(formatedDate);
    return dateToDayString(dateObject);
}

function increaseDate(date){
    date.setDate(date.getDate() + 1);
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
        var formatedDate = formatDate(date);
        const acceptedRoles = getAcceptedRole(interaction);

        // check registration
        if (acceptedRoles.length == 0) {
            await interaction.reply("you don't have a role wich is linked to an edt");
            return ;
        }
        
        
        // load the event for the roles list
        var event = [];
        while (event.length == 0){
            for (const role of acceptedRoles) {
                event = event.concat(loadEvent(loadedData[role],formatedDate));
            }
            increaseDate(date);
            formatedDate = formatDate(date);
        }
        // sort to collapse the differente sources
        event.sort((a,b) => {
            if (a["Start"] == b["Start"]) {
                return 0;
            } else if (a["Start"] < b["Start"]){
                return -1 ;
            } else {
                return 1;
            }
        });

        // add fields to the embed
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle("Emploi du temps")
        for (const e of event){
            embed.addFields(
                { name : toEUHourString(e["StartDate"]) + " jusqu'à " + toEUHourString(e["EndDate"]), value : e["Summary"] + '\n' + e["Location"]}
            );
        }
        embed.setDescription("La journée du " + toEUDayString(event[0]["StartDate"]));
        embed.setFooter({text : "Reminder bot"});
        await interaction.reply({embeds : [embed]});
    }
}