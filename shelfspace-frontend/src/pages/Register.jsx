import { useState } from 'react'
import { Link } from 'react-router-dom'
import { registerUser } from '../api/api'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }) {
  if (!email || !password) return 'Email and password are required.'
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

function Register() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    const validationError = validate(form)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      const result = await registerUser(form)
      setMessage(result.message || 'Registration successful.')
      setForm({ email: '', password: '' })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="register-heading">
        <h1 id="register-heading">Create your ShelfSpace account</h1>
        <p className="auth-copy">Register to get started.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} />
          {error && <p className="message error" role="alert">{error}</p>}
          {message && <p className="message success" role="status">{message}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : 'Register'}</button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Login</Link></p>
      </section>
    </main>
  )
}

export default Register
