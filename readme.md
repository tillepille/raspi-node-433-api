#NodeJs Wiring-Pi Webserver

based on xkonni/raspbery-remote idea

Its supposed to switch 433MHz power outlets and intertechno switches by web. Mainly to use it with another NodeJS Instance of Homebridge.
At least thats the plan...

##To-Do
* understanding nodejs-wiring-pi
* generate codes for ELRO (10 pins)
    * from switchnumber like 3 to "000FF"
* Exception safety
* saving the current state of the switches
* get current state of switches

##Already Accomplished
* generating codes for Intertechno
* build dummy communication to check the generated Codes


**If you're a NodeJS Pro with too much time and knowledge of wiringPI please contact me, make a pull request,...**
