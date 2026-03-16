import type { TabItem } from '@/data/tabMapping'
import { getCategoryIconUrl } from '@/utils/categoryIcons'

interface IconGridProps {
  items: TabItem[]
}

function IconCard({ item, sectionId }: TabItem) {
  const iconUrl = getCategoryIconUrl(sectionId, item.id)

  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ gap: '4px', maxWidth: '72px' }}
    >
      <div
        className="flex items-center justify-center w-full cursor-pointer"
        style={{
          aspectRatio: '1',
          border: '1px solid #EEEEEE',
          borderRadius: '12px',
          backgroundColor: 'transparent',
          transition: 'background-color 100ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#F3F3F3'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            width={28}
            height={28}
            className="shrink-0"
            style={{ filter: 'brightness(0) saturate(100%) invert(50%)' }}
            draggable={false}
          />
        ) : (
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#EEEEEE',
            }}
          />
        )}
      </div>
      <span
        className="text-center w-full block"
        style={{
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '13px',
          lineHeight: 1.4,
          color: 'var(--color-text-secondary)',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {item.label}
      </span>
    </div>
  )
}

export function IconGrid({ items }: IconGridProps) {
  return (
    <div
      data-testid="icon-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '24px 20px',
      }}
    >
      {items.map(({ item, sectionId }) => (
        <IconCard key={item.id} item={item} sectionId={sectionId} />
      ))}
    </div>
  )
}
