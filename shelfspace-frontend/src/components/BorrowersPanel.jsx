import { useEffect, useState } from 'react'
import {
  createBorrower,
  deleteBorrower,
  fetchBorrowers,
  updateBorrower,
} from '../api/api'
import Modal from './Modal'

const emptyForm = {
  name: '',
  email: '',
  studentId: '',
}

function validateBorrower(values) {
  const nextErrors = {}

  if (!String(values.name || '').trim()) {
    nextErrors.name = 'Name is required.'
  }

  if (!String(values.email || '').trim()) {
    nextErrors.email = 'Email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(values.email).trim())) {
    nextErrors.email = 'Please enter a valid email.'
  }

  if (!String(values.studentId || '').trim()) {
    nextErrors.studentId = 'Student ID is required.'
  }

  return nextErrors
}

export default function BorrowersPanel({ showToast }) {
  const [borrowers, setBorrowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const loadBorrowers = async () => {
    try {
      setLoading(true)
      const data = await fetchBorrowers()
      setBorrowers(Array.isArray(data) ? data : [])
    } catch (error) {
      showToast(error.message || 'Failed to load borrowers', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBorrowers()
  }, [])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEditModal = (borrower) => {
    setEditingId(borrower.id)
    setForm({
      name: borrower.name,
      email: borrower.email,
      studentId: borrower.studentId || '',
    })
    setErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
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
    const nextErrors = validateBorrower(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload = {
      name: String(form.name).trim(),
      email: String(form.email).trim(),
      studentId: String(form.studentId).trim(),
    }

    try {
      if (editingId) {
        await updateBorrower(editingId, payload)
        showToast('Borrower updated successfully', 'success')
      } else {
        await createBorrower(payload)
        showToast('Borrower added successfully', 'success')
      }

      await loadBorrowers()
      closeModal()
    } catch (error) {
      showToast(error.message || 'Failed to save borrower', 'error')
    }
  }

  const handleDelete = async (borrowerId) => {
    const confirmed = window.confirm('Delete this borrower?')
    if (!confirmed) return

    try {
      await deleteBorrower(borrowerId)
      await loadBorrowers()
      showToast('Borrower deleted successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to delete borrower', 'error')
    }
  }

  return (
    <section className="panel-wrap">
      <div className="panel-topbar">
        <div>
          <p className="panel-kicker">People</p>
          <h2>Borrowers</h2>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateModal}>
          Add Borrower
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading borrowers…</div>
      ) : borrowers.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No borrowers yet</p>
          <p>Add a borrower to start creating reservations.</p>
        </div>
      ) : (
        <div className="table-wrap">
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
              {borrowers.map((borrower) => (
                <tr key={borrower.id}>
                  <td>{borrower.name}</td>
                  <td>{borrower.email}</td>
                  <td>{borrower.studentId || '—'}</td>
                  <td>
                    <div className="action-group">
                      <button type="button" className="ghost-btn" onClick={() => openEditModal(borrower)}>
                        Edit
                      </button>
                      <button type="button" className="danger-btn" onClick={() => handleDelete(borrower.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Borrower' : 'Add Borrower'}>
        <form onSubmit={handleSubmit} className="form-grid" noValidate>
          <div className="field">
            <label htmlFor="borrower-name">Name</label>
            <input id="borrower-name" name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="borrower-email">Email</label>
            <input id="borrower-email" name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="borrower-student-id">Student ID</label>
            <input id="borrower-student-id" name="studentId" value={form.studentId} onChange={handleChange} />
            {errors.studentId && <span className="field-error">{errors.studentId}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {editingId ? 'Save Changes' : 'Add Borrower'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
