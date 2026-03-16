import { useState } from 'react'
import { motion } from 'framer-motion'
import * as Tabs from '@radix-ui/react-tabs'
import { CATEGORY_TABS } from '@/data/tabMapping'

/** Ease-out curve from design system (primary easing) — tuple for Framer Motion ease */
const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Fixed height per tab so active and inactive center identically (avoids inactive text sitting high) */
const TAB_TRIGGER_HEIGHT = 30

interface CategoryTabBarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function CategoryTabBar({ activeTab, onTabChange }: CategoryTabBarProps) {
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null)

  return (
    <Tabs.Root value={activeTab} onValueChange={onTabChange}>
      <div
        data-testid="category-tab-bar"
        className="w-full flex items-center"
        style={{
          height: '40px',
        }}
      >
        {/* Wrapper: background wraps only the tab content (fit-content), 6px radius to match pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '10px',
            padding: '4px 4px',
            width: 'fit-content',
            boxSizing: 'border-box',
            backgroundColor: '#F3F3F3',
          }}
        >
          <Tabs.List
            className="flex items-center outline-none"
            style={{
              gap: '0',
              border: 'none',
              height: '100%',
            }}
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              const isHovered = hoveredTabId === tab.id
              const isHoverOrActive = isActive || isHovered

              return (
                <Tabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  data-testid={`tab-${tab.id}`}
                  className="relative outline-none border-none cursor-pointer lowercase whitespace-nowrap"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: TAB_TRIGGER_HEIGHT,
                    padding: '0 6px',
                    lineHeight: 1,
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '13px',
                    fontWeight: isActive ? 500 : 500,
                    color: isHoverOrActive ? '#191919' : '#727272',
                    backgroundColor: 'transparent',
                    borderRadius: '8px',
                    transition: 'color 100ms cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={() => setHoveredTabId(tab.id)}
                  onMouseLeave={() => setHoveredTabId(null)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-pill"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 6,
                        background: '#FFFFFF',
                        boxShadow: '0 0 4px 0px rgba(0, 0, 0, 0.05)',
                        zIndex: 0,
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
      </div>
    </Tabs.Root>
  )
}
