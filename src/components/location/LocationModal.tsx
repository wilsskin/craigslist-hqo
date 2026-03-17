import { useEffect, useState } from 'react'
import type { City } from '@/data/types'
import { CITIES, RADIUS_OPTIONS } from '@/data/constants'
import { Search, X, ChevronDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { LocationMap } from './LocationMap'

const MAX_CITIES = 3
/** Match CombinedSearchBar focus border colors and easing */
const MODAL_SEARCH_BORDER_FOCUS = '#BEBEBE'
const MODAL_SEARCH_BORDER_DEFAULT = '#E2E2E2'
const MODAL_SEARCH_BORDER_EASE = 'cubic-bezier(0.12, 0.6, 0.28, 1)'

interface LocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedCities: City[]
  setSelectedCities: React.Dispatch<React.SetStateAction<City[]>>
  radiusMiles: number
  setRadiusMiles: React.Dispatch<React.SetStateAction<number>>
  hasEditedRadius: boolean
  setHasEditedRadius: React.Dispatch<React.SetStateAction<boolean>>
  modalCityQuery: string
  setModalCityQuery: React.Dispatch<React.SetStateAction<string>>
  /** Called when Apply is clicked (after state is applied and modal closes) */
  onApply?: () => void
}

export function LocationModal({
  open,
  onOpenChange,
  selectedCities,
  setSelectedCities,
  radiusMiles,
  setRadiusMiles,
  hasEditedRadius,
  setHasEditedRadius,
  modalCityQuery,
  setModalCityQuery,
  onApply,
}: LocationModalProps) {
  // Draft state - only applied when "Apply" is clicked
  const [draftSelectedCities, setDraftSelectedCities] = useState<City[]>(selectedCities)
  const [draftRadiusMiles, setDraftRadiusMiles] = useState(radiusMiles)
  const [draftHasEditedRadius, setDraftHasEditedRadius] = useState(hasEditedRadius)
  const [draftModalCityQuery, setDraftModalCityQuery] = useState(modalCityQuery)
  const [isModalSearchFocused, setIsModalSearchFocused] = useState(false)

  // Initialize draft state when modal opens
  useEffect(() => {
    if (open) {
      setDraftSelectedCities(selectedCities)
      setDraftRadiusMiles(radiusMiles)
      setDraftHasEditedRadius(hasEditedRadius)
      setDraftModalCityQuery(modalCityQuery)
    }
  }, [open, selectedCities, radiusMiles, hasEditedRadius, modalCityQuery])

  // Reset draft state when modal closes (if not applied)
  useEffect(() => {
    if (!open) {
      setDraftSelectedCities(selectedCities)
      setDraftRadiusMiles(radiusMiles)
      setDraftHasEditedRadius(hasEditedRadius)
      setDraftModalCityQuery(modalCityQuery)
    }
  }, [open, selectedCities, radiusMiles, hasEditedRadius, modalCityQuery])

  const selectedIds = new Set(draftSelectedCities.map((c) => c.id))
  const atMax = draftSelectedCities.length >= MAX_CITIES

  // Filter city list: exclude already-selected, match by query substring
  const filteredCities = CITIES.filter((city) => {
    if (selectedIds.has(city.id)) return false
    if (draftModalCityQuery.trim() === '') return true
    return city.name.toLowerCase().includes(draftModalCityQuery.toLowerCase())
  })

  function handleAddCity(city: City) {
    if (atMax || selectedIds.has(city.id)) return
    setDraftSelectedCities((prev) => [...prev, city])
  }

  function handleRemoveCity(cityId: string) {
    setDraftSelectedCities((prev) => prev.filter((c) => c.id !== cityId))
  }

  function handleRadiusChange(value: number) {
    setDraftRadiusMiles(value)
    setDraftHasEditedRadius(true)
  }

  function handleApply() {
    // Apply draft changes to actual state
    setSelectedCities(draftSelectedCities)
    setRadiusMiles(draftRadiusMiles)
    setHasEditedRadius(draftHasEditedRadius)
    setModalCityQuery('') // Clear search query on apply
    // Close modal directly without resetting draft state
    onOpenChange(false)
    onApply?.()
  }

  function handleClose() {
    // Reset draft state to current actual state (discard changes)
    setDraftSelectedCities(selectedCities)
    setDraftRadiusMiles(radiusMiles)
    setDraftHasEditedRadius(hasEditedRadius)
    setDraftModalCityQuery(modalCityQuery)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[628px] p-0 gap-0 overflow-hidden border-0"
        style={{
          borderRadius: 'var(--radius-card)',
          fontFamily: '"Open Sans", sans-serif',
          border: 'none', // Remove border around entire modal
        }}
        showCloseButton={true}
        data-testid="location-modal"
      >
        {/* Horizontal line aligned with top of map */}
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'var(--color-border-default)',
            zIndex: 1,
          }}
        />
        <div className="flex min-h-[440px] relative">
          {/* Left panel: search, city list, chips, radius, actions */}
          <div
            className="flex flex-col"
            style={{
              backgroundColor: 'var(--color-bg-page)',
              padding: '24px',
              width: '50%', // Explicitly set to 50% to account for padding
              boxSizing: 'border-box',
            }}
          >
            <DialogHeader
              className="mb-4"
              style={{
                marginTop: '-8px', // Move up to align with X button (X is at 16px, panel padding is 24px, so move up 8px)
                paddingTop: '0px',
              }}
            >
              <DialogTitle
                className="text-lg font-bold"
                style={{
                  fontFamily: '"Open Sans", sans-serif',
                  color: 'var(--color-text-primary)',
                  lineHeight: '1',
                  paddingTop: '0px',
                  marginTop: '0px',
                }}
              >
                Location
              </DialogTitle>
              <DialogDescription className="sr-only">
                Select up to 3 cities and set a search radius
              </DialogDescription>
            </DialogHeader>

            {/* City search input - matches CombinedSearchBar focus/blur border behavior */}
            <div
              className="flex items-center"
              style={{
                width: '100%',
                height: '44px',
                border: `1px solid ${isModalSearchFocused ? MODAL_SEARCH_BORDER_FOCUS : MODAL_SEARCH_BORDER_DEFAULT}`,
                borderRadius: '22px',
                backgroundColor: '#FFFFFF',
                marginTop: '16px',
                marginBottom: draftModalCityQuery.trim() !== '' ? '4px' : '12px',
                boxSizing: 'border-box',
                transition: `border-color 150ms ${MODAL_SEARCH_BORDER_EASE}`,
              }}
            >
              <span
                className="flex items-center justify-center shrink-0"
                data-testid="modal-search-icon"
                style={{
                  paddingLeft: '16px',
                  color: 'var(--color-icon-default)',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search size={16} />
              </span>
              <input
                type="text"
                data-testid="modal-city-search"
                placeholder={draftSelectedCities.length > 0 ? 'add city' : 'Search by city'}
                value={draftModalCityQuery}
                onChange={(e) => setDraftModalCityQuery(e.target.value)}
                onFocus={() => setIsModalSearchFocused(true)}
                onBlur={() => setIsModalSearchFocused(false)}
                className="w-full outline-none bg-transparent box-border placeholder:text-[#727272]"
                style={{
                  height: '44px',
                  paddingLeft: '8px',
                  paddingRight: draftModalCityQuery ? '4px' : '12px',
                  paddingTop: 0,
                  paddingBottom: 0,
                  margin: 0,
                  border: 'none',
                  lineHeight: '44px',
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '14px',
                  color: 'var(--color-text-primary)',
                  background: 'transparent',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {draftModalCityQuery && (
                <button
                  type="button"
                  data-testid="modal-search-clear"
                  className="flex items-center justify-center shrink-0 cursor-pointer bg-transparent border-none p-0"
                  style={{
                    width: '44px',
                    height: '44px',
                    paddingRight: '10px',
                    color: 'var(--color-icon-default)',
                  }}
                  onClick={() => setDraftModalCityQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* City list - only show when typing */}
            {draftModalCityQuery.trim() !== '' && atMax && (
              <p
                className="text-sm py-2"
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: '24px',
                }}
                data-testid="modal-max-locations-message"
              >
                You can only choose 3 locations
              </p>
            )}
            {draftModalCityQuery.trim() !== '' && !atMax && filteredCities.length === 0 && (
              <p
                className="text-sm py-2"
                style={{
                  color: 'var(--color-text-secondary)',
                  marginBottom: '24px',
                }}
                data-testid="modal-city-list"
              >
                No matching cities
              </p>
            )}
            {draftModalCityQuery.trim() !== '' && !atMax && filteredCities.length > 0 && (
              <div
                className="flex min-h-0 flex-col gap-1"
                data-testid="modal-city-list"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-card)',
                  padding: '0px 0 0px 0',
                  maxHeight: '166px',
                  overflowY: 'auto',
                  marginBottom:
                    filteredCities.length === 1
                      ? '16px'
                      : filteredCities.length === 2
                        ? '20px'
                        : '24px',
                }}
              >
                {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      type="button"
                      data-testid={`city-option-${city.id}`}
                      disabled={atMax}
                      className="flex shrink-0 items-center justify-between px-3 text-sm text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        height: '44px',
                        minHeight: '44px',
                        flexShrink: 0,
                        lineHeight: 1,
                        borderRadius: '4px', /* smaller radius avoids hover fill slivers in corners */
                        border: 'none',
                        background: 'transparent',
                        fontFamily: '"Open Sans", sans-serif',
                        color: 'var(--color-text-primary)',
                        transitionDuration: 'var(--duration-fast)',
                      }}
                      onMouseEnter={(e) => {
                        if (!atMax)
                          e.currentTarget.style.backgroundColor =
                            'var(--color-bg-subtle)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      onClick={() => handleAddCity(city)}
                    >
                      {city.name}
                    </button>
                  ))}
              </div>
            )}

            {/* Selected locations chips */}
            <div
              className="mb-4"
              style={{
                marginTop: draftModalCityQuery.trim() === '' ? '0px' : '0px',
                // When city list is hidden, this section moves up naturally
                // When city list is shown, spacing is handled by city list margin-bottom
              }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Selected locations
              </p>
              <div
                className="flex flex-wrap gap-2"
                data-testid="modal-chips"
              >
                {draftSelectedCities.length === 0 ? (
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    No locations selected
                  </p>
                ) : (
                  draftSelectedCities.map((city) => (
                    <span
                      key={city.id}
                      data-testid={`chip-${city.id}`}
                      className="inline-flex items-center transition-colors"
                      style={{
                        border: '1px solid #E2E2E2',
                        borderRadius: 'var(--radius-chip)',
                        backgroundColor: '#EEEEEE',
                        color: 'var(--color-text-primary)',
                        fontFamily: '"Open Sans", sans-serif',
                        fontSize: '14px',
                        lineHeight: 1.2,
                        paddingLeft: '10px',
                        paddingRight: '4px',
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        gap: '4px',
                        transitionDuration: 'var(--duration-fast)',
                      }}
                    >
                      {city.name}
                      <button
                        type="button"
                        data-testid={`chip-remove-${city.id}`}
                        className="flex items-center justify-center cursor-pointer bg-transparent border-none p-0 shrink-0"
                        style={{
                          width: '20px',
                          height: '20px',
                          color: 'var(--color-text-secondary)',
                        }}
                        onClick={() => handleRemoveCity(city.id)}
                        aria-label={`Remove ${city.name}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Radius control */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-semibold"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Radius
                </p>
              </div>
              <div className="relative">
                <select
                  data-testid="radius-select"
                  value={draftRadiusMiles}
                  onChange={(e) => handleRadiusChange(Number(e.target.value))}
                  className="w-full text-sm cursor-pointer"
                  style={{
                    height: '44px',
                    border: '1px solid #e2e2e2',
                    borderRadius: 'var(--radius-card)',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.2,
                    color: 'var(--color-text-primary)',
                    backgroundColor: '#FFFFFF',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    paddingLeft: '12px',
                    paddingRight: '36px',
                    outline: 'none',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.border = '1px solid #BEBEBE'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid #E2E2E2'
                  }}
                >
                  {RADIUS_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r} miles
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Apply button */}
            <div className="mt-auto pt-2">
              <button
                type="button"
                data-testid="modal-apply"
                className="flex items-center justify-center w-full text-sm font-semibold text-white cursor-pointer transition-colors"
                style={{
                  height: '44px',
                  lineHeight: 1,
                  backgroundColor: 'var(--color-link-default)',
                  borderRadius: 'var(--radius-button)',
                  border: 'none',
                  fontFamily: '"Open Sans", sans-serif',
                  transitionDuration: 'var(--duration-fast)',
                  transitionProperty: 'background-color',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0018B8' // Darker blue, only affects background
                  e.currentTarget.style.color = 'white' // Keep text white
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-link-default)'
                  e.currentTarget.style.color = 'white' // Keep text white
                }}
                onClick={handleApply}
              >
                Update
              </button>
            </div>
          </div>

          {/* Right panel: map */}
          <div
            className="flex flex-col relative"
            style={{
              backgroundColor: 'var(--color-bg-page)',
              paddingTop: '48px', // Space for close button in top right
              width: '50%', // Explicitly set to 50% to match left panel
              boxSizing: 'border-box',
            }}
            data-testid="modal-map-placeholder"
          >
            <div
              className="flex-1 w-full"
              style={{
                minHeight: '200px',
              }}
            >
              {draftSelectedCities.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p
                    className="text-sm"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    No locations selected
                  </p>
                </div>
              ) : (
                <LocationMap
                  selectedCities={draftSelectedCities}
                  radiusMiles={draftRadiusMiles}
                  hasEditedRadius={draftHasEditedRadius}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
