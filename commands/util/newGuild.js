
function registerNewGuild(interaction,database) {
    database[interaction.guild.id] = {};
    database[interaction.guild.id].Entry = {};
    database[interaction.guild.id].Except = [];
}

function isNewGuild(interaction,database){
    console.log(database);
    return interaction.guild != null && (Object.keys(database).length == 0 || !(Object.keys(database).includes(interaction.guild.id)));
}


module.exports = {registerNewGuild , isNewGuild};