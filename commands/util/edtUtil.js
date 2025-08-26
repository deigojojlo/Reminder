const { database } = require("../..");

function isException(event,exceptions){
	return exceptions.includes(event.Summary);
}

function checkOption(event,roles,options){
	var isInOption = false ;
	for (const [optrole,summary] of Object.entries(options)){
		if (event.Summary == summary){
			isInOption = true ;
			if (roles.includes(optrole)){
				return 1 ; // is in option and the author had the role
			}
		}
	}
	if (isInOption)
		return 0; // is in option and the author doesn't had the role
	return -1 // is not an option
}

function getAcceptedRole(interaction){
    const roles = interaction.member.roles.cache.map(role => role.id);
    const acceptedRoles = [];

    //search roles for edt
    for (const r of roles) {
        if (Object.keys(database[interaction.guild.id].roles).includes(r))
            acceptedRoles.push(r);
    }
    return acceptedRoles;
}

module.exports = { isException , checkOption, getAcceptedRole};