import { formatDate, getTimeAgo, getDurationString } from '@/lib/utils/date-formatter'
import { jest, describe, it, expect } from '@jest/globals'

describe('Date Formatting Utils', () => {
  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2024-02-28T14:30:00')
      expect(formatDate(date)).toBe('February 28, 2024')
    })

    it('handles invalid dates', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
      expect(formatDate('invalid')).toBe('')
    })
  })

  describe('getTimeAgo', () => {
    it('returns correct time ago string', () => {
      const now = new Date()
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      expect(getTimeAgo(fiveMinutesAgo)).toBe('5 minutes ago')
      expect(getTimeAgo(oneHourAgo)).toBe('1 hour ago')
      expect(getTimeAgo(oneDayAgo)).toBe('1 day ago')
    })

    it('handles future dates', () => {
      const future = new Date(Date.now() + 24 * 60 * 60 * 1000)
      expect(getTimeAgo(future)).toBe('in 1 day')
    })

    it('handles invalid dates', () => {
      expect(getTimeAgo(null)).toBe('')
      expect(getTimeAgo(undefined)).toBe('')
      expect(getTimeAgo('invalid')).toBe('')
    })
  })

  describe('getDurationString', () => {
    it('formats duration in minutes correctly', () => {
      expect(getDurationString(30)).toBe('30 mins')
      expect(getDurationString(60)).toBe('1 hour')
      expect(getDurationString(90)).toBe('1 hour 30 mins')
    })

    it('handles zero and negative values', () => {
      expect(getDurationString(0)).toBe('0 mins')
      expect(getDurationString(-30)).toBe('0 mins')
    })

    it('formats large durations correctly', () => {
      expect(getDurationString(1440)).toBe('1 day')
      expect(getDurationString(2880)).toBe('2 days')
      expect(getDurationString(2460)).toBe('1 day 17 hours')
    })
  })
})