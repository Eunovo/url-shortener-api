import { FieldErrors } from "tsoa";

const DUPLICATE_KEY_ERROR = 11000;

export function parseError(error: any): FieldErrors {
    let errors: FieldErrors = {};

    if (error.code === DUPLICATE_KEY_ERROR) {
        errors = Object.keys(error.keyValue).reduce((acc: any, key: string) => {
            const value = error.keyValue[key];
            return { ...acc, [key]: `"${value}" already exists` }
        }, {});
    }

    return errors;
}
