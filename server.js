var wpi = require('wiring-pi');
var http = require('http');
var url = require('url');
//example Call ip.add.ress:8080/?family=intertechno&familyCode=12&switchCode=11%onOff=1
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    var q = url.parse(req.url, true).query;
    var txt = q.year + " " + q.month;

    if(q.onOff == "on"){
        txt = q.family+" "+q.familyCode+" "+q.switchCode+"get switched on";
    }else{
        txt = q.family+" "+q.familyCode+" "+q.switchCode+"get switched off";
    }
    res.end(txt);
}).listen(8080);

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
    return finalCode
}

function generateElroCode(familyCode, switchCode, onOff){
    var finalCode = "";
    familyCode = familyCode.toString()
    familyCode = familyCode.split("");
    //from 10101 to F0F0F
    for (x in familyCode){
        if(x == "1"){
            finalCode += F;
        }else{
            finalCode += 0;
        }
    }
    //switchCode to binary goes here
    //...

    if (onOff == 1){
        finalCode += "0F";
    }else{
        finalCode += "F0";
    }

}

function sendTriState(code){
    wpi.setup("wpi");
    wpi.delayMicroseconds(300);
    //...
    sendSync();
}
