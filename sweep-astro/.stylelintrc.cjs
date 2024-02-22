module.exports = {
  processors: [],
  ignoreFiles: ['node_modules/*'],
  defaultSeverity: 'error',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-html/astro',
  ],
  rules: {
    'font-family-name-quotes': 'always-where-recommended',
    'font-weight-notation': 'named-where-possible',
    'function-url-no-scheme-relative': true,
    'function-url-quotes': 'always',
    'value-keyword-case': 'lower',
    'unit-disallowed-list': [],
    'max-empty-lines': 2,
    'no-descending-specificity': true,
    'no-duplicate-selectors': true,
    // 'font-family-no-missing-generic-family-keyword': null,
    // 'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'custom-property-empty-line-before': [
      'always',
      {
        except: ['after-custom-property'],
        ignore: ['after-comment', 'first-nested', 'inside-single-line-block'],
        severity: 'warning',
      },
    ],
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
        severity: 'warning',
      },
    ],
    'declaration-empty-line-before': [
      'always',
      {
        except: ['after-declaration'],
        ignore: ['after-comment', 'first-nested', 'inside-single-line-block'],
        severity: 'warning',
      },
    ],
    'property-no-unknown': [true, { ignoreProperties: ['label'] }],
    // 'function-no-unknown': null,
    // 'at-rule-no-unknown': null,
    // 'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
        severity: 'warning',
      },
    ],
    'at-rule-empty-line-before': [
      'always',
      {
        except: [
          'blockless-after-blockless',
          'blockless-after-same-name-blockless',
        ],
        ignore: ['after-comment', 'first-nested'],
        severity: 'warning',
        ignoreAtRules: ['else', 'include'],
      },
    ],
    'property-no-vendor-prefix': [
      true,
      {
        ignoreProperties: ['background-clip'],
      },
    ],
    'declaration-empty-line-before': ['never'],
    'custom-property-empty-line-before': null,
    'no-descending-specificity': null,
    'scss/at-if-no-null': null,
    'scss/operator-no-newline-after': null,
    'import-notation': null,
  },
};
