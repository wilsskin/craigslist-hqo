import type { TaxonomyItem } from './types'
import { taxonomySections } from './taxonomy'

export interface CategoryTab {
  id: string
  label: string
}

export const CATEGORY_TABS: CategoryTab[] = [
  { id: 'community', label: 'community' },
  { id: 'services', label: 'services' },
  { id: 'discussion', label: 'discussion' },
  { id: 'housing', label: 'housing' },
  { id: 'for-sale', label: 'for sale' },
  { id: 'jobs', label: 'jobs' },
  { id: 'gigs', label: 'gigs' },
]

export const TAB_SECTION_MAP: Record<string, string[]> = {
  'community': ['community', 'events'],
  'services': ['services'],
  'discussion': ['discussion_forums'],
  'housing': ['housing'],
  'for-sale': ['for_sale'],
  'jobs': ['jobs', 'resumes'],
  'gigs': ['gigs'],
}

export interface TabItem {
  item: TaxonomyItem
  sectionId: string
}

export function getItemsForTab(activeTab: string): TabItem[] {
  const sectionIds = TAB_SECTION_MAP[activeTab]
  if (!sectionIds) return []

  return sectionIds.flatMap((sectionId) => {
    const section = taxonomySections.find((s) => s.id === sectionId)
    if (!section) return []
    return section.items.map((item) => ({ item, sectionId }))
  })
}
