export type ActiveFilters = {
type: 'all' | 'want' | 'can'
categories: string[] // id категорий
sex: 'any' | 'male' | 'female'
cities: string[] // id городов
}

export type SidebarPanelProps = {
filters: ActiveFilters
onChange: (filters: ActiveFilters) => void
}

export type ActiveFiltersBarProps = {
filters: ActiveFilters
onReset: () => void
onRemoveFilter: (type: keyof ActiveFilters, value: string) => void
}