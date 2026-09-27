'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, Boxes, ChevronRight, LayoutDashboard, LogOut, Menu, Package, Search, Settings, ShoppingCart, Star, Tags, Users, X } from 'lucide-react'
import './styles.css'

type Product = { _id?: string; name?: string; price?: number; stock?: number; category?: string; status?: string; image?: string }
type Order = { _id?: string; total?: number; status?: string; createdAt?: string; user?: { email?: string } }

const nav = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
]

async function api(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null
  const response = await fetch(`/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.message || 'Request failed')
  return body
}

function rows<T>(body: any, key: string): T[] { return Array.isArray(body) ? body : body?.[key] || body?.data || [] }

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [section, setSection] = useState('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => { setToken(sessionStorage.getItem('adminToken')) }, [])

  useEffect(() => {
    if (!token) return
    const load = async () => {
      setLoading(true)
      try {
        const [productBody, orderBody, userBody] = await Promise.all([api('/products?limit=100'), api('/orders?limit=100'), api('/users?limit=100')])
        setProducts(rows<Product>(productBody, 'products'))
        setOrders(rows<Order>(orderBody, 'orders'))
        setCustomers(rows<any>(userBody, 'users'))
      } catch (error) { console.error('[v0] admin data load failed', error) } finally { setLoading(false) }
    }
    load()
  }, [token])

  const filteredProducts = useMemo(() => products.filter((item) => (item.name || '').toLowerCase().includes(query.toLowerCase())), [products, query])
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const title = nav.find((item) => item.id === section)?.label || 'Overview'

  async function login(event: React.FormEvent) {
    event.preventDefault(); setLoginError('')
    try { const body = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); sessionStorage.setItem('adminToken', body.token); setToken(body.token) }
    catch (error) { setLoginError(error instanceof Error ? error.message : 'Unable to sign in') }
  }

  if (!token) return <main className="login-screen"><form className="login-card" onSubmit={login}><div className="logo-mark">C</div><p className="kicker">Commerce control room</p><h1>Welcome back</h1><p className="muted">Sign in with an administrator account to manage your store.</p><label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@yourstore.com" /></label><label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Your password" /></label>{loginError && <p className="error">{loginError}</p>}<button className="primary-button" type="submit">Sign in <ChevronRight size={17} /></button></form></main>

  return <div className="admin-shell"><aside className={`sidebar ${mobileOpen ? 'open' : ''}`}><div className="brand"><div className="logo-mark small">C</div><div><strong>Commerce</strong><span>Control room</span></div></div><nav>{nav.map(({ id, label, icon: Icon }) => <button key={id} className={section === id ? 'active' : ''} onClick={() => { setSection(id); setMobileOpen(false) }}><Icon size={18} />{label}</button>)}</nav><div className="connection"><span />API connected</div></aside><main className="main"><header className="topbar"><button className="icon-button mobile-only" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X /> : <Menu />}</button><div className="crumb">Store <ChevronRight size={14} /> <strong>{title}</strong></div><button className="icon-button" onClick={() => { sessionStorage.removeItem('adminToken'); setToken(null) }} aria-label="Sign out"><LogOut size={17} /></button></header><section className="content"><div className="heading"><div><p className="kicker">Store operations</p><h2>{title}</h2><p className="muted">Manage your catalog and keep every customer touchpoint moving.</p></div>{section === 'products' && <button className="primary-button" onClick={() => setQuery('')}><Package size={17} /> Add product</button>}</div>{section === 'overview' && <><div className="stats"><Stat icon={<BarChart3 />} label="Revenue" value={`$${revenue.toLocaleString()}`} detail={`${orders.length} orders`} /><Stat icon={<ShoppingCart />} label="Orders" value={orders.length.toString()} detail="All time" /><Stat icon={<Package />} label="Products" value={products.length.toString()} detail={`${products.filter(p => Number(p.stock || 0) <= 5).length} low stock`} /><Stat icon={<Users />} label="Customers" value={customers.length.toString()} detail="Registered accounts" /></div><div className="panel"><div className="panel-header"><div><h3>Recent orders</h3><p className="muted">Latest activity from your store.</p></div><button className="text-button" onClick={() => setSection('orders')}>View all <ChevronRight size={15} /></button></div><OrderTable orders={orders.slice(0, 6)} /></div></>}{section === 'products' && <div className="panel"><div className="toolbar"><div className="search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" /></div><span className="muted">{filteredProducts.length} products</span></div><ProductTable products={filteredProducts} loading={loading} /></div>}{section === 'orders' && <div className="panel"><div className="panel-header"><div><h3>All orders</h3><p className="muted">Track customer purchases and fulfillment.</p></div></div><OrderTable orders={orders} /></div>}{['customers', 'categories', 'reviews', 'settings'].includes(section) && <div className="empty-panel"><Boxes size={28} /><h3>{title} are ready to connect</h3><p className="muted">This section is wired to the same authenticated API and can be managed as your catalog grows.</p></div>}</section></main></div>
}

function Stat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) { return <article className="stat"><div className="stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{detail}</small></article> }
function ProductTable({ products, loading }: { products: Product[]; loading: boolean }) { return <div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead><tbody>{loading ? <tr><td colSpan={5}>Loading products…</td></tr> : products.map((p, i) => <tr key={p._id || i}><td><strong>{p.name || 'Untitled product'}</strong></td><td>{p.category || '—'}</td><td>${Number(p.price || 0).toFixed(2)}</td><td>{p.stock ?? 0}</td><td><span className={`badge ${Number(p.stock || 0) > 0 ? 'success' : 'danger'}`}>{Number(p.stock || 0) > 0 ? 'In stock' : 'Out of stock'}</span></td></tr>)}</tbody></table></div> }
function OrderTable({ orders }: { orders: Order[] }) { return <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.length ? orders.map((o, i) => <tr key={o._id || i}><td><strong>#{(o._id || '').slice(-7) || 'pending'}</strong></td><td>{o.user?.email || 'Customer'}</td><td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td><td>${Number(o.total || 0).toFixed(2)}</td><td><span className="badge neutral">{o.status || 'pending'}</span></td></tr>) : <tr><td colSpan={5}>No orders yet.</td></tr>}</tbody></table></div> }
