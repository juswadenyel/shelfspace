import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/api'
import { useAuth } from '../context/AuthContext'

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
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      login(result.email || form.email)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setErrors({ form: requestError.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.main className="auth-page" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <section className="auth-card" aria-labelledby="login-heading">
        <div className="auth-brand">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 id="login-heading">ShelfSpace</h1>
          </div>
        </div>

        <p className="auth-copy">Log in to manage resources, borrowers, and bookings.</p>

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

          {errors.form && <p className="message error" role="alert">{errors.form}</p>}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </section>
    </motion.main>
  )
}

export default Login
