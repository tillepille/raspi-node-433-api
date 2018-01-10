# Raspberry NodeJs 433MHz API

Inspired by the [xkonni/raspbery-remote](https://github.com/xkonni/raspberry-remote) idea with RCSwitch mechanisms. But unfortunately this has issues with Raspian Stretch...  
Also based on [eroak/rpi-433](https://github.com/eroak/rpi-433) which I forked and tweaked to myself, will make a pull request later...

It's supposed to switch 433MHz ELRO style power outlets and intertechno switches by web. Mainly to use it with another NodeJS Instance of [Homebridge] (https://github.com/nfarina/homebridge).


## To-Do
* more stability (exception safety,...)

## How To use
In order to run this node you need to sudo `sudo nodejs server.js`

The only dependency is on `rpi-433-tristate` at the moment, hopefully this goes back to the `rpi-433` standard version of eroak in a future version.
On default this runs on Port 8080, modify the server.js if you want to use something else.
To work properly you need to set the following attributes:

* family -> `elro` or `inter`. inter works for Intertechno devices with two wheels on the back. (2x 1-16 resp. A-F, 1-16).
    elro should work for the cheapest 433MHz Outlets you can find. They have 10 dip switches you can use with binary numbering.
* familyCode -> depends on family. First wheel or first 5 dip switches.See examples below
* switchcode -> Second wheel or last 5 dip switches.
* onOff -> **1 : switch on, 0 : switch off, 2 : get current status of switch**

*Note: onOff=2 returns 1 if the switch is on or 0 if the switch is off. This can be used by homebridge to tell, if the switch is on or not, so the displaying is more reliable.*

Example Call:           `ip.add.ress:8080/?family=inter&familyCode=12&switchCode=11&onOff=1`
Another example Call:   `ip.add.ress:8080/?sys=elro&family=00100&switchCode=3&onOff=0`

**If you're experiencing any problems or have improvement ideas, please open an issue, contact me, make a pull request,...**
