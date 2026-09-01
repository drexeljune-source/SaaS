import { useMemo, useState } from 'react'

const defaultUsers = [
  {
    id: 1,
    name: 'Admin User',
    username: 'admin_orbitflow',
    email: 'admin@orbitflow.io',
    password: 'admin123',
    role: 'admin',
    connectedAccounts: ['Instagram', 'LinkedIn', 'X'],
    company: 'OrbitFlow HQ',
    subscriptionStatus: 'Enterprise',
    subscriptionStart: '2024-01-15',
    notifications: [
      { id: 1, type: 'info', message: 'New feature: AI Sentiment Analysis is now live', date: '2026-08-28' },
      { id: 2, type: 'success', message: 'Your team expanded to 3 seats', date: '2026-08-25' },
    ],
  },
  {
    id: 2,
    name: 'Maya Hart',
    username: 'maya_creative',
    email: 'maya@studio.com',
    password: 'user123',
    role: 'user',
    connectedAccounts: ['Instagram', 'TikTok'],
    company: 'Northwind Studio',
    subscriptionStatus: 'Pro',
    subscriptionStart: '2025-06-10',
    notifications: [
      { id: 1, type: 'success', message: 'Your subscription renewal is active', date: '2026-08-30' },
      { id: 2, type: 'info', message: 'New integrations: Threads and Bluesky now available', date: '2026-08-20' },
      { id: 3, type: 'warning', message: '2 API rate limit warnings this week', date: '2026-08-15' },
    ],
  },
]

const serviceCards = [
  {
    title: 'AI Social Inbox',
    description: 'Respond to messages, comments, and leads across your connected social channels with conversational automation.',
    status: 'Live',
    metric: '24/7 coverage',
  },
  {
    title: 'Brand Voice AI',
    description: 'Use your business tone and values to generate polished customer responses that feel human and on-brand.',
    status: 'Pro',
    metric: '94% brand match',
  },
  {
    title: 'Business Ops Assistant',
    description: 'Handle FAQs, appointment booking, and service scheduling while your team focuses on growth.',
    status: 'Scale',
    metric: '3x faster support',
  },
]

const stats = [
  { label: 'Active automations', value: '2,480' },
  { label: 'Average reply time', value: '12 sec' },
  { label: 'Client retention', value: '97%' },
]

