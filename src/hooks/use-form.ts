import { useState, useTransition } from 'react'
import type { SafeParseError, ZodType } from 'zod'

import { valuesToFormData } from '@/lib/serialize'

export type Errors<T> = {
  [K in keyof T]?: string
}

export type Options = {
  validateOnChange?: boolean
  resetOnSubmit?: boolean
}

type FormState<T> = {
  values: T
  errors: Errors<T> & { submission?: string }
}

const getErrorMessages = <T>(result: SafeParseError<T>): Errors<T> => {
  return result.error.issues.reduce(
    (errors, { path, message }) => {
      const errorPath = path[0] as keyof T
      errors[errorPath] = message

      return errors
    },
    {} as Errors<T>
  )
}

const extractErrors = <T>(values: T, validationSchema: ZodType<T>) => {
  const result = validationSchema.safeParse(values)

  return result.success ? {} : getErrorMessages(result)
}

export const useForm = <T extends object>(
  initialValues: T,
  validationSchema: ZodType<T>,
  options: Options = { validateOnChange: false, resetOnSubmit: true }
) => {
  const [{ values, errors }, setFormState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
  })
  const [isSuccess, setSuccess] = useState(false)
  const [isSubmitting, startSubmission] = useTransition()
  const hasErrors = Object.values(errors).some(Boolean)

  const handleChange = (name: keyof T, value: T[keyof T]) => {
    setFormState((prevFormState) => {
      const newFormState = {
        ...prevFormState,
        values: { ...prevFormState.values, [name]: value },
      }

      if (options.validateOnChange) {
        return {
          ...newFormState,
          errors: extractErrors(newFormState.values, validationSchema),
        }
      }

      return newFormState
    })
  }

  const handleSubmit =
    (onSubmit: (data: FormData) => Promise<void>) => (e: React.FormEvent) => {
      e.preventDefault()

      const errors = extractErrors(values, validationSchema)
      const hasErrors = Object.keys(errors).length > 0

      setFormState((prevFormState) => ({
        ...prevFormState,
        errors: hasErrors ? errors : {},
      }))

      if (hasErrors) return

      const formData = valuesToFormData<T>(values)

      startSubmission(() => {
        onSubmit(formData)
          .then(() => {
            setSuccess(true)

            if (options.resetOnSubmit) {
              setFormState({ values: initialValues, errors: {} })
            }
          })
          .catch((error) => {
            setSuccess(false)
            setFormState((prevFormState) => ({
              ...prevFormState,
              errors: { submission: error.message },
            }))
          })
      })
    }

  return {
    values,
    errors,
    hasErrors,
    isSubmitting,
    isSuccess,
    handleChange,
    handleSubmit,
  }
}
