import { useEffect, useState } from 'react'
import {
  createReservation,
  deleteReservation,
  fetchBorrowers,
  fetchReservations,
  fetchResources,
  returnReservation,
} from '../api/api'
import Modal from './Modal'

const emptyForm = {
  resourceId: '',
  borrowerId: '',
  dueDate: '',
}

export default function ReservationsPanel({ showToast }) {
  const [reservations, setReservations] = useState([])
  const [resources, setResources] = useState([])
  const [borrowers, setBorrowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const loadData = async () => {
    try {
      setLoading(true)
      const [reservationData, resourceData, borrowerData] = await Promise.all([
        fetchReservations(),
        fetchResources(),
        fetchBorrowers(),
      ])

      setReservations(Array.isArray(reservationData) ? reservationData : [])
      setResources(Array.isArray(resourceData) ? resourceData : [])
      setBorrowers(Array.isArray(borrowerData) ? borrowerData : [])
    } catch (error) {
      showToast(error.message || 'Failed to load reservations', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreateModal = () => {
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setForm(emptyForm)
    setErrors({})
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.resourceId) nextErrors.resourceId = 'Please select a resource.'
    if (!form.borrowerId) nextErrors.borrowerId = 'Please select a borrower.'

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      const payload = {
        resource: { id: Number(form.resourceId) },
        borrower: { id: Number(form.borrowerId) },
        dueDate: form.dueDate || null,
      }

      await createReservation(payload)
      await loadData()
      showToast('Reservation created successfully', 'success')
      closeModal()
    } catch (error) {
      showToast(error.message || 'Failed to create reservation', 'error')
    }
  }

  const handleReturn = async (reservationId) => {
    try {
      await returnReservation(reservationId)
      await loadData()
      showToast('Reservation marked as returned', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to return reservation', 'error')
    }
  }

  const handleDelete = async (reservationId) => {
    const confirmed = window.confirm('Delete this reservation?')
    if (!confirmed) return

    try {
      await deleteReservation(reservationId)
      await loadData()
      showToast('Reservation deleted successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to delete reservation', 'error')
    }
  }

  const activeResources = resources.filter((resource) => Number(resource.availableCopies) > 0)

  return (
    <section className="panel-wrap">
      <div className="panel-topbar">
        <div>
          <p className="panel-kicker">Activity</p>
          <h2>Reservations</h2>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateModal}>
          New Reservation
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading reservations…</div>
      ) : reservations.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No reservations yet</p>
          <p>Create a reservation to track borrowed items.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Borrower</th>
                <th>Status</th>
                <th>Reserved Date</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => {
                const status = reservation.status || 'reserved'
                const canReturn = status === 'reserved' || status === 'active'

                return (
                  <tr key={reservation.id}>
                    <td>{reservation.resource?.title || '—'}</td>
                    <td>{reservation.borrower?.name || '—'}</td>
                    <td>
                      <span className={`status-badge ${status}`}>
                        {status}
                      </span>
                    </td>
                    <td>{reservation.reservedDate || '—'}</td>
                    <td>{reservation.dueDate || '—'}</td>
                    <td>
                      <div className="action-group">
                        {canReturn && (
                          <button type="button" className="primary-btn small" onClick={() => handleReturn(reservation.id)}>
                            Return
                          </button>
                        )}
                        <button type="button" className="danger-btn" onClick={() => handleDelete(reservation.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title="Create Reservation">
        <form onSubmit={handleSubmit} className="form-grid" noValidate>
          <div className="field">
            <label htmlFor="reservation-resource">Resource</label>
            <select id="reservation-resource" name="resourceId" value={form.resourceId} onChange={handleChange}>
              <option value="">Select a resource</option>
              {activeResources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.title} ({resource.availableCopies} available)
                </option>
              ))}
            </select>
            {errors.resourceId && <span className="field-error">{errors.resourceId}</span>}
          </div>

          <div className="field">
            <label htmlFor="reservation-borrower">Borrower</label>
            <select id="reservation-borrower" name="borrowerId" value={form.borrowerId} onChange={handleChange}>
              <option value="">Select a borrower</option>
              {borrowers.map((borrower) => (
                <option key={borrower.id} value={borrower.id}>
                  {borrower.name} ({borrower.email})
                </option>
              ))}
            </select>
            {errors.borrowerId && <span className="field-error">{errors.borrowerId}</span>}
          </div>

          <div className="field">
            <label htmlFor="reservation-due-date">Due Date (optional)</label>
            <input id="reservation-due-date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Create Reservation
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