function App() {
  const [users, setUsers] = useState(defaultUsers)
  const [currentUser, setCurrentUser] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [editingAccounts, setEditingAccounts] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    username: '',
  })
  const [toast, setToast] = useState('')

  const currentUserName = currentUser ? currentUser.name : 'Guest'

  const navItems = useMemo(
    () => [
      { label: 'Overview', active: true },
      { label: 'Services' },
      { label: 'Analytics' },
      { label: 'Integrations' },
    ],
    [],
  )

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSocialChange = (event) => {
    const { value, checked } = event.target
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === currentUser.id) {
          const updated = { ...user }
          const selected = new Set(updated.connectedAccounts)
          if (checked) selected.add(value)
          else selected.delete(value)
          updated.connectedAccounts = [...selected]
          setCurrentUser(updated)
          return updated
        }
        return user
      }),
    )
  }

  const showToast = (message) => {
    setToast(message)
    window.clearTimeout(showToast.timeout)
    showToast.timeout = window.setTimeout(() => setToast(''), 2400)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (authMode === 'signup') {
      const exists = users.some((user) => user.email.toLowerCase() === form.email.toLowerCase())
      if (exists) {
        showToast('Account already exists. Please log in.')
        return
      }

      if (!form.username.trim()) {
        showToast('Please enter a username.')
        return
      }

      const usernameExists = users.some((user) => user.username.toLowerCase() === form.username.toLowerCase())
      if (usernameExists) {
        showToast('Username is already taken.')
        return
      }

      const newUser = {
        id: Date.now(),
        name: form.name || 'New Client',
        username: form.username,
        email: form.email,
        password: form.password,
        role: 'user',
        connectedAccounts: [],
        company: form.company || 'Independent Business',
        subscriptionStatus: 'Starter',
        subscriptionStart: new Date().toISOString().split('T')[0],
        notifications: [
          { id: 1, type: 'success', message: 'Welcome to OrbitFlow! Your account has been activated.', date: new Date().toISOString().split('T')[0] },
        ],
      }

      setUsers((prev) => [...prev, newUser])
      setCurrentUser(newUser)
      showToast('Welcome aboard! Your account is ready.')
      return
    }

    const match = users.find(
      (user) => user.email.toLowerCase() === form.email.toLowerCase() && user.password === form.password,
    )

    if (!match) {
      showToast('Invalid credentials. Try again.')
      return
    }

    setCurrentUser(match)
    showToast(`Signed in as ${match.role === 'admin' ? 'Admin' : 'Client'}.`)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setForm({ name: '', email: '', password: '', company: '', username: '' })
    setEditingAccounts(false)
    showToast('You have been logged out.')
  }

  const isAdmin = currentUser?.role === 'admin'
  const visibleUsers = isAdmin ? users : [currentUser].filter(Boolean)
  const subscriberCount = users.filter((u) => u.role === 'user').length

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">O</div>
          <div>
            <div className="brand-name">OrbitFlow</div>
            <div className="brand-tag">AI Business Automation</div>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button key={item.label} className={item.active ? 'nav-link active' : 'nav-link'}>
              {item.label}
            </button>
          ))}
        </nav>

        {currentUser ? (
          <div className="user-panel">
            <div className="avatar">{currentUser.name.charAt(0)}</div>
            <div>
              <strong>{currentUserName}</strong>
              <div className="role-label">{isAdmin ? 'Admin access' : 'Client access'}</div>
            </div>
            <button className="ghost-button" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button className="primary-button" onClick={() => setAuthMode('login')}>Login</button>
        )}
      </header>

      {!currentUser ? (
        <main className="auth-layout">
          <section className="hero-panel">
            <span className="eyebrow">Smart SaaS for modern businesses</span>
            <h1>Turn your social channels into an always-on revenue engine.</h1>
            <p>
              Connect your social platforms, automate customer conversations, and give your business a polished AI-powered support experience.
            </p>

            <div className="stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-box">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="auth-card">
            <div className="auth-toggle">
              <button
                className={authMode === 'login' ? 'toggle-button active' : 'toggle-button'}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                className={authMode === 'signup' ? 'toggle-button active' : 'toggle-button'}
                onClick={() => setAuthMode('signup')}
              >
                Sign Up
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {authMode === 'signup' && (
                <>
                  <label>
                    Full name
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
                  </label>
                  <label>
                    Username or alias
                    <input name="username" value={form.username} onChange={handleChange} placeholder="business_name or nickname" required />
                  </label>
                  <label>
                    Company
                    <input name="company" value={form.company} onChange={handleChange} placeholder="Business name" />
                  </label>
                </>
              )}

              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@business.com" required />
              </label>

              <label>
                Password
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
              </label>

              <button className="primary-button full-width" type="submit">
                {authMode === 'login' ? 'Access dashboard' : 'Create account'}
              </button>
            </form>

            <div className="demo-credentials">
              <span>Demo login:</span>
              <strong>admin@orbitflow.io / admin123</strong>
              <strong>maya@studio.com / user123</strong>
            </div>
          </section>
        </main>
      ) : (
        <main className="dashboard-shell">
          <aside className="sidebar">
            <div className="sidebar-header">
              <div className="brand-mark">O</div>
              <div>
                <div className="brand-name">OrbitFlow</div>
                <div className="brand-tag">Control center</div>
              </div>
            </div>

            <div className="sidebar-box">
              <span className="mini-label">Account</span>
              <h3>{currentUser.name}</h3>
              <p className="username-badge">@{currentUser.username}</p>
              <p>{currentUser.company}</p>
            </div>

            <div className="sidebar-box">
              <span className="mini-label">Subscription</span>
              <p className="subscription-status">{currentUser.subscriptionStatus}</p>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Since {currentUser.subscriptionStart}</p>
            </div>

            <div className="sidebar-box">
              <span className="mini-label">Access level</span>
              <p>{isAdmin ? 'Administrator' : 'Subscriber user'}</p>
            </div>

            {!isAdmin && (
              <div className="notifications-box">
                <span className="mini-label">Updates & Status</span>
                <div className="notifications-list">
                  {currentUser.notifications && currentUser.notifications.slice(0, 3).map((notif) => (
                    <div key={notif.id} className={`notification-item notif-${notif.type}`}>
                      <span className="notif-type">{notif.type}</span>
                      <p>{notif.message}</p>
                      <span className="notif-date">{notif.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <section className="dashboard-main">
            <div className="welcome-row">
              <div>
                <span className="eyebrow">Welcome back</span>
                <h2>{isAdmin ? `Admin dashboard (${subscriberCount} subscribers)` : 'Client dashboard'}</h2>
              </div>
              <button className="primary-button">Launch AI assistant</button>
            </div>

            {!isAdmin && (
              <div className="social-management">
                <div className="social-header">
                  <div>
                    <h3>Connected platforms</h3>
                    <p>Manage your social media integrations for AI automation</p>
                  </div>
                  <button
                    className={editingAccounts ? 'primary-button' : 'ghost-button'}
                    onClick={() => setEditingAccounts(!editingAccounts)}
                  >
                    {editingAccounts ? 'Done' : 'Edit'}
                  </button>
                </div>

                {editingAccounts ? (
                  <div className="social-selector-dashboard">
                    <label><input type="checkbox" value="Instagram" checked={currentUser.connectedAccounts.includes('Instagram')} onChange={handleSocialChange} /> Instagram</label>
                    <label><input type="checkbox" value="LinkedIn" checked={currentUser.connectedAccounts.includes('LinkedIn')} onChange={handleSocialChange} /> LinkedIn</label>
                    <label><input type="checkbox" value="X" checked={currentUser.connectedAccounts.includes('X')} onChange={handleSocialChange} /> X</label>
                    <label><input type="checkbox" value="TikTok" checked={currentUser.connectedAccounts.includes('TikTok')} onChange={handleSocialChange} /> TikTok</label>
                    <label><input type="checkbox" value="Threads" checked={currentUser.connectedAccounts.includes('Threads')} onChange={handleSocialChange} /> Threads</label>
                    <label><input type="checkbox" value="YouTube" checked={currentUser.connectedAccounts.includes('YouTube')} onChange={handleSocialChange} /> YouTube</label>
                  </div>
                ) : (
                  <div className="platforms-display">
                    {currentUser.connectedAccounts.length > 0 ? (
                      <ul className="platform-list">
                        {currentUser.connectedAccounts.map((account) => (
                          <li key={account}>{account}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: 'var(--muted)' }}>No platforms connected. Click Edit to add your social accounts.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="admin-metrics">
                <div className="metric-card">
                  <div className="metric-value">{subscriberCount}</div>
                  <div className="metric-label">Active subscribers</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{users.filter(u => u.subscriptionStatus === 'Pro').length}</div>
                  <div className="metric-label">Pro tier subscribers</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{users.reduce((sum, u) => sum + u.connectedAccounts.length, 0)}</div>
                  <div className="metric-label">Total connected platforms</div>
                </div>
              </div>
            )}

            <div className="service-grid">
              {serviceCards.map((service) => (
                <article key={service.title} className="service-card">
                  <div className="service-topline">
                    <span className="chip">{service.status}</span>
                    <span className="metric">{service.metric}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <button className="ghost-button">Configure</button>
                </article>
              ))}
            </div>

            <div className="table-panel">
              <div className="table-header">
                <h3>{isAdmin ? 'Subscriber profiles & monitoring' : 'Your account profile'}</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    {isAdmin && <th>Subscription</th>}
                    <th>Platforms</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>@{user.username}</td>
                      <td>{user.email}</td>
                      {isAdmin && <td>{user.subscriptionStatus}</td>}
                      <td>{user.connectedAccounts.length > 0 ? user.connectedAccounts.join(', ') : 'No accounts linked'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
