module.exports = function (w) {

    process.env.NODE_ENV = 'test';
    process.env.PORT = 1222;
    process.env.ALIAS_MAX_LEN = '8';
    process.env.DB_URI = 'mongodb://localhost:27017/URLShortenerTest'

    return {
        files: [
            'src/**/*'
        ],

        tests: [
            'tests/**/*.test.ts'
        ],

        env: {
            type: 'node'
        },

        // or any other supported testing framework:
        // https://wallabyjs.com/docs/integration/overview.html#supported-testing-frameworks
        testFramework: 'mocha'
    };
};