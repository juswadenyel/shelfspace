import { useState } from 'react'
import { ClipboardList, Edit3, Trash2 } from 'lucide-react'
import Modal from './Modal'

const CATEGORIES = ['General', 'Maintenance', 'IT Support', 'Facilities', 'Other']
const EMPTY_FORM = { title: '', description: '', category: CATEGORIES[0] }

function validate(form) {
  const errors = {}
  if (!form.title.trim()) errors.title = 'Title is required.'
  if (!form.description.trim()) errors.description = 'Description is required.'
  if (!form.category.trim()) errors.category = 'Category is required.'
  return errors
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ServiceRequestTable({ items = [], isLoading, onCreate, onUpdate, onDelete, addToast }) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const closeModal = () => { setIsOpen(false); setEditingId(null); setForm(EMPTY_FORM); setErrors({}) }
  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setErrors({}); setIsOpen(true) }
  const openEdit = (item) => { setEditingId(item.id); setForm({ title: item.title, description: item.description || '', category: item.category || CATEGORIES[0] }); setErrors({}); setIsOpen(true) }
  const handleChange = (event) => { const { name, value } = event.target; setForm((current) => ({ ...current, [name]: value })) }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    const payload = { title: form.title.trim(), description: form.description.trim(), category: form.category.trim() }
    try {
      if (editingId) { await onUpdate(editingId, payload); addToast('success', 'Service request updated successfully') }
      else { await onCreate(payload); addToast('success', 'Service request submitted successfully') }
      closeModal()
    } catch (error) { addToast('error', error.message || 'Unable to save service request') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service request?')) return
    try { await onDelete(id); addToast('success', 'Service request deleted successfully') }
    catch (error) { addToast('error', error.message || 'Failed to delete service request') }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div><p className="eyebrow">My requests</p><h3>Service Requests</h3></div>
        <button type="button" className="primary-button" onClick={openCreate}><ClipboardList size={16} />New request</button>
      </div>
      <div className="table-wrap">
        {isLoading ? <div className="table-skeleton" aria-live="polite">{[1, 2, 3, 4].map((row) => <div key={row} className="skeleton-row" />)}</div> : items.length === 0 ? (
          <div className="empty-state"><ClipboardList size={30} className="empty-icon" /><h4>No service requests yet</h4><p>Submit a request and it will show up here.</p></div>
        ) : (
          <table><thead><tr><th>Title</th><th>Category</th><th>Description</th><th>Date created</th><th>Actions</th></tr></thead><tbody>
            {items.map((item) => <tr key={item.id}><td>{item.title}</td><td><span className="status-badge active">{item.category}</span></td><td>{item.description || '—'}</td><td>{formatDate(item.dateCreated)}</td><td><div className="action-group"><button type="button" className="icon-button" onClick={() => openEdit(item)} aria-label={`Edit ${item.title}`}><Edit3 size={15} /></button><button type="button" className="icon-button danger" onClick={() => handleDelete(item.id)} aria-label={`Delete ${item.title}`}><Trash2 size={15} /></button></div></td></tr>)}
          </tbody></table>
        )}
      </div>
      <Modal open={isOpen} title={editingId ? 'Edit service request' : 'New service request'} onClose={closeModal}>
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <label><span>Title</span><input name="title" value={form.title} onChange={handleChange} />{errors.title && <small>{errors.title}</small>}</label>
          <label><span>Category</span><select name="category" value={form.category} onChange={handleChange}>{CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}</select>{errors.category && <small>{errors.category}</small>}</label>
          <label><span>Description</span><textarea name="description" rows={4} value={form.description} onChange={handleChange} placeholder="Describe what you need help with…" />{errors.description && <small>{errors.description}</small>}</label>
          <div className="form-actions"><button type="button" className="secondary-button" onClick={closeModal}>Cancel</button><button type="submit" className="primary-button">{editingId ? 'Save changes' : 'Submit request'}</button></div>
        </form>
      </Modal>
    </div>
  )
}
