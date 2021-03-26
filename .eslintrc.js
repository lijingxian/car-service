module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    // always使用分号，增加代码的可读性和歧义
    semi: ['error', 'always'],
    // 使用let或者const代替
    'no-var': 'error',
    // 去除函数括号前的空格缩进
    'space-before-function-paren': 0,
    // 箭头函数只有一个参数的情况下可以省略括号
    'arrow-parens': ['error', 'as-needed'],
    // allow async-await
    'generator-star-spacing': 'off',
    'no-debugger': 'error',
    'vue/no-use-v-if-with-v-for': 0,
    'prefer-const': 0,
    'no-prototype-builtins': 0,
    'quote-props': 0,
    'import/no-duplicates': 0
  }
};
