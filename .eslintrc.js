module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'arrow-parens': 0,
    'no-debugger': 1,
    'no-warning-comments': [
      1,
      {
        terms: ['hardcoded'],
        location: 'anywhere',
      },
    ],
    'no-return-await': 0,
    'object-curly-spacing': ['error', 'always'],
    'no-var': 'error',
    'comma-dangle': [1, 'always-multiline'],
    'linebreak-style': ['error', 'unix'],
    'max-len': [
      1,
      {
        code: 80,
        comments: 80,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-console': [
      1,
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-underscore-dangle': 0,
    'consistent-return': 0,
  },
};
