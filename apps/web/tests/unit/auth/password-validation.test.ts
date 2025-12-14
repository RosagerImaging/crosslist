import { describe, it, expect } from 'vitest'
import { passwordSchema } from '@/lib/schemas/auth'

describe('Password Validation', () => {
  it('should reject passwords shorter than 8 characters', () => {
    const result = passwordSchema.safeParse('Short1!')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 8 characters')
    }
  })

  it('should reject passwords without uppercase letters', () => {
    const result = passwordSchema.safeParse('lowercase1!')
    expect(result.success).toBe(false)
  })

  it('should reject passwords without lowercase letters', () => {
    const result = passwordSchema.safeParse('UPPERCASE1!')
    expect(result.success).toBe(false)
  })

  it('should reject passwords without numbers', () => {
    const result = passwordSchema.safeParse('NoNumbers!')
    expect(result.success).toBe(false)
  })

  it('should reject passwords without special characters', () => {
    const result = passwordSchema.safeParse('NoSpecial1')
    expect(result.success).toBe(false)
  })

  it('should accept valid passwords', () => {
    const result = passwordSchema.safeParse('ValidPass1!')
    expect(result.success).toBe(true)
  })
})
