import type { TabItem } from '@/data/tabMapping'
import { getCategoryIconUrl } from '@/utils/categoryIcons'

interface IconGridProps {
  items: TabItem[]
}

function IconCard({ item, sectionId }: TabItem) {
  const iconUrl = getCategoryIconUrl(sectionId, item.id)

  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer box-border"
      style={{
        width: '76px',
        minHeight: '76px',
        padding: '16px 2px',
        gap: '4px',
        border: '1px solid transparent',
        borderRadius: '8px',
        backgroundColor: '#F7F7F7',
        boxShadow: '0 0px 2px 0 rgba(0, 0, 0, 0.05)',
        transition:
          'background-color 100ms cubic-bezier(0.16, 1, 0.3, 1), border-color 100ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F3F3F3'
        e.currentTarget.style.borderColor = '#EEEEEE'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#F7F7F7'
        e.currentTarget.style.borderColor = 'transparent'
      }}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt=""
          width={24}
          height={24}
          className="shrink-0"
          style={{ filter: 'brightness(0) saturate(100%) invert(50%)' }}
          draggable={false}
        />
      ) : (
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            backgroundColor: '#EEEEEE',
          }}
        />
      )}
      <span
        className="text-center w-full block"
        style={{
          fontFamily: '"Open Sans", sans-serif',
          fontSize: '12px',
          lineHeight: 1.15,
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
        gap: '24px 16px',
        alignItems: 'start',
      }}
    >
      {items.map(({ item, sectionId }) => (
        <IconCard key={item.id} item={item} sectionId={sectionId} />
      ))}
    </div>
  )
}
