const DUPLICATE_KEY_ERROR = 11000;

export function parseError(error: any) {
    let errors: any[] = [];

    if (error.errors) {
        errors = errors.concat(
            Object.keys(error.errors).map(key => {
                const value = error.errors[key];
                const message: any = ({
                    required: `${key} is required`
                } as any)[value.kind];
                return { field: key, message }
            })
        );
    }

    if (error.code === DUPLICATE_KEY_ERROR) {
        errors = errors.concat(
            Object.keys(error.keyValue).map(key => {
                const value = error.keyValue[key];
                return { field: key, message: `"${value}" already exists` }
            })
        );
    }

    return errors;
}
