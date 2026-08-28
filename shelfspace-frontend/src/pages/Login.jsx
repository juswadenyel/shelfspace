import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/api'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }) {
  const nextErrors = {}

  if (!email.trim()) nextErrors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email)) nextErrors.email = 'Please enter a valid email address.'

  if (!password) nextErrors.password = 'Password is required.'
  else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'

  return nextErrors
}

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = (type, title, message) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())
    setToasts((current) => [...current, { id, type, title, message }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4500)
  }

  useEffect(() => {
    if (location.state?.justRegistered) {
      addToast('success', 'Account created', 'You can log in now.')
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    try {
      const result = await loginUser(form)
      login(result.email || form.email, result.token)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      addToast('error', 'Login failed', 'Invalid email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase" aria-hidden="true">
        <div className="showcase-brand"><div className="brand-mark">S</div><strong>ShelfSpace</strong></div>
        <div className="showcase-body"><div className="showcase-ledge" /><h2>Every resource, borrower, and request in one shelf.</h2><p>Keep lending and service requests organized for staff who need clarity, not clutter.</p></div>
        <div className="showcase-stats"><div><strong>24/7</strong><span>Availability</span></div><div><strong>100%</strong><span>Owner-only access</span></div></div>
      </section>
      <div className="auth-form-side"><motion.section className="auth-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} aria-labelledby="login-heading">
        <div className="auth-brand">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 id="login-heading">Log in</h1>
          </div>
        </div>

        <p className="auth-copy">Log in to manage resources, borrowers, and service requests.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">
            <span>Email</span>
            <input id="login-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label htmlFor="login-password">
            <span>Password</span>
            <input id="login-password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} />
            {errors.password && <small>{errors.password}</small>}
          </label>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Create one</Link>
        </p>
      </motion.section></div><Toast toasts={toasts} onClose={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} /></main>
  )
}

export default Login
