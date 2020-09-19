module.exports = {
  apps : [{
    name: '7linky',
    script: '/bin/www',
    watch : ".",

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances : "max",
    exec_mode : "cluster",
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    }
  }],

  deploy : {
    production : {
      user : 'root',
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
