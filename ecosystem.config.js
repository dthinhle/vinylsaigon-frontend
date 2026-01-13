module.exports = {
  apps: [
    {
      name: 'baka-frontend',
      script: './node_modules/.bin/next',
      args: 'start -p 8080',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
}
