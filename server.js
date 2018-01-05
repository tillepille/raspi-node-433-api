var wpi = require('wiringpi-node');
var http = require('http');
var url = require('url');

var switchStateDict= {};
var wPin = 0;

//example Call ip.add.ress:8080/?family=inter&familyCode=12&switchCode=11&onOff=1
http.createServer(function (req, res) {
    //
    wpi.setup("wpi");
    wpi.pinMode(wPin, wpi.OUTPUT);
    console.log("Set up wiringPi-Node");

    var q = url.parse(req.url, true).query;
    var stat = mainController(q.sys,q.family, q.switchCode,q.onOff);
    //asked for status give success + status as plain text
    if(-1 < stat && stat < 2){
        res.writeHead(200, {'Content-Type': 'text/html'});
        var txt = stat;
    //asked for switching, give if switch exists or nor
    }else if (stat == 200 || stat == 404) {
        res.writeHead(stat,{'Content-Type': 'text/html'});
        var txt = "Sucess!";
    //any other gives an internal error
    }else {
        console.log("Error in main controller");
        res.writeHead(502, {'Content-Type': 'text/html'});
        var txt ="502 Internal Error";
    }
    res.end(txt);
}).listen(8080);

//main controller
function mainController(sys,familyCode, switchCode,onOff){
    if(onOff == 2){
        return getState(familyCode,switchCode);
    }else{
        switch (sys){
            case "inter":
                sendTriState(generateIntertechnoCode(familyCode,switchCode,onOff));
                changeState(familyCode,switchCode,onOff);
                return 200;
                break;
            case "elro":
                sendTriState(generateElroCode(familyCode,switchCode,onOff));
                changeState(familyCode,switchCode,onOff);
                return 200;
                break;
            default:
            return 404;
        }

    }
}

//functions for current state

function getState(familyCode, switchCode){
    var code = familyCode.toString()+switchCode.toString();
    var state = switchStateDict[code];
    //what if switch doesnt exist
    if(state.length > 0){
        return state;
    }else {
        return -1;
    }
}

function changeState(familyCode,switchCode,onOff){
    var code = familyCode.toString()+switchCode.toString();
    switchStateDict[code] = onOff;
    console.log(code+": "+switchStateDict[code]);
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
    console.log("generated inter Code: "+finalCode);
    return finalCode;
}
//Generate Code for ELRO Switches for sending it via sendTriState()
function generateElroCode(familyCode, switchCode, onOff){
    var finalCode = "";
    var familyCodeArray = familyCode.toString().split("");
    //from 10101 to F0F0F
    finalCode += replaceOnes(familyCodeArray, true);
    var sn = Number(switchCode);
    var switchBinaryCode = sn.toString(2);
    switchBinaryCode = replaceOnes(switchBinaryCode,true);
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
    console.log("generated elro Code: "+finalCode);
    return finalCode;
}
//inverted == true 0->F, inverted == false 1
function replaceOnes(string,inverted){
    var result = "";
    for (x in string){
        if(inverted){
            if(string[x] == 1){
                result += "0";
            }else{
                result += "F";
            }
        }else{
            if(string[x] == 1){
                result += "F";
            }else{
                result += "0";
            }
        }
    }
    return result;
}

function sendTriState(code){
    code = code.split("");
    for(i in code){
        switch (code[i]){
            case "0":
                transmit(1,3);
                transmit(1,3);
                break;
            case "1":
                transmit(3,1);
                transmit(3,1);
                break;
            case "F":
                transmit(1,3);
                transmit(3,1);
                break;
        }
    }
    //sync bit
    transmit(1,31);
    console.log("Send TriState Signal: "+code);
}
function transmit(highPulses,lowPulses){
    for(var i= 0; i < highPulses;i++){
        wpi.digitalWrite(wPin,1);
        wpi.delayMicroseconds(300);
    }
    for(var i = 0; i < lowPulses;i++){
        wpi.digitalWrite(wPin,0);
        wpi.delayMicroseconds(300);
    }
}
