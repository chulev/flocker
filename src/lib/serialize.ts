export const formDataToValues = (formData: FormData) =>
  Object.fromEntries(formData.entries())

export const valuesToFormData = <T extends object>(values: T) => {
  const formData = new FormData()

  Object.entries(values).forEach(([key, value]) => {
    formData.append(key, value)
  })

  return formData
}
