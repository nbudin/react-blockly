module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  root: true,

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

  parserOptions: {
    sourceType: "module",
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/destructuring-assignment": 0,
    "react/static-property-placement": 0,
    "no-plusplus": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
};
