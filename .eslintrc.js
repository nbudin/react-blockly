module.exports = {
  env: {
    amd: true,
    browser: true,
    es6: true,
    jquery: false,
    node: true,
  },

  globals: {
    Blockly: true,
  },

  extends: ["airbnb", "prettier"],

  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react-hooks"],
  rules: {
    "react/destructuring-assignment": 0,
    "react/static-property-placement": 0,
    "no-plusplus": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
