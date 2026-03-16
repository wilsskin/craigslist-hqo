import { Star, User } from 'lucide-react'
import craigslistLogo from '@/assets/craigslist-logo.png'
import { CombinedSearchBar } from '@/components/CombinedSearchBar'

interface HeaderShellProps {
  headerSearchQuery: string
  onSearchQueryChange: (query: string) => void
  locationLabel: string
  onLocationClick: () => void
}

export function HeaderShell({
  headerSearchQuery,
  onSearchQueryChange,
  locationLabel,
  onLocationClick,
}: HeaderShellProps) {
  return (
    <header
      data-testid="header-shell"
      className="w-full"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'var(--color-bg-page)',
      }}
    >
      <div className="w-full flex items-center gap-4" style={{ height: '64px', paddingTop: '16px', paddingBottom: '16px', boxSizing: 'border-box' }}>
        {/* Logo */}
        <div className="shrink-0" data-testid="header-logo-area" style={{ maxWidth: '120px' }}>
          <img
            src={craigslistLogo}
            alt="craigslist"
            className="block max-w-full h-auto"
            style={{ height: 'auto', width: 'auto' }}
          />
        </div>

        {/* Combined search bar: centered, max 352px */}
        <div className="flex-1 flex justify-center min-w-0">
          <CombinedSearchBar
            searchQuery={headerSearchQuery}
            onSearchChange={onSearchQueryChange}
            locationLabel={locationLabel}
            onLocationClick={onLocationClick}
          />
        </div>

        {/* Right: Post an ad + action icons */}
        <div
          className="shrink-0 flex items-center"
          data-testid="header-actions-area"
          style={{ gap: '16px' }}
        >
          <button
            type="button"
            data-testid="header-post-ad-button"
            className="flex items-center justify-center cursor-pointer border-none bg-transparent p-0 font-semibold"
            style={{
              lineHeight: 1,
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '14px',
              color: 'var(--color-text-primary)',
            }}
            onClick={() => console.log('[header] Post an ad clicked')}
          >
            Post an ad
          </button>
          <button
            type="button"
            className="relative flex items-center justify-center cursor-pointer border-none p-0"
            title="Favorites"
            style={{
              color: 'var(--color-icon-primary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              const circle = e.currentTarget.querySelector('.hover-circle') as HTMLElement
              if (circle) circle.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const circle = e.currentTarget.querySelector('.hover-circle') as HTMLElement
              if (circle) circle.style.opacity = '0'
            }}
            onClick={() => console.log('[header] Favorites clicked')}
          >
            <span
              className="hover-circle absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                opacity: 0,
                transition: 'opacity var(--duration-fast) var(--ease-primary)',
                pointerEvents: 'none',
              }}
            />
            <Star size={20} className="relative z-10" />
          </button>
          <button
            type="button"
            className="relative flex items-center justify-center cursor-pointer border-none p-0"
            title="Account"
            style={{
              color: 'var(--color-icon-primary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              const circle = e.currentTarget.querySelector('.hover-circle') as HTMLElement
              if (circle) circle.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              const circle = e.currentTarget.querySelector('.hover-circle') as HTMLElement
              if (circle) circle.style.opacity = '0'
            }}
            onClick={() => console.log('[header] Account clicked')}
          >
            <span
              className="hover-circle absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                opacity: 0,
                transition: 'opacity var(--duration-fast) var(--ease-primary)',
                pointerEvents: 'none',
              }}
            />
            <User size={20} className="relative z-10" />
          </button>
        </div>
      </div>
    </header>
  )
}
