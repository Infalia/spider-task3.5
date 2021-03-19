module.exports = {
    extends: [
        // add more generic rulesets here, such as:
        'plugin:vue/vue3-recommended',
    ],
    rules: {
        // override/add rules settings here, such as:
        "vue/max-attributes-per-line": ["warn", {
            "singleline": 5
        }]
    }
  }