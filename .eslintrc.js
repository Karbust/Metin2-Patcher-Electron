module.exports = {
    'settings': {
        'react': {
            'version': 'detect'
        },
        'import/extensions': [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.d.ts'
        ],
        'import/parsers': {
            '@typescript-eslint/parser': [
                '.ts',
                '.tsx'
            ]
        },
        'import/resolver': {
            'node': {
                'extensions': [
                    '.js',
                    '.jsx',
                    '.ts',
                    '.tsx',
                    '.d.ts'
                ],
                'module-directory': [
                    'node_modules',
                    'src/'
                ]
            }
        }
    },
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'react-app',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'airbnb',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'root': true,
    'parser': '@typescript-eslint/parser',
    'ignorePatterns': [
        '.eslintrc.js',
        'stylelint.config.js',
        'tailwind.config.js',
        'postcss.config.js',
        'vite.config.js',
        'dist/*'
    ],
    'parserOptions': {
        'project': ['./tsconfig.json', './src_electron/tsconfig.json'],
        'ecmaFeatures': {
            'js': true,
            'jsx': true,
            'ts': true,
            'tsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        'react-hooks',
        'jsx-a11y',
        'import',
        '@typescript-eslint'
    ],
    'rules': {
        'linebreak-style': ['error', 'unix'],
        'spaced-comment': 'off',
        'no-nested-ternary': 'off',
        'consistent-return': 'off',
        'no-useless-escape': 'off',
        'no-unused-vars': 'off',
        'no-param-reassign': 'off',
        'no-use-before-define': 'off',
        'comma-dangle': 'off',
        'no-plusplus': 'off',
        'no-loop-func': 'off',
        'no-redeclare': 'off',
        'operator-linebreak': 'off',
        'no-unused-expressions': 'warn',
        'max-len': 'off',
        'eol-last': 'error',
        'curly': 'error',
        'no-unexpected-multiline': 'warn',
        'no-underscore-dangle': 'off',
        'sort-keys': 'off',
        'default-case': 'warn',
        'camelcase': 'off',
        'no-undef': 'off',
        'multiline-ternary': 'off',
        'no-bitwise': 'error',
        'arrow-body-style': [
            'error',
            'as-needed'
        ],
        'object-curly-spacing': [
            'error',
            'always'
        ],
        'semi': [
            'error',
            'never'
        ],
        'jsx-quotes': [
            'error',
            'prefer-single'
        ],
        'quotes': [
            'error',
            'single',
            {
                'avoidEscape': true
            }
        ],
        'no-mixed-operators': [
            'error',
            {
                'allowSamePrecedence': true
            }
        ],
        'quote-props': [
            'warn',
            'consistent'
        ],
        'func-names': [
            'warn',
            'as-needed'
        ],
        'object-curly-newline': [
            'error',
            {
                'multiline': true,
                'minProperties': 5,
                'consistent': true
            }
        ],
        'indent': 'off',
        /* @typescript-eslint */
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-loop-func': ['error'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        '@typescript-eslint/no-shadow': ['error'],
        '@typescript-eslint/quotes': [
            'error',
            'single'
        ],
        '@typescript-eslint/semi': [
            'error',
            'never'
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-interface': [
            'error',
            {
                'allowSingleExtends': true
            }
        ],
        '@typescript-eslint/indent': [
            'error',
            4,
            {
                'SwitchCase': 1
            }
        ],
        /* FIXME we should enable the class-name-casing rule in the future */
        '@typescript-eslint/class-name-casing': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/array-type': [
            'error',
            {
                'default': 'array-simple',
                'read-only': 'array-simple'
            }
        ],
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                'vars': 'all',
                'args': 'after-used',
                'ignoreRestSiblings': true,
                'caughtErrors': 'all'
            }
        ],
        /* react */
        'react/no-array-index-key': 'off',
        'react/jsx-filename-extension': [
            'error',
            {
                'extensions': [
                    '.jsx',
                    '.tsx'
                ]
            }
        ],
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-wrap-multilines': 'error',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/destructuring-assignment': 'off',
        'react/style-prop-object': 'off',
        'react/function-component-definition': 'off',
        'react/jsx-no-duplicate-props': [
            'error',
            {
                'ignoreCase': false
            }
        ],
        'react/jsx-indent': [
            'error',
            4
        ],
        'react/jsx-indent-props': [
            'error',
            4
        ],
        'react/jsx-boolean-value': [
            'warn',
            'never'
        ],
        /* react-hooks */
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        /* jsx/a11y */
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        /* import */
        'import/prefer-default-export': 'off',
        'import/no-extraneous-dependencies': [
            'error', {
                'devDependencies': false,
                'optionalDependencies': false,
                'peerDependencies': false
            }
        ],
        'import/order': [
            'error',
            {
                'newlines-between': 'always'
            }
        ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                'js': 'never',
                'jsx': 'never',
                'ts': 'never',
                'tsx': 'never'
            }
        ]
    }
}
