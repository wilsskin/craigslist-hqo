import { useMemo } from 'react'
import { getItemsForTab } from '@/data/tabMapping'
import { itemMatchesQuery } from '@/lib/searchTaxonomy'
import { IconGrid } from '@/components/IconGrid'

interface MainContentShellProps {
  activeTab: string
  searchQuery: string
  onClearSearch: () => void
}

export function MainContentShell({
  activeTab,
  searchQuery,
  onClearSearch,
}: MainContentShellProps) {
  const allItems = useMemo(() => getItemsForTab(activeTab), [activeTab])

  const filtered = useMemo(() => {
    if (!searchQuery) return allItems
    return allItems.filter(({ item }) =>
      itemMatchesQuery(item.label, searchQuery),
    )
  }, [allItems, searchQuery])

  return (
    <main
      data-testid="main-content-shell"
      className="w-full"
      style={{ paddingTop: '16px', paddingBottom: '64px' }}
    >
      {/* Empty state */}
      {searchQuery && filtered.length === 0 ? (
        <div
          data-testid="search-empty-state"
          className="flex flex-col items-center justify-center py-16"
        >
          <h3
            className="text-lg font-bold mb-2"
            style={{
              fontFamily: '"Open Sans", sans-serif',
              color: 'var(--color-text-primary)',
            }}
          >
            No results
          </h3>
          <p
            className="text-sm mb-4"
            style={{
              color: 'var(--color-text-secondary)',
              fontFamily: '"Open Sans", sans-serif',
            }}
          >
            Try a different search.
          </p>
          <button
            type="button"
            data-testid="empty-state-clear"
            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white cursor-pointer"
            style={{
              height: '44px',
              lineHeight: 1,
              backgroundColor: 'var(--color-link-default)',
              borderRadius: 'var(--radius-button)',
              border: 'none',
              fontFamily: '"Open Sans", sans-serif',
            }}
            onClick={onClearSearch}
          >
            Clear search
          </button>
        </div>
      ) : (
        <IconGrid items={filtered} />
      )}
    </main>
  )
}
