module.exports = {
    apps: [{
        name: "business-ai-backend",
        script: "./backend/src/server.js",
        instances: "max",
        exec_mode: "cluster",
        watch: false,
        max_memory_restart: "1G",
        env: {
            NODE_ENV: "production",
            PORT: 3000
        },
        env_production: {
            NODE_ENV: "production"
        },
        log_date_format: "YYYY-MM-DD HH:mm Z",
        error_file: "./logs/pm2-error.log",
        out_file: "./logs/pm2-out.log",
        merge_logs: true
    }]
};
