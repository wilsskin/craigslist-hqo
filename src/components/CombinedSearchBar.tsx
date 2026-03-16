import { Search, X, MapPin } from 'lucide-react'

interface CombinedSearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  locationLabel: string
  onLocationClick: () => void
  onSearchSubmit?: () => void
}

export function CombinedSearchBar({
  searchQuery,
  onSearchChange,
  locationLabel,
  onLocationClick,
  onSearchSubmit,
}: CombinedSearchBarProps) {
  return (
    <div
      data-testid="combined-search-bar"
      className="flex items-center w-full"
      style={{
        maxWidth: '352px',
        height: '44px',
        border: '1px solid #EEEEEE',
        borderRadius: '32px',
        backgroundColor: '#FFFFFF',
      }}
    >
      <input
        type="text"
        data-testid="combined-search-input"
        placeholder="search anything"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit()
        }}
        className="flex-1 min-w-0 outline-none bg-transparent"
        style={{
          height: '44px',
          paddingLeft: '12px',
          paddingRight: '6px',
          paddingTop: '15px',
          paddingBottom: '15px',
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '14px',
          lineHeight: 1,
          color: 'var(--color-text-primary)',
          border: 'none',
          boxSizing: 'border-box',
        }}
      />
      {searchQuery && (
        <button
          type="button"
          data-testid="combined-search-clear"
          className="flex items-center justify-center shrink-0 cursor-pointer bg-transparent border-none p-0"
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

      {/* Divider between search and location */}
      <div
        className="shrink-0"
        style={{
          width: '1px',
          height: '20px',
          backgroundColor: '#EEEEEE',
          margin: '0 6px',
        }}
      />

      {/* Location zone */}
      <button
        type="button"
        data-testid="combined-search-location"
        className="flex items-center justify-center shrink-0 cursor-pointer border-none p-0"
        style={{
          height: '44px',
          gap: '6px',
          paddingLeft: '12px',
          paddingRight: '12px',
          minWidth: '80px',
          backgroundColor: 'transparent',
          borderRadius: '0 32px 32px 0',
          transition: 'background-color 100ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#EEEEEE'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        onClick={onLocationClick}
      >
        <MapPin size={14} style={{ color: '#191919', flexShrink: 0 }} />
        <span
          style={{
            fontFamily: '"Open Sans", sans-serif',
            fontSize: '14px',
            lineHeight: 1,
            color: '#191919',
            maxWidth: '160px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {locationLabel}
        </span>
      </button>

      {/* Search submit: circle inside bar, aligned right with consistent padding (Airbnb-style) */}
      <button
        type="button"
        data-testid="combined-search-submit"
        className="flex items-center justify-center shrink-0 cursor-pointer border-none p-0"
        style={{
          width: '32px',
          height: '32px',
          marginRight: '6px',
          marginLeft: '4px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg-subtle)',
          transition: 'background-color 100ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#E0E0E0'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
        }}
        onClick={onSearchSubmit}
      >
        <Search size={14} style={{ color: '#191919' }} />
      </button>
    </div>
  )
}
