
function stringToDate(date) {
    return {
        "Year"      :   date.substring(0,4),
        "Month"     :   date.substring(4,6),
        "Day"       :   date.substring(6,8),
        "Hour"      :   date.substring(9,11),
        "Minute"    :   date.substring(11,13),
        "Seconde"   :   date.substring(13,15)
    };
}

function dateToString(date){
    return date.Year + date.Month + date.Day + "T" + date.Hour + date.Minute + date.Seconde;
}

function toEUString(date){
    return date.Day + "/" + date.Month + "/" + date.Year + " à " + date.Hour + ":" + date.Minute + ":" + date.Seconde;
}

function toEUHourString(date){
    return  date.Hour + ":" + date.Minute + ":" + date.Seconde;
}

function toEUDayString(date){
    return date.Day + "/" + date.Month + "/" + date.Year ;
}
function dateToDayString(date){
    return date.Year + date.Month + date.Day
}
function dayEquals(d1,d2){
    return d1.Year + d1.Month + d1.Day == d2.Year + d2.Month + d2.Day;
}

module.exports = {stringToDate,dateToString,dayEquals,dateToDayString,toEUString,toEUHourString,toEUDayString};