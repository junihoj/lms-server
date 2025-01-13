module.exports = {
    apps: [
        // {
        //     name: 'video-processing-app',
        //     script: './dist/app.js',
        //     instances: 1,
        //     exec_mode: 'cluster',
        //     watch: true,
        //     autorestart: true,
        //     env: {
        //         NODE_ENV: 'production',
        //     },
        // },

        {
            name: 'app-server',
            script: './server.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        },
        {
            name: 'resque-worker',
            script: './worker.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
        }
    ],
};
