module.exports = {
    extends: 'stylelint-config-standard',
    rules: {
        indentation: [
            4,
            {
                "except": ["block"],
                "message": "Please use 2 spaces for indentation.",
                "severity": "warning"
            }
        ],
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ["global"]
            }
        ]
    }
}
