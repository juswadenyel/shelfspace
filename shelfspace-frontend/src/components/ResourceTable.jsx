import { useState } from 'react'
import { Edit3, LoaderCircle, Plus, Trash2 } from 'lucide-react'
import Modal from './Modal'

const EMPTY_FORM = { title: '', type: 'Book', totalCopies: '1', availableCopies: '1' }

function validateResource(form) {
  const nextErrors = {}

  if (!String(form.title || '').trim()) nextErrors.title = 'Title is required.'
  if (!String(form.type || '').trim()) nextErrors.type = 'Type is required.'

  const totalCopies = Number(form.totalCopies)
  const availableCopies = Number(form.availableCopies)

  if (!Number.isFinite(totalCopies) || totalCopies < 1) {
    nextErrors.totalCopies = 'Total copies must be at least 1.'
  }

  if (!Number.isFinite(availableCopies) || availableCopies < 0) {
    nextErrors.availableCopies = 'Available copies cannot be negative.'
  }

  if (Number.isFinite(totalCopies) && Number.isFinite(availableCopies) && availableCopies > totalCopies) {
    nextErrors.availableCopies = 'Available copies cannot exceed total copies.'
  }

  return nextErrors
}

export default function ResourceTable({ items = [], isLoading, onCreate, onUpdate, onDelete, addToast }) {
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

  const openEditModal = (resource) => {
    setEditingId(resource.id)
    setForm({
      title: resource.title,
      type: resource.type || 'Book',
      totalCopies: String(resource.totalCopies ?? 1),
      availableCopies: String(resource.availableCopies ?? 0),
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
    const nextErrors = validateResource(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload = {
      title: form.title.trim(),
      type: form.type.trim(),
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.availableCopies),
    }

    try {
      if (editingId) {
        await onUpdate(editingId, payload)
        addToast('success', 'Resource updated successfully')
      } else {
        await onCreate(payload)
        addToast('success', 'Resource added successfully')
      }
      closeModal()
    } catch (error) {
      addToast('error', error.message || 'Unable to save resource')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) {
      return
    }

    try {
      await onDelete(id)
      addToast('success', 'Resource deleted successfully')
    } catch (error) {
      addToast('error', error.message || 'Failed to delete resource')
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Catalog</p>
          <h3>Resources</h3>
        </div>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          <Plus size={16} />
          Add resource
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
            <h4>No resources yet</h4>
            <p>Start by adding a resource to your catalog.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Total</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((resource) => (
                <tr key={resource.id}>
                  <td>{resource.title}</td>
                  <td>{resource.type || '—'}</td>
                  <td>{resource.totalCopies}</td>
                  <td>{resource.availableCopies}</td>
                  <td>
                    <div className="action-group">
                      <button type="button" className="icon-button" onClick={() => openEditModal(resource)} aria-label={`Edit ${resource.title}`}>
                        <Edit3 size={15} />
                      </button>
                      <button type="button" className="icon-button danger" onClick={() => handleDelete(resource.id)} aria-label={`Delete ${resource.title}`}>
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

      <Modal open={isOpen} title={editingId ? 'Edit resource' : 'Add resource'} onClose={closeModal}>
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Title</span>
            <input name="title" value={form.title} onChange={handleChange} />
            {errors.title && <small>{errors.title}</small>}
          </label>

          <label>
            <span>Type</span>
            <input name="type" value={form.type} onChange={handleChange} />
            {errors.type && <small>{errors.type}</small>}
          </label>

          <div className="two-column">
            <label>
              <span>Total copies</span>
              <input name="totalCopies" type="number" min="1" value={form.totalCopies} onChange={handleChange} />
              {errors.totalCopies && <small>{errors.totalCopies}</small>}
            </label>

            <label>
              <span>Available copies</span>
              <input name="availableCopies" type="number" min="0" value={form.availableCopies} onChange={handleChange} />
              {errors.availableCopies && <small>{errors.availableCopies}</small>}
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              {editingId ? 'Save changes' : 'Add resource'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
