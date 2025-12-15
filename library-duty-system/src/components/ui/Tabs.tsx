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
  activeColor? : string
  inactiveColor? : string
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  className = '',
  activeColor,
  inactiveColor
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const tabListStyles: React.CSSProperties = {
    display: 'flex',
    borderBottom: `2px solid ${theme.colors.gray[700]}`,
    marginBottom: theme.spacing[6],
    gap: theme.spacing[2],
    borderRadius: '8px 8px 0 0', // ← Round top corners
    padding: '1 rem', // ← Add some padding
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',

  }

  const tabButtonStyles = (isActive: boolean): React.CSSProperties => ({
    padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
    border: 'none',
    background: 'transparent',
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.medium,
    color: isActive ? theme.colors.text.primary : theme.colors.gray[400],
    cursor: 'pointer',
    borderBottom: isActive ? `5px solid ${activeColor}` : '5px solid transparent',
    transition: theme.transitions.normal,
    borderRadius: `${theme.radii.md} ${theme.radii.md} 0 0`,
    fontFamily: theme.fonts.body,
  })

  const tabContentStyles: React.CSSProperties = {
    animation: 'slideInUp 0.3s ease-out',
    paddingRight: '2em', 
    paddingBottom: '2em',
    paddingLeft: '2em',
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