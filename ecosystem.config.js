module.exports = {
  apps: [
    {
      name: "pm2-event-listener",
      args: "start",
      script: "pm2-event-listener.js",
      cwd: "/home/ubuntu/",
      watch: true,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "huseyinapa",
      script: "npm",
      args: "start",
      cwd: "/var/www/huseyinapa", // Ensure this path is correct and accessible by the user running PM2
      watch: false,
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "your-database-url-here", // Add database connection string
        API_KEY: "your-api-key-here", // Add any required API keys
      },
      // Restart, stop gibi olaylarda webhook tetikleme
      post_restart:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"restart\", \"process\":{ \"name\":\"huseyinapa\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_stop:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"stop\", \"process\":{ \"name\":\"huseyinapa\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_start:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"start\", \"process\":{ \"name\":\"huseyinapa\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_delete:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"delete\", \"process\":{ \"name\":\"huseyinapa\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
    },
    {
      name: "gulgonenkoop",
      script: "npm",
      args: "start",
      cwd: "/var/www/gulgonenkoop", // Ensure this path is correct and accessible by the user running PM2
      watch: false,
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "your-database-url-here",
        API_KEY: "your-api-key-here",
      },
      post_restart:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"restart\", \"process\":{ \"name\":\"gulgonenkoop\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_stop:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"stop\", \"process\":{ \"name\":\"gulgonenkoop\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_start:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"start\", \"process\":{ \"name\":\"gulgonenkoop\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_delete:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"delete\", \"process\":{ \"name\":\"gulgonenkoop\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
    },
    {
      name: "gulgonen_pay",
      script: "npm",
      args: "start",
      cwd: "/var/www/gulgonen_pay", // Ensure this path is correct and accessible by the user running PM2
      watch: false,
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "your-database-url-here",
        API_KEY: "your-api-key-here",
      },
      post_restart:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"restart\", \"process\":{ \"name\":\"gulgonen_pay\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_stop:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"stop\", \"process\":{ \"name\":\"gulgonen_pay\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_start:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"start\", \"process\":{ \"name\":\"gulgonen_pay\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_delete:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"delete\", \"process\":{ \"name\":\"gulgonen_pay\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
    },
    {
      name: "test_pay",
      script: "npm",
      args: "start",
      cwd: "/var/www/test_pay", // Ensure this path is correct and accessible by the user running PM2
      watch: false,
      env: {
        NODE_ENV: "production",
        DATABASE_URL: "your-database-url-here",
        API_KEY: "your-api-key-here",
      },
      post_restart:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"restart\", \"process\":{ \"name\":\"test_pay\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_stop:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"stop\", \"process\":{ \"name\":\"test_pay\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_start:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"start\", \"process\":{ \"name\":\"test_pay\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
      post_delete:
        'curl -X POST https://typically-lenient-sailfish.ngrok-free.app/api/webhook -H "Content-Type: application/json" -d "{\"event\":\"delete\", \"process\":{ \"name\":\"test_pay\" }}" >> /home/ubuntu/pm2_hook_$(date +"%Y-%m-%d").log 2>&1',
    },
    {
      name: "server_backup",
      script: "server_backup.py",
      interpreter: "python3",
      cwd: "/home/ubuntu/",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    }
  ],
};