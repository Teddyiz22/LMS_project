export function errorHandler(error, _request, response, _next) {
  const status = Number(error.status || error.statusCode) || 500
  const message = error.message || 'An unexpected server error occurred.'

  if (process.env.NODE_ENV !== 'production') {
    console.error(error)
  }

  response.status(status).json({
    success: false,
    error: status >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected server error occurred.'
      : message,
  })
}
