export function validateRequired(value: string, field: string): string | null {
  if (!value || !value.trim()) return `${field} is required`
  return null
}

export function validateEmail(email: string): string | null {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return null
}

export function validateForm(
  fields: Record<string, string>,
  rules: Record<string, (value: string) => string | null>
): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const [field, value] of Object.entries(fields)) {
    const rule = rules[field]
    if (rule) {
      const error = rule(value)
      if (error) errors[field] = error
    }
  }
  return errors
}
