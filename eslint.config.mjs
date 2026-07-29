export default [
  {
    files:["assets/news.js","scripts/*.mjs"],
    languageOptions:{ecmaVersion:"latest",sourceType:"module",globals:{window:"readonly",document:"readonly",fetch:"readonly",URL:"readonly",setTimeout:"readonly",clearTimeout:"readonly",console:"readonly"}},
    rules:{"no-undef":"error","no-unused-vars":["error",{argsIgnorePattern:"^_"}],"no-constant-binary-expression":"error"}
  }
];