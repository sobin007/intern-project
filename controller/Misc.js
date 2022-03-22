

function isEmpty(value) {
    if (value === undefined || value === null || value === "")
        return true;
}

function isNullOrUndefined(value) {
    if (value === undefined || value === null)
        return true;
}

function isnullorempty(val) {
    if (val === false || val === true) {
        return false;
    }
    if (val === 0) {
        return false;
    }
    if (val === undefined || val === null || val === 'null' || val === 'undefined' || val === "" || (!val)) {
        return true;
    }
    else
        if (typeof val === "number") {
            return false;
        }
        else {
            if (val.length > 0) {
                return false;
            }
            else {
                val = JSON.stringify(val);
                val = JSON.parse(val);
                if (Object.keys(val).length > 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
}

async function getIndianTime() {
    var currentTime = new Date();
    var currentOffset = currentTime.getTimezoneOffset();
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
    return ISTTime;
}


async function waittillallpromiseareover(data) {
    var tries = 0;
    var result = "nodata";
    Promise.all(data).then(x => {
        console.log("then called")
        result = x;
    })
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    do {
        await sleep(500);
        tries++;
        if (tries > 40) {
            //20 secs & yet not fully read
            return null;
        }
    } while (result === "nodata");
    return result;
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Z]/i);
}

async function distance(lat1, lon1, lat2, lon2) {

    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        //if (unit=="K") { dist = dist * 1.609344 }
        //if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
}


module.exports.isnullorempty = isnullorempty;
module.exports.isEmpty = isEmpty;
module.exports.isNullOrUndefined = isNullOrUndefined;
module.exports.getIndianTime = getIndianTime;
module.exports.waittillallpromiseareover = waittillallpromiseareover;
module.exports.isLetter = isLetter;
module.exports.distance = distance;