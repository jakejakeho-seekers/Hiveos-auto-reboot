const axios = require('axios');
const moment = require('moment');
const https = require('https');

const instance = axios.create({
    timeout: 60 * 1000,
    httpsAgent: new https.Agent({  
      rejectUnauthorized: false
    })
  });
setInterval(() => {
    instance('https://192.168.1.15:4200/').then((result) => {
        console.log('online');
    }).catch((err) => {
        console.log('offline');
        reboot(10);
    });
}, 60 * 1000);

let lastRebootTime = moment().add(-5, 'minutes');
let claimDownMinutes = 5;
reboot = (seconds) => {
    let minutesDiff = moment().diff(lastRebootTime, 'minutes');
    if (minutesDiff >= claimDownMinutes) {
        lastRebootTime = moment();
        console.log(`Rebooting in ${seconds} seconds!`);
        setRigOnOff(false);
        setTimeout(() => {
            setRigOnOff(true);
            console.log('Done Rebooting');
        }, seconds * 1000);
    } else {
        console.log('Last reboot time is: ' + lastRebootTime.format('YYYY-MM-DD HH:mm:ss'));
        console.log(`Please wait ${claimDownMinutes - minutesDiff} minutes to reboot!`);
    }
}

setRigOnOff = (isOnOff) => {
    if(isOnOff) {
        console.log('Turnning On');
    } else {
        console.log('Turnning Off');
    }
    let cmd = `python3 -m homekit.put_characteristic -f accesory.json -a rig0 -c 1.9 ${isOnOff ? 'true' : 'false'}`;
    const exec = require('child_process').exec;
    const child = exec(cmd,
        (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
    });
}
