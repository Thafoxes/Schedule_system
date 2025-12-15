import React, { useState } from 'react'
import { theme } from '../../styles/theme'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  className?: string
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const tabListStyles: React.CSSProperties = {
    display: 'flex',
    borderBottom: `2px solid ${theme.colors.gray[200]}`,
    marginBottom: theme.spacing[6],
    gap: theme.spacing[2],
  }

  const tabButtonStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
    border: 'none',
    background: 'transparent',
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: isActive ? theme.colors.primary[600] : theme.colors.text.secondary,
    cursor: 'pointer',
    borderBottom: isActive ? `3px solid ${theme.colors.primary[500]}` : '3px solid transparent',
    transition: theme.transitions.normal,
    borderRadius: `${theme.radii.md} ${theme.radii.md} 0 0`,
    fontFamily: theme.fonts.body,
  })

  const tabContentStyles: React.CSSProperties = {
    animation: 'slideInUp 0.3s ease-out',
  }

  const currentTab = tabs.find(tab => tab.id === activeTab)

  return (
    <div className={className}>
      <div style={tabListStyles} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            style={tabButtonStyles(activeTab === tab.id)}
            onClick={() => handleTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={tabContentStyles}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {currentTab?.content}
      </div>
    </div>
  )
}

export default Tabs