// validator receives the request and returns an array of readable validation errors.
export function validate(validator) {
  return (request, response, next) => {
    const errors = validator(request) || []
    if (errors.length) {
      return response.status(400).json({
        success: false,
        error: 'Validation failed.',
        details: errors,
      })
    }
    return next()
  }
}
