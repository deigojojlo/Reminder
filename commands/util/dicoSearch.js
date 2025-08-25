

function dicoSearch(list, elem, start, end ,equals){
    if (end == -1) end = list.length;
    // if ( equals == undefined) equals = (a,b) => {
    //     if (a == b)
    //         return 0
    //     else if (a < b)
    //         return -1
    //     else
    //         return 1
    // }
    const middle = Math.floor((start + end) /2);
    // console.log(`${start} ${end}`);
    if (end - start < 1) return null;

    const extracData = list[middle];

    switch (equals(extracData,elem)){
        case 0 :
            return middle;
        case 1 :
            return dicoSearch(list,elem,middle,end,equals);
        case -1 :
            return dicoSearch(list,elem,start,middle,equals);
        default :
            return middle;
    }
}
    

module.exports = { dicoSearch }