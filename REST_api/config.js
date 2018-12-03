// Configuration variables

var environments = {
    staging: {
        httpPort: 3000,
        httpsPort: 3001,
        envName: "staging"
    },

    production: {
        httpPort: 5000,
        httpsPort: 5001,
        envName: "production"
    }
};

let currentEnv = process.env.NODE_ENV ?
    process.env.NODE_ENV.toLowerCase() : "";

let selectedEnv = currentEnv in environments ?
    environments[currentEnv] : environments.staging;

module.exports = selectedEnv;