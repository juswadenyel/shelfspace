import { Link, useLocation } from 'react-router-dom'

function Dashboard() {
  const location = useLocation()
  const email = location.state?.email

  return (
    <main className="dashboard-page">
      <section className="dashboard-card" aria-labelledby="dashboard-heading">
        <h1 id="dashboard-heading">Welcome to ShelfSpace{email ? `, ${email}` : ''}!</h1>
        <p className="auth-copy">You are logged in and ready to manage your resources.</p>
        <Link to="/login">Return to login</Link>
      </section>
    </main>
  )
}

export default Dashboard
