var gap = 1;
const date = new Date();
date.setDate(date.getDate() + 1)
var s = date.toISOString().replaceAll("-","").replaceAll(":","");
console.log(s.substring(0,s.length - 5))