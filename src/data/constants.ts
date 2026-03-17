import type { City } from './types'

/**
 * Hardcoded city list fixture.
 * IDs are stable and not derived from display labels.
 */
export const CITIES: City[] = [
  { id: 'city_sf', name: 'San Francisco' },
  { id: 'city_boston', name: 'Boston' },
  { id: 'city_nyc', name: 'New York City' },
  { id: 'city_la', name: 'Los Angeles' },
  { id: 'city_chicago', name: 'Chicago' },
  { id: 'city_houston', name: 'Houston' },
  { id: 'city_phoenix', name: 'Phoenix' },
  { id: 'city_philly', name: 'Philadelphia' },
  { id: 'city_sandiego', name: 'San Diego' },
  { id: 'city_dallas', name: 'Dallas' },
  { id: 'city_sanjose', name: 'San Jose' },
]

/** Radius options in miles */
export const RADIUS_OPTIONS = [5, 8, 10, 25, 50, 100] as const

/** Default radius in miles (Sprint 1 default per sprint spec) */
export const DEFAULT_RADIUS_MILES = 10

/**
 * City location presets for map visualization.
 * Contains latitude, longitude, and default zoom level for each city.
 */
export const CITY_PRESETS = {
  city_boston: {
    lat: 42.3601,
    lng: -71.0589,
    defaultZoom: 11,
  },
  city_nyc: {
    lat: 40.7128,
    lng: -74.006,
    defaultZoom: 11,
  },
  city_sf: {
    lat: 37.7749,
    lng: -122.4194,
    defaultZoom: 11,
  },
  city_la: {
    lat: 34.0522,
    lng: -118.2437,
    defaultZoom: 11,
  },
  city_chicago: {
    lat: 41.8781,
    lng: -87.6298,
    defaultZoom: 11,
  },
  city_houston: {
    lat: 29.7604,
    lng: -95.3698,
    defaultZoom: 11,
  },
  city_phoenix: {
    lat: 33.4484,
    lng: -112.074,
    defaultZoom: 11,
  },
  city_philly: {
    lat: 39.9526,
    lng: -75.1652,
    defaultZoom: 11,
  },
  city_sanantonio: {
    lat: 29.4241,
    lng: -98.4936,
    defaultZoom: 11,
  },
  city_sandiego: {
    lat: 32.7157,
    lng: -117.1611,
    defaultZoom: 11,
  },
  city_dallas: {
    lat: 32.7767,
    lng: -96.797,
    defaultZoom: 11,
  },
  city_sanjose: {
    lat: 37.3382,
    lng: -121.8863,
    defaultZoom: 11,
  },
} as const
