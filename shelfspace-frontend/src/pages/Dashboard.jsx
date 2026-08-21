import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ResourcesPanel from '../components/ResourcesPanel'
import BorrowersPanel from '../components/BorrowersPanel'
import ReservationsPanel from '../components/ReservationsPanel'
import Toast from '../components/Toast'
import './Dashboard.css'

const tabs = [
  { id: 'resources', label: 'Resources' },
  { id: 'borrowers', label: 'Borrowers' },
  { id: 'reservations', label: 'Reservations' },
]

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('resources')
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    const nextToast = { id, message, type }

    setToasts((current) => [...current, nextToast])

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const activePanel = useMemo(() => {
    if (activeTab === 'borrowers') {
      return <BorrowersPanel showToast={showToast} />
    }

    if (activeTab === 'reservations') {
      return <ReservationsPanel showToast={showToast} />
    }

    return <ResourcesPanel showToast={showToast} />
  }, [activeTab])

  if (!user) {
    return null
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="brand-wrap">
            <div className="brand-badge">S</div>
            <div>
              <p className="brand-kicker">Management</p>
              <h1>ShelfSpace</h1>
            </div>
          </div>

          <div className="header-actions">
            <div className="user-pill">{user.email}</div>
            <button type="button" className="secondary-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <nav className="dashboard-tabs" aria-label="Dashboard sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="dashboard-main">
          <div className="dashboard-panel fade-in" key={activeTab}>
            {activePanel}
          </div>
        </div>
      </div>

      <Toast toasts={toasts} onClose={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </main>
  )
}

export default Dashboard
