const {database} = require("../../index.js")

function registerNewGuild(interaction) {
    console.log("register a new guild");
    database[interaction.guild.id] = {};
    database[interaction.guild.id]["roles"] = {};
    database[interaction.guild.id]["except"] = [];
}

function isNewGuild(interaction){
    return interaction.guild != null && !(Object.keys(database).includes(interaction.guild.id));
}


module.exports = {registerNewGuild , isNewGuild};