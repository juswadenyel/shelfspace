import { useMemo, useState } from 'react'
import { CalendarClock, CheckCheck, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import Modal from './Modal'

const EMPTY_FORM = { resourceId: '', borrowerId: '' }

export default function ReservationTable({ items = [], resources = [], borrowers = [], isLoading, onCreate, onReturn, onDelete, addToast }) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const resourceOptions = useMemo(() => resources.filter((resource) => Number(resource.availableCopies) > 0), [resources])

  const openCreateModal = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}

    if (!form.resourceId) nextErrors.resourceId = 'Select a resource.'
    if (!form.borrowerId) nextErrors.borrowerId = 'Select a borrower.'
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      await onCreate({
        resource: { id: Number(form.resourceId) },
        borrower: { id: Number(form.borrowerId) },
      })
      addToast('success', 'Reservation created successfully')
      closeModal()
    } catch (error) {
      addToast('error', error.message || 'Unable to create reservation')
    }
  }

  const handleReturn = async (id) => {
    try {
      await onReturn(id)
      addToast('success', 'Reservation marked as returned')
    } catch (error) {
      addToast('error', error.message || 'Failed to return reservation')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation?')) {
      return
    }

    try {
      await onDelete(id)
      addToast('success', 'Reservation deleted successfully')
    } catch (error) {
      addToast('error', error.message || 'Failed to delete reservation')
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Activity</p>
          <h3>Reservations</h3>
        </div>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          <Plus size={16} />
          New reservation
        </button>
      </div>

      <div className="table-wrap">
        {isLoading ? (
          <div className="table-skeleton" aria-live="polite">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="skeleton-row" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <CalendarClock size={30} className="empty-icon" />
            <h4>No reservations yet</h4>
            <p>Create a reservation to track borrowing activity.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Borrower</th>
                <th>Status</th>
                <th>Reserved</th>
                <th>Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.resource?.title || '—'}</td>
                  <td>{reservation.borrower?.name || '—'}</td>
                  <td>
                    <span className={`status-badge ${reservation.status || 'reserved'}`}>
                      {reservation.status || 'reserved'}
                    </span>
                  </td>
                  <td>{reservation.reservedDate || '—'}</td>
                  <td>{reservation.dueDate || '—'}</td>
                  <td>
                    <div className="action-group reservation-actions">
                      {reservation.status !== 'returned' ? (
                        <button type="button" className="primary-button small" onClick={() => handleReturn(reservation.id)}>
                          <CheckCheck size={14} />
                          Return
                        </button>
                      ) : null}
                      <button type="button" className="icon-button danger" onClick={() => handleDelete(reservation.id)} aria-label={`Delete reservation ${reservation.id}`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={isOpen} title="Create reservation" onClose={closeModal}>
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Resource</span>
            <select name="resourceId" value={form.resourceId} onChange={handleChange}>
              <option value="">Select a resource</option>
              {resourceOptions.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.title} ({resource.availableCopies} available)
                </option>
              ))}
            </select>
            {errors.resourceId && <small>{errors.resourceId}</small>}
          </label>

          <label>
            <span>Borrower</span>
            <select name="borrowerId" value={form.borrowerId} onChange={handleChange}>
              <option value="">Select a borrower</option>
              {borrowers.map((borrower) => (
                <option key={borrower.id} value={borrower.id}>
                  {borrower.name} ({borrower.email})
                </option>
              ))}
            </select>
            {errors.borrowerId && <small>{errors.borrowerId}</small>}
          </label>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Create reservation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
