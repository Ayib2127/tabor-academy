import { calculateProgress, getCompletionStatus } from '@/lib/utils'

describe('Progress Calculator Utils', () => {
  describe('calculateProgress', () => {
    it('calculates percentage correctly', () => {
      expect(calculateProgress(3, 10)).toBe(30)
      expect(calculateProgress(7, 10)).toBe(70)
      expect(calculateProgress(10, 10)).toBe(100)
    })

    it('handles edge cases', () => {
      expect(calculateProgress(0, 10)).toBe(0)
      expect(calculateProgress(15, 10)).toBe(100)
      expect(calculateProgress(5, 0)).toBe(0)
    })

    it('rounds to nearest integer', () => {
      expect(calculateProgress(2, 3)).toBe(67)
      expect(calculateProgress(1, 3)).toBe(33)
    })
  })

  describe('getCompletionStatus', () => {
    it('returns correct status based on progress', () => {
      expect(getCompletionStatus(0)).toBe('not-started')
      expect(getCompletionStatus(30)).toBe('in-progress')
      expect(getCompletionStatus(100)).toBe('completed')
    })

    it('handles edge cases', () => {
      expect(getCompletionStatus(-10)).toBe('not-started')
      expect(getCompletionStatus(150)).toBe('completed')
    })

    it('categorizes progress ranges correctly', () => {
      expect(getCompletionStatus(1)).toBe('in-progress')
      expect(getCompletionStatus(99)).toBe('in-progress')
    })
  })
})