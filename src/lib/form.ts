import {ValidationError} from 'lib/api-client'
import {DeepMap, FieldError} from 'react-hook-form'

export type ReactHookFormErrors = DeepMap<Record<string, any>, FieldError>

/**
 * Helper that takes form errors from react-hook-form, and response errors
 * from the server, and returns a relevant error message for a given
 * field.
 *
 * @param errors
 * @param key
 */
export const fieldError = <T>(
  key: string & keyof T,
  errors: {
    form: ReactHookFormErrors
    server: ValidationError<T>
  },
) => {
  if (errors.form[key]) {
    return errors.form[key].message
  }

  if (errors.server && errors.server.errors) {
    return errors.server.errors[key]
  }
}
