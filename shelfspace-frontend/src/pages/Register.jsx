import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
      await registerUser(form)
      navigate('/login', { replace: true, state: { justRegistered: true } })
    } catch (requestError) {
      setErrors({ form: requestError.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-showcase" aria-hidden="true"><div className="showcase-brand"><div className="brand-mark">S</div><strong>ShelfSpace</strong></div><div className="showcase-body"><div className="showcase-ledge" /><h2>Set up your shelf in under a minute.</h2><p>Track resources, borrowers, reservations, and your own service requests in one place.</p></div><div className="showcase-stats"><div><strong>Free</strong><span>For your department</span></div><div><strong>JWT</strong><span>Secured access</span></div></div></section>
      <div className="auth-form-side"><motion.section className="auth-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} aria-labelledby="register-heading">
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
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </motion.section></div></main>
  )
}

export default Register
