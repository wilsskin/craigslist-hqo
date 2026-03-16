import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomePage } from './HomePage'
import { CATEGORY_TABS, getItemsForTab } from '@/data/tabMapping'
import { CITIES } from '@/data/constants'

describe('HomePage layout regions', () => {
  it('renders header, tab bar, and main content', () => {
    render(<HomePage />)

    expect(screen.getByTestId('header-shell')).toBeInTheDocument()
    expect(screen.getByTestId('category-tab-bar')).toBeInTheDocument()
    expect(screen.getByTestId('main-content-shell')).toBeInTheDocument()
  })

  it('does NOT render a left rail', () => {
    render(<HomePage />)
    expect(screen.queryByTestId('left-rail-shell')).not.toBeInTheDocument()
  })
})

describe('Combined search bar', () => {
  it('renders search input with "search anything" placeholder', () => {
    render(<HomePage />)
    const input = screen.getByPlaceholderText('search anything')
    expect(input).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('updates value when the user types', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    const input = screen.getByPlaceholderText('search anything')
    await user.type(input, 'apartments')
    expect(input).toHaveValue('apartments')
  })

  it('shows clear X when query is non-empty', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    const input = screen.getByPlaceholderText('search anything')
    await user.type(input, 'test')
    expect(screen.getByTestId('combined-search-clear')).toBeInTheDocument()
  })

  it('clears search when X is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)
    const input = screen.getByPlaceholderText('search anything')
    await user.type(input, 'test')
    await user.click(screen.getByTestId('combined-search-clear'))
    expect(input).toHaveValue('')
  })

  it('shows default location label "Boston"', () => {
    render(<HomePage />)
    expect(screen.getByTestId('combined-search-location')).toHaveTextContent(
      'Boston',
    )
  })
})

describe('Category tab bar', () => {
  it('renders all 7 tabs in order', () => {
    render(<HomePage />)
    for (const tab of CATEGORY_TABS) {
      expect(screen.getByTestId(`tab-${tab.id}`)).toBeInTheDocument()
    }
  })

  it('defaults to community tab', () => {
    render(<HomePage />)
    expect(screen.getByTestId('tab-community')).toBeInTheDocument()
    const items = getItemsForTab('community')
    expect(items.length).toBeGreaterThan(0)
    expect(screen.getByText(items[0].item.label)).toBeInTheDocument()
  })

  it('switches content when a tab is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('tab-housing'))
    const items = getItemsForTab('housing')
    expect(items.length).toBeGreaterThan(0)
    expect(screen.getByText(items[0].item.label)).toBeInTheDocument()
  })
})

describe('Icon grid content', () => {
  it('renders items for the active (community) tab', () => {
    render(<HomePage />)
    const items = getItemsForTab('community')
    expect(items.length).toBeGreaterThan(0)
    expect(screen.getByText(items[0].item.label)).toBeInTheDocument()
  })

  it('renders items for another tab after switching', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('tab-for-sale'))
    const items = getItemsForTab('for-sale')
    expect(items.length).toBeGreaterThan(0)
    expect(screen.getByText(items[0].item.label)).toBeInTheDocument()
  })
})

describe('Search filtering within active tab', () => {
  it('filters items and shows empty state for nonsense query', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search anything')
    await user.type(input, 'zzzz_not_found')

    expect(screen.getByTestId('search-empty-state')).toBeInTheDocument()
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('clears search from empty state button', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    const input = screen.getByPlaceholderText('search anything')
    await user.type(input, 'zzzz_not_found')

    await user.click(screen.getByTestId('empty-state-clear'))
    expect(input).toHaveValue('')
    expect(screen.queryByTestId('search-empty-state')).not.toBeInTheDocument()
  })
})

describe('Location modal', () => {
  it('opens modal when location zone is clicked', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('combined-search-location'))
    expect(screen.getByTestId('location-modal')).toBeInTheDocument()
  })

  it('closes modal on Apply', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('combined-search-location'))
    expect(screen.getByTestId('location-modal')).toBeInTheDocument()

    await user.click(screen.getByTestId('modal-apply'))
    expect(screen.queryByTestId('location-modal')).not.toBeInTheDocument()
  })
})

describe('City selection via modal', () => {
  it('selects a city via search and renders chip', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('combined-search-location'))

    // Type to reveal city options (cities only show when searching)
    const modalInput = screen.getByPlaceholderText('add city')
    await user.type(modalInput, 'san')

    // Click San Francisco
    const sf = CITIES.find((c) => c.id === 'city_sf')!
    await user.click(screen.getByTestId(`city-option-${sf.id}`))

    // Chip should appear
    const chipsContainer = screen.getByTestId('modal-chips')
    expect(within(chipsContainer).getByText('Boston')).toBeInTheDocument()
    expect(
      within(chipsContainer).getByText('San Francisco'),
    ).toBeInTheDocument()
  })
})

describe('Location label updates', () => {
  it('updates combined search bar label after adding a city', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('combined-search-location'))

    // Remove Boston first
    await user.click(screen.getByTestId('chip-remove-city_boston'))

    // Search and add SF
    const modalInput = screen.getByPlaceholderText('Search by city')
    await user.type(modalInput, 'san')
    await user.click(
      screen.getByTestId(`city-option-${CITIES[0].id}`),
    )
    await user.click(screen.getByTestId('modal-apply'))

    const location = screen.getByTestId('combined-search-location')
    expect(location).toHaveTextContent('San Francisco')
  })

  it('does NOT show radius suffix by default', () => {
    render(<HomePage />)
    const location = screen.getByTestId('combined-search-location')
    expect(location).toHaveTextContent('Boston')
    expect(location).not.toHaveTextContent('±')
  })

  it('shows radius suffix after editing radius', async () => {
    const user = userEvent.setup()
    render(<HomePage />)

    await user.click(screen.getByTestId('combined-search-location'))
    await user.selectOptions(screen.getByTestId('radius-select'), '25')
    await user.click(screen.getByTestId('modal-apply'))

    const location = screen.getByTestId('combined-search-location')
    expect(location).toHaveTextContent('± 25 mi')
  })
})

describe('Header overflow via measureText injection', () => {
  const narrowMeasure = (text: string) => text.length * 10

  it('shows overflow fallback when measureText forces overflow', async () => {
    const user = userEvent.setup()
    render(<HomePage measureTextOverride={narrowMeasure} />)

    await user.click(screen.getByTestId('combined-search-location'))

    // Add San Francisco via search
    const modalInput = screen.getByPlaceholderText('add city')
    await user.type(modalInput, 'san')
    await user.click(screen.getByTestId(`city-option-${CITIES[0].id}`))

    // Clear and add NYC
    await user.clear(modalInput)
    await user.type(modalInput, 'new')
    await user.click(screen.getByTestId(`city-option-${CITIES[2].id}`))

    await user.click(screen.getByTestId('modal-apply'))

    const location = screen.getByTestId('combined-search-location')
    expect(location).toHaveTextContent('Boston, 2 more')
  })
})
