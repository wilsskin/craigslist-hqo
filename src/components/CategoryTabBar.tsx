import { motion } from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import { CATEGORY_TABS } from '@/data/tabMapping'

/** Ease-out curve from design system (primary easing) — tuple for Framer Motion ease */
const EASE_OUT = [0.16, 1, 0.3, 1] as const

interface CategoryTabBarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function CategoryTabBar({ activeTab, onTabChange }: CategoryTabBarProps) {
  return (
    <Tabs.Root value={activeTab} onValueChange={onTabChange}>
      <div
        data-testid="category-tab-bar"
        className="w-full"
        style={{
          borderBottom: '1px solid #EEEEEE',
        }}
      >
        <Tabs.List
          className="flex items-end outline-none"
          style={{
            gap: '24px',
            marginBottom: -1,
            paddingTop: '24px',
          }}
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id

            return (
              <Tabs.Trigger
                key={tab.id}
                value={tab.id}
                data-testid={`tab-${tab.id}`}
                className="relative outline-none border-none cursor-pointer lowercase whitespace-nowrap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingTop: '8px',
                  paddingBottom: '10px',
                  paddingLeft: '2px',
                  paddingRight: '2px',
                  lineHeight: 1,
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isActive ? '#191919' : '#727272',
                  backgroundColor: 'transparent',
                  transition: 'color 100ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#191919'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#727272'
                  }
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="category-tab-underline"
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: '2px',
                      backgroundColor: '#191919',
                    }}
                    transition={{
                      type: 'tween',
                      duration: 0.2,
                      ease: EASE_OUT,
                    }}
                  />
                )}
                <span className="relative" style={{ zIndex: 1, lineHeight: 1 }}>
                  {tab.label}
                </span>
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>
      </div>
    </Tabs.Root>
  )
}
