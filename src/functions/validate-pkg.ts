// eslint-disable-next-line import/no-extraneous-dependencies
var validate = require("validate-npm-package-name")


export function validateNpmName(name: string): boolean {

    const nameValidation = validate(name)

    if (nameValidation.validForNewPackages) {
        return true
    }

    return false
}