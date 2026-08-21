import { useEffect, useState } from 'react'
import {
  createResource,
  deleteResource,
  fetchResources,
  updateResource,
} from '../api/api'
import Modal from './Modal'

const emptyForm = {
  title: '',
  type: '',
  totalCopies: '1',
  availableCopies: '1',
}

function validateResource(values) {
  const nextErrors = {}

  if (!String(values.title || '').trim()) {
    nextErrors.title = 'Title is required.'
  }

  if (!String(values.type || '').trim()) {
    nextErrors.type = 'Type is required.'
  }

  const totalCopies = Number(values.totalCopies)
  const availableCopies = Number(values.availableCopies)

  if (!Number.isFinite(totalCopies) || totalCopies < 1) {
    nextErrors.totalCopies = 'Total copies must be at least 1.'
  }

  if (!Number.isFinite(availableCopies) || availableCopies < 0) {
    nextErrors.availableCopies = 'Available copies cannot be negative.'
  }

  if (
    Number.isFinite(totalCopies) &&
    Number.isFinite(availableCopies) &&
    availableCopies > totalCopies
  ) {
    nextErrors.availableCopies = 'Available copies cannot exceed total copies.'
  }

  return nextErrors
}

export default function ResourcesPanel({ showToast }) {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const loadResources = async () => {
    try {
      setLoading(true)
      const data = await fetchResources()
      setResources(Array.isArray(data) ? data : [])
    } catch (error) {
      showToast(error.message || 'Failed to load resources', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setErrors({})
    setModalOpen(true)
  }

  const openEditModal = (resource) => {
    setEditingId(resource.id)
    setForm({
      title: resource.title,
      type: resource.type || '',
      totalCopies: String(resource.totalCopies ?? 1),
      availableCopies: String(resource.availableCopies ?? 0),
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
    const nextErrors = validateResource(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload = {
      title: String(form.title).trim(),
      type: String(form.type).trim(),
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.availableCopies),
    }

    try {
      if (editingId) {
        await updateResource(editingId, payload)
        showToast('Resource updated successfully', 'success')
      } else {
        await createResource(payload)
        showToast('Resource added successfully', 'success')
      }

      await loadResources()
      closeModal()
    } catch (error) {
      showToast(error.message || 'Failed to save resource', 'error')
    }
  }

  const handleDelete = async (resourceId) => {
    const confirmed = window.confirm('Delete this resource?')
    if (!confirmed) return

    try {
      await deleteResource(resourceId)
      await loadResources()
      showToast('Resource deleted successfully', 'success')
    } catch (error) {
      showToast(error.message || 'Failed to delete resource', 'error')
    }
  }

  return (
    <section className="panel-wrap">
      <div className="panel-topbar">
        <div>
          <p className="panel-kicker">Catalog</p>
          <h2>Resources</h2>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateModal}>
          Add Resource
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading resources…</div>
      ) : resources.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No resources yet</p>
          <p>Add your first resource to start tracking copies.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Total Copies</th>
                <th>Available Copies</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td>{resource.title}</td>
                  <td>{resource.type || '—'}</td>
                  <td>{resource.totalCopies}</td>
                  <td>{resource.availableCopies}</td>
                  <td>
                    <div className="action-group">
                      <button type="button" className="ghost-btn" onClick={() => openEditModal(resource)}>
                        Edit
                      </button>
                      <button type="button" className="danger-btn" onClick={() => handleDelete(resource.id)}>
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

      <Modal open={modalOpen} onClose={closeModal} title={editingId ? 'Edit Resource' : 'Add Resource'}>
        <form onSubmit={handleSubmit} className="form-grid" noValidate>
          <div className="field">
            <label htmlFor="resource-title">Title</label>
            <input id="resource-title" name="title" value={form.title} onChange={handleChange} />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="field">
            <label htmlFor="resource-type">Type</label>
            <input id="resource-type" name="type" value={form.type} onChange={handleChange} />
            {errors.type && <span className="field-error">{errors.type}</span>}
          </div>

          <div className="two-column">
            <div className="field">
              <label htmlFor="resource-total">Total Copies</label>
              <input id="resource-total" name="totalCopies" type="number" min="1" value={form.totalCopies} onChange={handleChange} />
              {errors.totalCopies && <span className="field-error">{errors.totalCopies}</span>}
            </div>

            <div className="field">
              <label htmlFor="resource-available">Available Copies</label>
              <input id="resource-available" name="availableCopies" type="number" min="0" value={form.availableCopies} onChange={handleChange} />
              {errors.availableCopies && <span className="field-error">{errors.availableCopies}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              {editingId ? 'Save Changes' : 'Add Resource'}
            </button>
          </div>
        </form>
      </Modal>
    </section>
  )
}
