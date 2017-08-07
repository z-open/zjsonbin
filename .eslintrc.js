
module.exports = {
    extends: [
        'eslint-config-google',
    ],
    "parserOptions": {
        "ecmaVersion": 6
    },
    rules: {
        'no-invalid-this': 0,
        'one-var': 0,
        'prefer-rest-params': 0,
        'max-len': 0,
        'require-jsdoc': 0,
        'valid-jsdoc': 0,

        // node_modules/eslint/bin/eslint.js --fix 
        'no-var': 1,
        'no-unused-expressions': 0
    },
    globals: {
        //testing keywords
        'describe': true,
        'it': true,
        'expect': true,
        'beforeEach': true,
        'define': true
    }
}
