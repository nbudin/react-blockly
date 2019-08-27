module.exports = {
  env: {
    amd: true,
    browser: true,
    es6: true,
    jquery: false,
    node: true,
  },

  globals: {
    'Blockly': true,
  },

  extends: [
    "airbnb",
  ],

  parser: "babel-eslint",
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
  "rules": {
    "react/destructuring-assignment" : 0,
    "react/static-property-placement" : 0,
    "no-plusplus" : 0
  }
};
