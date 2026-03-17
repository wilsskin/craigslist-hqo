import { useState, useRef, useEffect } from 'react'
import { Search, X, MapPin } from 'lucide-react'

const TRANSITION_MS = 300
const EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)'
const ZONE_MIN_WIDTH = '100px'
/** When expanded: search button width (32) + marginLeft (4) + marginRight (8) — location hover extends this far right to fill the bar */
const EXPANDED_SEARCH_BUTTON_SPACE = 44

interface CombinedSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  locationLabel: string
  onLocationClick: () => void
  onSearchSubmit?: () => void
  isLocationModalOpen?: boolean
}

export function CombinedSearchBar({
  searchQuery,
  onSearchChange,
  locationLabel,
  onLocationClick,
  onSearchSubmit,
  isLocationModalOpen = false,
}: CombinedSearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoverSearch, setHoverSearch] = useState(false)
  const [hoverLocation, setHoverLocation] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isExpanded) return

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (barRef.current?.contains(target)) return
      if (isLocationModalOpen) return
      setIsExpanded(false)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsExpanded(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isExpanded, isLocationModalOpen])

  return (
    <div
      ref={barRef}
      data-testid="combined-search-bar"
      className="w-full grid items-center"
      style={{
        gridTemplateColumns: `minmax(${ZONE_MIN_WIDTH}, 1fr) 1px minmax(${ZONE_MIN_WIDTH}, 1fr) auto`,
        maxWidth: isExpanded ? '352px' : '276px',
        height: '44px',
        border: '1px solid #EEEEEE',
        borderRadius: '32px',
        backgroundColor: '#FFFFFF',
        transition: `max-width ${TRANSITION_MS}ms ${EASE_OUT}`,
      }}
    >
      {/* Left zone: 1fr so always same width as right zone. Hover layer from left edge to center, left rounded. */}
      <div
        className="relative flex min-w-0 items-center"
        style={{
          height: '44px',
          paddingLeft: '16px',
          paddingRight: isExpanded ? 0 : '8px',
        }}
        onMouseEnter={() => setHoverSearch(true)}
        onMouseLeave={() => setHoverSearch(false)}
      >
        <span
          className="pointer-events-none absolute"
          style={{
            top: -1,
            left: -1,
            right: -1,
            bottom: 1,
            borderRadius: '32px 0 0 32px',
            backgroundColor: '#EEEEEE',
            opacity: hoverSearch && !isSearchFocused ? 1 : 0,
            transition: 'opacity 100ms cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 1,
          }}
        />
        <input
          type="text"
          data-testid="combined-search-input"
          placeholder="search anything"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => {
            setIsExpanded(true)
            setIsSearchFocused(true)
          }}
          onBlur={() => setIsSearchFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit()
          }}
          className="relative z-10 flex-1 min-w-0 outline-none bg-transparent border-none"
          style={{
            display: 'block',
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            fontFamily: '"Open Sans", sans-serif',
            fontSize: '14px',
            color: 'var(--color-text-primary)',
            width: '100%',
            background: 'transparent',
            outline: 'none',
          }}
        />
        {searchQuery && (
          <button
            type="button"
            data-testid="combined-search-clear"
            className="relative z-10 flex shrink-0 items-center justify-center cursor-pointer border-none bg-transparent p-0"
            style={{
              width: '44px',
              height: '44px',
              color: '#727272',
            }}
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Divider: grid column is 1px wide */}
      <div
        style={{
          width: '1px',
          height: '20px',
          backgroundColor: '#EEEEEE',
          justifySelf: 'center',
        }}
      />

      {/* Right zone: 1fr so always same width as left zone. Hover layer from center to right edge, right rounded. */}
      <div
        className="relative flex min-w-0"
        style={{ minWidth: 0 }}
        onMouseEnter={() => setHoverLocation(true)}
        onMouseLeave={() => setHoverLocation(false)}
      >
        <span
          className="pointer-events-none absolute"
          style={{
            top: -1,
            left: -1,
            right: isExpanded ? -EXPANDED_SEARCH_BUTTON_SPACE : -1,
            bottom: 1,
            borderRadius: '0 32px 32px 0',
            backgroundColor: '#EEEEEE',
            opacity: hoverLocation ? 1 : 0,
            transition: 'opacity 100ms cubic-bezier(0.16, 1, 0.3, 1), right 200ms cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 1,
          }}
        />
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
          onClick={() => {
            setIsExpanded(true)
            onLocationClick()
          }}
        >
          <MapPin size={14} style={{ color: '#191919', flexShrink: 0 }} />
          <span
            className="min-w-0 truncate text-left"
            style={{
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '14px',
              lineHeight: 1,
              color: '#191919',
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
        className="relative z-10 flex shrink-0 cursor-pointer items-center justify-center overflow-hidden border-none bg-transparent p-0"
        style={{
          width: isExpanded ? 32 : 0,
          minWidth: isExpanded ? 32 : 0,
          height: '32px',
          marginRight: isExpanded ? 8 : 0,
          marginLeft: isExpanded ? 4 : 0,
          opacity: isExpanded ? 1 : 0,
          borderRadius: '50%',
          backgroundColor: 'var(--color-link-default)',
          transition: `width ${TRANSITION_MS}ms ${EASE_OUT}, min-width ${TRANSITION_MS}ms ${EASE_OUT}, opacity ${TRANSITION_MS}ms ${EASE_OUT}, margin ${TRANSITION_MS}ms ${EASE_OUT}, background-color 100ms ${EASE_OUT}`,
        }}
        onMouseEnter={(e) => {
          if (isExpanded) e.currentTarget.style.backgroundColor = '#0019b8'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-link-default)'
        }}
        onClick={onSearchSubmit}
        aria-label="Search"
      >
        <Search size={14} style={{ color: '#FFFFFF', flexShrink: 0 }} />
      </button>
    </div>
  )
}
