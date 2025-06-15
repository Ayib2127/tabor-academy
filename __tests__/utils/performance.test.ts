import '@testing-library/jest-dom'
import { describe, it, expect, jest } from '@jest/globals'
import { trackPerformance, measurePerformance } from '@/lib/utils/performance'

describe('Performance Monitoring', () => {
  it('tracks performance of async function', async () => {
    const mockFn = jest.fn().mockResolvedValue('test')
    const result = await trackPerformance('test', mockFn as () => Promise<string>)
    expect(result).toBe('test')
    expect(mockFn).toHaveBeenCalled()
  })

  it('measures performance duration', () => {
    const measurement = measurePerformance('test' as const)
    const duration = measurement.end()
    expect(typeof duration).toBe('number')
    expect(duration).toBeGreaterThanOrEqual(0)
  })

  it('sanitizes input correctly', () => {
    const maliciousHtml = '<img src="x">'
    expect(sanitizeInput(maliciousHtml)).toBe('<img src="x">')
  })
}) 