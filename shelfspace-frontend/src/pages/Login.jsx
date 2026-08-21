import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/api'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password }) {
  if (!email || !password) return 'Email and password are required.'
  if (!EMAIL_PATTERN.test(email)) return 'Please enter a valid email address.'
  if (password.length < 6) return 'Password must be at least 6 characters.'
  return ''
}

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationError = validate(form)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      const result = await loginUser(form)
      navigate('/dashboard', { state: { email: result.email || form.email } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-heading">
        <h1 id="login-heading">Welcome back</h1>
        <p className="auth-copy">Log in to ShelfSpace.</p>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} />
          {error && <p className="message error" role="alert">{error}</p>}
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in…' : 'Login'}</button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Register</Link></p>
      </section>
    </main>
  )
}

export default Login
