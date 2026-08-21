import { useState } from 'react'
import { Edit3, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import Modal from './Modal'

const EMPTY_FORM = { name: '', email: '', studentId: '' }

function validateBorrower(form) {
  const nextErrors = {}

  if (!String(form.name || '').trim()) nextErrors.name = 'Name is required.'
  if (!String(form.email || '').trim()) nextErrors.email = 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email).trim())) {
    nextErrors.email = 'Enter a valid email address.'
  }
  if (!String(form.studentId || '').trim()) nextErrors.studentId = 'Student ID is required.'

  return nextErrors
}

export default function BorrowerTable({ items = [], isLoading, onCreate, onUpdate, onDelete, addToast }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const openCreateModal = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setIsOpen(true)
  }

  const openEditModal = (borrower) => {
    setEditingId(borrower.id)
    setForm({
      name: borrower.name,
      email: borrower.email,
      studentId: borrower.studentId || '',
    })
    setErrors({})
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validateBorrower(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      studentId: form.studentId.trim(),
    }

    try {
      if (editingId) {
        await onUpdate(editingId, payload)
        addToast('success', 'Borrower updated successfully')
      } else {
        await onCreate(payload)
        addToast('success', 'Borrower added successfully')
      }
      closeModal()
    } catch (error) {
      addToast('error', error.message || 'Unable to save borrower')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this borrower?')) {
      return
    }

    try {
      await onDelete(id)
      addToast('success', 'Borrower deleted successfully')
    } catch (error) {
      addToast('error', error.message || 'Failed to delete borrower')
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">People</p>
          <h3>Borrowers</h3>
        </div>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          <Plus size={16} />
          Add borrower
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
            <LoaderCircle size={30} className="empty-icon" />
            <h4>No borrowers yet</h4>
            <p>Register a borrower to start managing reservations.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Student ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((borrower) => (
                <tr key={borrower.id}>
                  <td>{borrower.name}</td>
                  <td>{borrower.email}</td>
                  <td>{borrower.studentId || '—'}</td>
                  <td>
                    <div className="action-group">
                      <button type="button" className="icon-button" onClick={() => openEditModal(borrower)} aria-label={`Edit ${borrower.name}`}>
                        <Edit3 size={15} />
                      </button>
                      <button type="button" className="icon-button danger" onClick={() => handleDelete(borrower.id)} aria-label={`Delete ${borrower.name}`}>
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

      <Modal open={isOpen} title={editingId ? 'Edit borrower' : 'Add borrower'} onClose={closeModal}>
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Name</span>
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <small>{errors.name}</small>}
          </label>

          <label>
            <span>Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label>
            <span>Student ID</span>
            <input name="studentId" value={form.studentId} onChange={handleChange} />
            {errors.studentId && <small>{errors.studentId}</small>}
          </label>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {editingId ? 'Save changes' : 'Add borrower'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
