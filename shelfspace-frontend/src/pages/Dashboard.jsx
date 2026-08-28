import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpenCheck, CalendarClock, ClipboardList, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import ResourceTable from '../components/ResourceTable'
import BorrowerTable from '../components/BorrowerTable'
import ReservationTable from '../components/ReservationTable'
import ServiceRequestTable from '../components/ServiceRequestTable'
import Toast from '../components/Toast'
import { fetchResources, createResource, updateResource, deleteResource, fetchBorrowers, createBorrower, updateBorrower, deleteBorrower, fetchReservations, createReservation, returnReservation, deleteReservation, fetchServiceRequests, createServiceRequest, updateServiceRequest, deleteServiceRequest } from '../api/api'
import './Dashboard.css'

const TAB_LABELS = { resources: 'Resources', borrowers: 'Borrowers', reservations: 'Reservations', requests: 'Service Requests' }

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('resources')
  const [resources, setResources] = useState([])
  const [borrowers, setBorrowers] = useState([])
  const [reservations, setReservations] = useState([])
  const [serviceRequests, setServiceRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((type, message) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())
    const title = type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notice'
    setToasts((current) => [...current, { id, type, title, message }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000)
  }, [])

  const loadAll = useCallback(async () => {
    setIsLoading(true)
    try {
      const [resourceData, borrowerData, reservationData, requestData] = await Promise.all([fetchResources(), fetchBorrowers(), fetchReservations(), fetchServiceRequests()])
      setResources(Array.isArray(resourceData) ? resourceData : [])
      setBorrowers(Array.isArray(borrowerData) ? borrowerData : [])
      setReservations(Array.isArray(reservationData) ? reservationData : [])
      setServiceRequests(Array.isArray(requestData) ? requestData : [])
    } catch (error) { addToast('error', error.message || 'Unable to load dashboard data') }
    finally { setIsLoading(false) }
  }, [addToast])

  useEffect(() => { loadAll() }, [loadAll])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  if (!user) {
    return null
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <Navbar activeTab={activeTab} onTabChange={setActiveTab} userEmail={user.email} onLogout={handleLogout} />
        <div className="dashboard-content">
          <div className="page-header"><div><p className="eyebrow">Overview</p><h1>{TAB_LABELS[activeTab]}</h1></div><div className="stat-row">{[[BookOpenCheck, 'Resources', resources.length], [Users, 'Borrowers', borrowers.length], [CalendarClock, 'Active reservations', reservations.filter((item) => item.status !== 'returned').length], [ClipboardList, 'Service requests', serviceRequests.length]].map(([Icon, label, value]) => <div className="stat-card" key={label}><span><Icon size={14} />{label}</span><strong>{value}</strong></div>)}</div></div>
          {activeTab === 'resources' && <ResourceTable items={resources} isLoading={isLoading} onCreate={async (payload) => { const created = await createResource(payload); setResources((current) => [...current, created]) }} onUpdate={async (id, payload) => { const updated = await updateResource(id, payload); setResources((current) => current.map((item) => item.id === id ? updated : item)) }} onDelete={async (id) => { await deleteResource(id); setResources((current) => current.filter((item) => item.id !== id)) }} addToast={addToast} />}
          {activeTab === 'borrowers' && <BorrowerTable items={borrowers} isLoading={isLoading} onCreate={async (payload) => { const created = await createBorrower(payload); setBorrowers((current) => [...current, created]) }} onUpdate={async (id, payload) => { const updated = await updateBorrower(id, payload); setBorrowers((current) => current.map((item) => item.id === id ? updated : item)) }} onDelete={async (id) => { await deleteBorrower(id); setBorrowers((current) => current.filter((item) => item.id !== id)) }} addToast={addToast} />}
          {activeTab === 'reservations' && <ReservationTable items={reservations} resources={resources} borrowers={borrowers} isLoading={isLoading} onCreate={async (payload) => { const created = await createReservation(payload); setReservations((current) => [...current, created]); setResources(await fetchResources()) }} onReturn={async (id) => { const updated = await returnReservation(id); setReservations((current) => current.map((item) => item.id === id ? updated : item)); setResources(await fetchResources()) }} onDelete={async (id) => { await deleteReservation(id); setReservations((current) => current.filter((item) => item.id !== id)); setResources(await fetchResources()) }} addToast={addToast} />}
          {activeTab === 'requests' && <ServiceRequestTable items={serviceRequests} isLoading={isLoading} onCreate={async (payload) => { const created = await createServiceRequest(payload); setServiceRequests((current) => [created, ...current]) }} onUpdate={async (id, payload) => { const updated = await updateServiceRequest(id, payload); setServiceRequests((current) => current.map((item) => item.id === id ? updated : item)) }} onDelete={async (id) => { await deleteServiceRequest(id); setServiceRequests((current) => current.filter((item) => item.id !== id)) }} addToast={addToast} />}
        </div>
      </div>

      <Toast toasts={toasts} onClose={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </main>
  )
}

export default Dashboard
