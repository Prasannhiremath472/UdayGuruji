import { useState } from 'react';
import './Tabs.css';

/**
 * tabs: [{ key, label, content }]
 */
export default function Tabs({ tabs, defaultKey }) {
  const [active, setActive] = useState(defaultKey || tabs[0]?.key);
  const activeTab = tabs.find((t) => t.key === active) || tabs[0];

  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            className={`tabs-trigger ${active === tab.key ? 'tabs-trigger-active' : ''}`}
            onClick={() => setActive(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-panel" role="tabpanel">
        {activeTab?.content}
      </div>
    </div>
  );
}
