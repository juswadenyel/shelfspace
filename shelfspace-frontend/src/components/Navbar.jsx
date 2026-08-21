import { BookOpenCheck, CalendarClock, LogOut, UserRound, Users } from 'lucide-react'

const tabs = [
  { key: 'resources', label: 'Resources', icon: BookOpenCheck },
  { key: 'borrowers', label: 'Borrowers', icon: Users },
  { key: 'reservations', label: 'Reservations', icon: CalendarClock },
]

export default function Navbar({ activeTab, onTabChange, userEmail, onLogout }) {
  return (
    <header className="dashboard-header">
      <div className="brand-block">
        <div className="brand-mark">S</div>
        <div>
          <p className="eyebrow">Management</p>
          <h2>ShelfSpace</h2>
        </div>
      </div>

      <nav className="tab-nav" aria-label="Dashboard sections">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`tab-button ${activeTab === key ? 'active' : ''}`}
            onClick={() => onTabChange(key)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <div className="user-actions">
        <div className="user-pill">
          <UserRound size={16} />
          <span>{userEmail}</span>
        </div>
        <button type="button" className="logout-button" onClick={onLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  )
}
