// Mock service for the frontend-only phase. Replace these functions with Axios
// requests to the future Express/JWT API; no credentials are verified here.
const simulateRequest = () => new Promise((resolve) => window.setTimeout(resolve, 650))

const createMockUser = ({ email, fullName, role = 'student' }) => ({
  email,
  fullName: fullName || email.split('@')[0],
  role,
})

export async function mockLogin({ email }) {
  await simulateRequest()
  return createMockUser({ email })
}

export async function mockRegister({ email, fullName, role }) {
  await simulateRequest()
  return createMockUser({ email, fullName, role })
}

export async function mockRequestPasswordReset() {
  await simulateRequest()
  return { message: 'If this account existed, a reset link would be sent.' }
}
