var wpi = require('wiring-pi');
var http = require('http');
var url = require('url');

var switchStateDict= {};
//example Call ip.add.ress:8080/?family=inter&familyCode=12&switchCode=11%onOff=1
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var q = url.parse(req.url, true).query;
    var txt = q.family+" "+q.familyCode+" "+q.switchCode+" get switched "+q.onOff;
    switch (q.family) {
        case "inter":
            txt += "\n generated Inter Code: " + generateIntertechnoCode(q.familyCode,q.switchCode,q.onOff);
        case "elro":
            txt += "\n generated Elro Code: " + generateElroCode(q.familyCode,q.switchCode,q.onOff);
            break;
        default:
        txt += "unknown system, nothing to do...";
    }
    res.end(txt);
}).listen(8080);

//functions for current state

function getState(familyCode, switchCode){
    var code = familyCode.toString+switchCode.toString;
    var index = getSwitchIndex(code);
    var state = switchStateDict[code];
    //what if switch doesnt exist
    if(state.length > 0){
        return state;
    }else {
        return -1;
    }
}

function changeState(familyCode,switchCode,onOff){
    var code = familyCode.toString+switchCode.toString;
    var index = getSwitchIndex(code);
    switchStateDict[code] = onOff;
}

//Generate Code for Intertechno Switches for sending it via sendTriState()
function generateIntertechnoCode(familyCode, switchCode, onOff){
    var codes = ["0000", "F000", "0F00", "FF00", "00F0", "F0F0", "0FF0", "FFF0", "000F", "F00F", "0F0F", "FF0F", "00FF", "F0FF", "0FFF", "FFFF"];
    var finalCode = "";
    finalCode += codes[familyCode-1];
    finalCode += codes[switchCode-1];
    finalCode += "0F";
    if (onOff == 1){
        finalCode += "FF";
    }else{
        finalCode += "F0";
    }
    return finalCode;
}
//Generate Code for ELRO Switches for sending it via sendTriState()
function generateElroCode(familyCode, switchCode, onOff){
    var finalCode = "";
    familyCode = familyCode.toString()
    familyCode = familyCode.split("");
    //from 10101 to F0F0F
    finalCode += replaceOnes(familyCode, true);
    var switchBinaryCode = switchCode.toString(2);
    //fill up to 5 bits
    while(switchBinaryCode.length < 5){
        switchBinaryCode = "F" + switchBinaryCode;
    }
    finalCode += switchBinaryCode;
    //add bits for on/off
    if (onOff == 1){
        finalCode += "0F";
    }else{
        finalCode += "F0";
    }
    return finalCode;
}
//inverted == true 0->F, inverted == false 1
function replaceOnes(string,inverted){
    var result;
    for (x in string){
        if(inverted){
            if(x == "1"){
                result += "0";
            }else{
                result += "F";
            }
        }else{
            if(x == "1"){
                result += "F";
            }else{
                result += "0";
            }
        }
    }
    return result;
}

function sendTriState(code){
    wpi.setup("wpi");
    wpi.delayMicroseconds(300);
    //...
    digitalWrite(0, state);
    sendSync();
}
