import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { registerUser } from '../api/api'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }) {
  const nextErrors = {}

  if (!email.trim()) nextErrors.email = 'Email is required.'
  else if (!EMAIL_PATTERN.test(email)) nextErrors.email = 'Please enter a valid email address.'

  if (!password) nextErrors.password = 'Password is required.'
  else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'

  return nextErrors
}

function Register() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
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

    setMessage('')
    setIsSubmitting(true)
    try {
      const result = await registerUser(form)
      setMessage(result.message || 'Registration successful')
      setForm({ email: '', password: '' })
    } catch (requestError) {
      setErrors({ form: requestError.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.main className="auth-page" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <section className="auth-card" aria-labelledby="register-heading">
        <div className="auth-brand">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Create account</p>
            <h1 id="register-heading">Join ShelfSpace</h1>
          </div>
        </div>

        <p className="auth-copy">Create your account to start managing your library operations.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="register-email">
            <span>Email</span>
            <input id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} />
            {errors.email && <small>{errors.email}</small>}
          </label>

          <label htmlFor="register-password">
            <span>Password</span>
            <input id="register-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} />
            {errors.password && <small>{errors.password}</small>}
          </label>

          {errors.form && <p className="message error" role="alert">{errors.form}</p>}
          {message && <p className="message success" role="status">{message}</p>}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </motion.main>
  )
}

export default Register
