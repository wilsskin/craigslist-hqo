import { useState, useRef, useEffect } from 'react'
import { Search, X, MapPin } from 'lucide-react'

/** Bar expand/collapse: slightly longer for a calm, modern feel (Material medium4) */
const TRANSITION_MS = 400
/** Gentle ease-out — smooth deceleration, no abrupt stop (cleaner feel) */
const EASE_OUT = 'cubic-bezier(0.12, 0.6, 0.28, 1)'
const ZONE_MIN_WIDTH = '100px'
const BORDER_FOCUS = '#BEBEBE'
const BORDER_DEFAULT = '#E2E2E2'

interface CombinedSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  locationLabel: string
  onLocationClick: () => void
  onSearchSubmit?: () => void
  isLocationModalOpen?: boolean
  /** When true, bar stays expanded and location shows black until user clicks outside bar */
  locationJustApplied?: boolean
  onLocationHighlightDismiss?: () => void
}

export function CombinedSearchBar({
  searchQuery,
  onSearchChange,
  locationLabel,
  onLocationClick,
  onSearchSubmit,
  isLocationModalOpen = false,
  locationJustApplied = false,
  onLocationHighlightDismiss,
}: CombinedSearchBarProps) {
  const [barHovered, setBarHovered] = useState(false)
  const [hoverLocation, setHoverLocation] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const isExpanded =
    barHovered ||
    searchQuery.length > 0 ||
    isLocationModalOpen ||
    isSearchFocused ||
    locationJustApplied

  // When location was just applied, dismiss highlight on click outside the bar
  useEffect(() => {
    if (!locationJustApplied || !onLocationHighlightDismiss) return
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (barRef.current?.contains(target)) return
      onLocationHighlightDismiss()
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [locationJustApplied, onLocationHighlightDismiss])

  return (
    <div
      ref={barRef}
      data-testid="combined-search-bar"
      className="w-full grid items-center"
      style={{
        gridTemplateColumns: `minmax(${ZONE_MIN_WIDTH}, 1fr) 1px minmax(${ZONE_MIN_WIDTH}, 1fr) auto`,
        maxWidth: isExpanded ? '352px' : '276px',
        height: '44px',
        border: `1px solid ${isSearchFocused ? BORDER_FOCUS : BORDER_DEFAULT}`,
        borderRadius: '32px',
        backgroundColor: '#FFFFFF',
        transition: `max-width ${TRANSITION_MS}ms ${EASE_OUT}, border-color 150ms ${EASE_OUT}`,
      }}
      onMouseEnter={() => setBarHovered(true)}
      onMouseLeave={() => setBarHovered(false)}
    >
      {/* Left zone: search input */}
      <div
        className="relative flex min-w-0 items-center"
        style={{
          height: '44px',
          paddingLeft: '16px',
          paddingRight: isExpanded ? 0 : '8px',
        }}
      >
        <input
          type="text"
          data-testid="combined-search-input"
          placeholder="search craigslist"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit()
          }}
          className="relative z-10 flex-1 min-w-0 outline-none bg-transparent border-none placeholder:text-[#727272]"
          style={{
            height: '100%',
            padding: 0,
            margin: 0,
            border: 0,
            fontFamily: '"Open Sans", sans-serif',
            fontSize: '14px',
            lineHeight: '44px',
            color: 'var(--color-text-primary)',
            width: '100%',
            background: 'transparent',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            data-testid="combined-search-clear"
            className="relative z-10 flex shrink-0 items-center justify-center cursor-pointer border-none bg-transparent p-0 self-center"
            style={{
              width: '44px',
              height: '44px',
              minHeight: '44px',
              color: '#727272',
            }}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Divider: grid column is 1px wide, vertically centered */}
      <div
        className="self-center"
        style={{
          width: '1px',
          height: '20px',
          backgroundColor: '#EEEEEE',
          justifySelf: 'center',
        }}
      />

      {/* Right zone: location — icon and label grey by default, black on hover */}
      <div
        className="relative flex min-w-0 items-center"
        style={{ minWidth: 0, height: '44px' }}
        onMouseEnter={() => setHoverLocation(true)}
        onMouseLeave={() => setHoverLocation(false)}
      >
        <button
          type="button"
          data-testid="combined-search-location"
          className="relative z-10 flex min-w-0 cursor-pointer items-center border-none bg-transparent p-0 outline-none"
          style={{
            width: '100%',
            minWidth: 0,
            height: '44px',
            gap: '4px',
            justifyContent: 'flex-start',
            paddingLeft: '8px',
            paddingRight: '16px',
            backgroundColor: 'transparent',
            borderRadius: 0,
          }}
          onClick={onLocationClick}
        >
          <MapPin
            size={14}
            style={{
              color: hoverLocation || locationJustApplied ? '#191919' : '#727272',
              flexShrink: 0,
              display: 'block',
              transition: 'color 150ms cubic-bezier(0.05, 0.7, 0.1, 1)',
            }}
          />
          <span
            className="min-w-0 truncate text-left"
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '14px',
              lineHeight: 1,
              color: hoverLocation || locationJustApplied ? '#191919' : '#727272',
              transition: 'color 150ms cubic-bezier(0.05, 0.7, 0.1, 1)',
            }}
          >
            {locationLabel}
          </span>
        </button>
      </div>

      {/* Search submit: smooth reveal when expanded. minWidth:0 when collapsed so this item takes no space and left/right zones stay equal width. */}
      <button
        type="button"
        data-testid="combined-search-submit"
        className="relative z-10 flex shrink-0 cursor-pointer items-center justify-center overflow-hidden border-none bg-transparent p-0 self-center"
        style={{
          width: isExpanded ? 32 : 0,
          minWidth: isExpanded ? 32 : 0,
          height: '32px',
          marginRight: isExpanded ? 8 : 0,
          marginLeft: isExpanded ? 4 : 0,
          opacity: isExpanded ? 1 : 0,
          borderRadius: '50%',
          backgroundColor: 'var(--color-link-default)',
          transform: 'translateY(-1px)',
          transition: `width ${TRANSITION_MS}ms ${EASE_OUT}, min-width ${TRANSITION_MS}ms ${EASE_OUT}, opacity ${TRANSITION_MS}ms ${EASE_OUT}, margin ${TRANSITION_MS}ms ${EASE_OUT}`,
        }}
        onClick={onSearchSubmit}
        aria-label="Search"
      >
        <Search size={14} style={{ color: '#FFFFFF', flexShrink: 0, display: 'block' }} />
      </button>
    </div>
  )
}
