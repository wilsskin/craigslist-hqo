import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// JSDOM doesn’t implement canvas. Our app uses a canvas-backed measureText helper
// for the header location label, so tests need a minimal stub.
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: function getContext() {
    return {
      font: '',
      measureText: (text: string) => ({ width: text.length * 8 }),
    }
  },
})

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
