module.exports = {
  apps: [
    {
      name: "huseyinapa",
      script: "npm",
      args: "start",
      cwd: "/var/www/huseyinapa", // Uygulamanın bulunduğu dizin
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      // Restart, stop gibi olaylarda webhook tetikleme
      post_restart:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"restart", "process":{ "name":"huseyinapa" }}\'',
      post_stop:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"stop", "process":{ "name":"huseyinapa" }}\'',
      post_start:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"start", "process":{ "name":"huseyinapa" }}\'',
      post_delete:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"delete", "process":{ "name":"huseyinapa" }}\'',
    },
    {
      name: "gulgonenkoop",
      script: "npm",
      args: "start",
      cwd: "/var/www/gulgonenkoop",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      post_restart:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"restart", "process":{ "name":"gulgonenkoop" }}\'',
      post_stop:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"stop", "process":{ "name":"gulgonenkoop" }}\'',
      post_start:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"start", "process":{ "name":"gulgonenkoop" }}\'',
      post_delete:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"delete", "process":{ "name":"gulgonenkoop" }}\'',
    },
    {
      name: "gulgonen_pay",
      script: "npm",
      args: "start",
      cwd: "/var/www/gulgonen_pay",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      post_restart:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"restart", "process":{ "name":"gulgonen_pay" }}\'',
      post_stop:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"stop", "process":{ "name":"gulgonen_pay" }}\'',
      post_start:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"start", "process":{ "name":"gulgonen_pay" }}\'',
      post_delete:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"delete", "process":{ "name":"gulgonen_pay" }}\'',
    },
    {
      name: "test_pay",
      script: "npm",
      args: "start",
      cwd: "/var/www/test_pay",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
      post_restart:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"restart", "process":{ "name":"test_pay" }}\'',
      post_stop:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"stop", "process":{ "name":"test_pay" }}\'',
      post_start:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"start", "process":{ "name":"test_pay" }}\'',
      post_delete:
        'curl -X POST https://b8e8-95-12-115-113.ngrok-free.app/api/webhook -H \'Content-Type: application/json\' -d \'{"event":"delete", "process":{ "name":"test_pay" }}\'',
    },
  ],
};
