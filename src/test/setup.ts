import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('maplibre-gl', () => ({
  default: {
    Map: class {
      on() { return this }
      remove() {}
      getCanvas() { return document.createElement('canvas') }
      resize() {}
      setZoom() { return this }
      setCenter() { return this }
      flyTo() { return this }
      fitBounds() { return this }
      getZoom() { return 10 }
      getSource() { return null }
      addSource() {}
      addLayer() {}
      removeLayer() {}
      removeSource() {}
      getLayer() { return null }
      off() {}
      once() {}
      loaded() { return true }
      getBounds() { return { getCenter: () => ({ lat: 0, lng: 0 }) } }
      getContainer() { return document.createElement('div') }
      setPaintProperty() {}
    },
    Marker: class {
      setLngLat() { return this }
      addTo() { return this }
      remove() {}
    },
    LngLatBounds: class {
      extend() { return this }
    },
  },
}))
