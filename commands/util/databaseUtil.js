function getGuild(data,interaction){
    return data[interaction.guild.id];
}

function getGuildEntry(data,interaction){
    return data[interaction.guild.id].Entry;
}

function getExcept(data,interaction,role){
    return getGuild(data,interaction).Entry[role].Except;
}

function getOption(data,interaction,role){
    return getGuild(data,interaction).Entry[role].Option;
}

function getAdminRole(data,interaction){
    return getGuild(data,interaction).AdminRole;
}

function getGuildId(interaction){
    return interaction.guild.id;
}

function getGuildRoles(interaction){
    return interaction.guild.roles.cache.map(role => role.id);
}

function getGuildOwner(interaction){
    return interaction.guild.ownerId;
}

function getAuthorId(interaction){
    return interaction.author.id;
}

function setAdminRole(interaction,data,role){
    data[interaction.guild.id].AdminRole = role;
}

module.exports = {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId,setAdminRole};