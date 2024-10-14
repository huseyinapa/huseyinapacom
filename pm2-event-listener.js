const pm2 = require('pm2');

pm2.launchBus((err, bus) => {
    if (err) {
        console.error(err);
        return;
    }

    bus.on('process:event', (data) => {
        if (['restart', 'stop', 'start', 'delete'].includes(data.event)) {
            const eventName = data.event;
            const processName = data.process.name;

            console.log(`Event detected: ${eventName} on ${processName}`);

            // Burada ilgili curl komutunu tetikleyebilirsiniz
            const { exec } = require('child_process');
            const webhookUrl = `https://typically-lenient-sailfish.ngrok-free.app/api/webhook`;
            const payload = JSON.stringify({ event: eventName, process: { name: processName } });
            const command = `curl -X POST ${webhookUrl} -H 'Content-Type: application/json' -d '${payload}'`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Curl command failed: ${stderr}`);
                } else {
                    console.log(`Webhook sent: ${stdout}`);
                }
            });
        }
    });
});
