import { describe, it, expect } from 'vitest'
import { computeHeaderLocationLabel } from './locationLabel'
import type { City } from '@/data/types'
import type { MeasureTextFn } from './locationLabel'

/**
 * Mock measureText: returns ~8px per character.
 * Deterministic — no canvas dependency.
 */
const mockMeasure: MeasureTextFn = (text: string) => text.length * 8

/** Helper to build a City object */
const city = (id: string, name: string): City => ({ id, name })

const sf = city('city_sf', 'San Francisco')
const boston = city('city_boston', 'Boston')
const nyc = city('city_nyc', 'New York City')

describe('computeHeaderLocationLabel', () => {
  it('returns default label when selectedCities is empty', () => {
    const result = computeHeaderLocationLabel([], 10, false, 240, mockMeasure)
    expect(result).toBe('select location')
  })

  it('returns city name with no radius suffix when hasEditedRadius is false', () => {
    const result = computeHeaderLocationLabel(
      [sf],
      10,
      false,
      240,
      mockMeasure,
    )
    expect(result).toBe('San Francisco')
  })

  it('returns comma-separated list in selection order when it fits', () => {
    // "San Francisco, Boston" = 22 chars * 8 = 176px, fits in 240px
    const result = computeHeaderLocationLabel(
      [sf, boston],
      10,
      false,
      240,
      mockMeasure,
    )
    expect(result).toBe('San Francisco, Boston')
  })

  it('returns overflow fallback "firstCity, n more" when full list exceeds maxWidth', () => {
    // "San Francisco, Boston, New York City" = 36 chars * 8 = 288px, exceeds 240px
    const result = computeHeaderLocationLabel(
      [sf, boston, nyc],
      10,
      false,
      240,
      mockMeasure,
    )
    expect(result).toBe('San Francisco, 2 more')
  })

  it('returns overflow plus radius when hasEditedRadius is true and list overflows', () => {
    // Full list with suffix would overflow; fallback + suffix
    const result = computeHeaderLocationLabel(
      [sf, boston, nyc],
      20,
      true,
      240,
      mockMeasure,
    )
    expect(result).toBe('San Francisco, 2 more ± 20 mi')
  })

  it('returns full list plus radius suffix when it fits', () => {
    // "San Francisco, Boston ± 10 mi" = 29 chars * 8 = 232px, fits in 240px
    const result = computeHeaderLocationLabel(
      [sf, boston],
      10,
      true,
      240,
      mockMeasure,
    )
    expect(result).toBe('San Francisco, Boston ± 10 mi')
  })

  it('returns single city plus radius suffix when hasEditedRadius is true', () => {
    const result = computeHeaderLocationLabel(
      [boston],
      25,
      true,
      240,
      mockMeasure,
    )
    expect(result).toBe('Boston ± 25 mi')
  })
})

// ── Sprint 6 regression: locked formatting rules ─────────────────────

describe('Sprint 6 — overflow fallback format', () => {
  /**
   * Use a narrow measure function that forces overflow for any multi-city join.
   * Forces anything > 100px to overflow.
   */
  const narrowMeasure: MeasureTextFn = (text: string) => text.length * 10

  it('overflow forces fallback: Boston first, 3 cities => "Boston, 2 more"', () => {
    // "Boston, San Francisco, New York City" = 37 chars * 10 = 370px >> 200px
    const result = computeHeaderLocationLabel(
      [boston, sf, nyc],
      10,
      false,
      200,
      narrowMeasure,
    )
    expect(result).toBe('Boston, 2 more')
  })

  it('overflow plus edited radius => "Boston, 2 more ± 20 mi"', () => {
    const result = computeHeaderLocationLabel(
      [boston, sf, nyc],
      20,
      true,
      200,
      narrowMeasure,
    )
    expect(result).toBe('Boston, 2 more ± 20 mi')
  })

  it('no suffix by default: hasEditedRadius false, radius 10 => no "±"', () => {
    const result = computeHeaderLocationLabel(
      [boston],
      10,
      false,
      240,
      mockMeasure,
    )
    expect(result).toBe('Boston')
    expect(result).not.toContain('±')
  })

  it('selection order preserved in non-overflow join', () => {
    // "Boston, San Francisco, New York City" = 37 chars * 8 = 296px
    // With a wide enough maxWidth it fits
    const result = computeHeaderLocationLabel(
      [boston, sf, nyc],
      10,
      false,
      400,
      mockMeasure,
    )
    expect(result).toBe('Boston, San Francisco, New York City')
  })
})
