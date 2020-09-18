module.exports = {
  apps : [{
    name: '7linky',
    script: '/bin/www',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'hostwinds',
      host : '192.236.147.41',
      ref  : 'origin/main',
      repo : 'git@github.com:malkico/linkey.git',
      path : '/var/www/7linky',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
