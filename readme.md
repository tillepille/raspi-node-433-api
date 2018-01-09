#NodeJs Wiring-Pi Webserver

based on xkonni/raspbery-remote idea with RCSwitch mechanisms.
Also based on eroak/rpi-433 wich i forked and tweaked to myself, will make a pull request later...

Its supposed to switch 433MHz power outlets and intertechno switches by web. Mainly to use it with another NodeJS Instance of Homebridge.
At least thats the plan...

##To-Do
* Exception safety
* make it work

##Already Accomplished
* generating codes for Intertechno and ELRO
* untested minimal server frame
* State of switches is working..
* theoretically it is working but practically not.

Example Call: `ip.add.ress:8080/?family=inter&familyCode=12&switchCode=11&onOff=1`

**If you're a NodeJS Pro with too much time and knowledge of wiringPI please contact me, make a pull request,...**
