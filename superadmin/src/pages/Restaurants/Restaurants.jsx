import { useEffect, useMemo, useState } from 'react'
import './Restaurants.css'

function Restaurants() {
  const [form, setForm] = useState({ name: '', owner: '', city: '' })
  const [account, setAccount] = useState({ username: '', email: '', password: '' })
  const [rows, setRows] = useState([])
  const [accounts, setAccounts] = useState({})
  const [error, setError] = useState('')

  const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '')
  const RESOURCE_URL = `${API_BASE_URL}/restaurants`
  const USERS_URL = `${API_BASE_URL}/users`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRestaurants, resUsers] = await Promise.all([
          fetch(RESOURCE_URL),
          fetch(USERS_URL),
        ])
        if (!resRestaurants.ok) throw new Error('Không tải được danh sách nhà hàng')
        const restaurantsData = await resRestaurants.json()
        setRows(Array.isArray(restaurantsData) ? restaurantsData : [])

        if (!resUsers.ok) throw new Error('Không tải được danh sách tài khoản')
        const usersData = await resUsers.json()
        const map = {}
        if (Array.isArray(usersData)) {
          usersData
            .filter((u) => u.role === 'restaurant' && u.restaurantId)
            .forEach((u) => {
              map[u.restaurantId] = u
            })
        }
        setAccounts(map)
        setError('')
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Không thể tải dữ liệu')
      }
    }
    fetchData()
  }, [RESOURCE_URL, USERS_URL])

  const handleStatusChange = async (id, nextStatus) => {
    try {
      const res = await fetch(`${RESOURCE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statusKey: nextStatus, status: labelStatus(nextStatus) }),
      })
      if (!res.ok) throw new Error('Không thể cập nhật trạng thái')
      const updated = await res.json()
      setRows((prev) => prev.map((row) => (row.id === id ? updated : row)))
      setError('')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Lỗi cập nhật trạng thái')
    }
  }

  const handleAdd = async () => {
    const trimmedName = form.name.trim()
    const trimmedOwner = form.owner.trim()
    const trimmedCity = form.city.trim()
    const trimmedEmail = account.email.trim().toLowerCase()
    const trimmedUsername = account.username.trim() || trimmedName

    if (!trimmedName || !trimmedOwner || !trimmedCity || !trimmedEmail || !account.password.trim()) {
      setError('Vui lòng nhập đủ thông tin cửa hàng và tài khoản quản lý')
      return
    }

    if (Object.values(accounts).some((item) => item.email?.toLowerCase() === trimmedEmail)) {
      setError('Email tài khoản đã tồn tại')
      return
    }

    const payload = {
      name: trimmedName,
      owner: trimmedOwner,
      city: trimmedCity,
      statusKey: 'pending',
      status: labelStatus('pending'),
      rating: '—',
    }
    try {
      const res = await fetch(RESOURCE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Không thể thêm cửa hàng')
      const created = await res.json()

      const accountPayload = {
        username: trimmedUsername,
        email: trimmedEmail,
        password: account.password,
        role: 'restaurant',
        restaurantId: created.id,
        redirect: '/admin',
      }

      const accountRes = await fetch(USERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountPayload),
      })

      if (!accountRes.ok) {
        await fetch(`${RESOURCE_URL}/${created.id}`, { method: 'DELETE' }).catch(() => {})
        throw new Error('Tạo tài khoản thất bại — cửa hàng vừa thêm đã được huỷ')
      }

      const createdAccount = await accountRes.json()

      setRows((prev) => [created, ...prev])
      setAccounts((prev) => ({ ...prev, [created.id]: createdAccount }))
      setForm({ name: '', owner: '', city: '' })
      setAccount({ username: '', email: '', password: '' })
      setError('')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Lỗi thêm cửa hàng')
    }
  }

  const statusMap = useMemo(
    () => ({
      pending: { action: 'Duyệt đăng ký', next: 'active' },
      review: { action: 'Duyệt đăng ký', next: 'active' },
      active: { action: 'Tạm ngừng', next: 'suspended' },
      suspended: { action: 'Mở khóa', next: 'active' },
    }),
    [],
  )

  const labelStatus = (key) => {
    switch (key) {
      case 'pending':
        return 'Chờ duyệt'
      case 'review':
        return 'Đang xem xét'
      case 'active':
        return 'Đang hoạt động'
      case 'suspended':
        return 'Bị khoá'
      default:
        return key
    }
  }

  return (
    <div className="sa-page restaurants-page">
      <section className="sa-section">
        <header>
          <div>
            <h2>Quản lý nhà hàng &amp; Merchant</h2>
            <p>Duyệt đối tác mới, khoá các đơn vị vi phạm và theo dõi chất lượng dịch vụ.</p>
          </div>
          <div className="section-actions">
            <button type="button" className="primary">Duyệt nhanh</button>
            <button type="button" className="ghost">Xuất danh sách</button>
          </div>
        </header>
        {error ? <div className="error-banner">{error}</div> : null}
        <div className="add-form">
          <div className="field">
            <label>Tên cửa hàng</label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Tên cửa hàng"
            />
          </div>
          <div className="field">
            <label>Chủ sở hữu</label>
            <input
              value={form.owner}
              onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))}
              placeholder="Chủ sở hữu"
            />
          </div>
          <div className="field">
            <label>Thành phố</label>
            <input
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              placeholder="Thành phố"
            />
          </div>
          <div className="field">
            <label>Tên quản trị</label>
            <input
              value={account.username}
              onChange={(e) => setAccount((p) => ({ ...p, username: e.target.value }))}
              placeholder="Ví dụ: Admin Pizza Hub"
            />
          </div>
          <div className="field">
            <label>Email đăng nhập</label>
            <input
              type="email"
              value={account.email}
              onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))}
              placeholder="admin@merchantexample.com"
            />
          </div>
          <div className="field">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={account.password}
              onChange={(e) => setAccount((p) => ({ ...p, password: e.target.value }))}
              placeholder="Tối thiểu 6 ký tự"
            />
          </div>
          <div className="field submit">
            <button type="button" onClick={handleAdd}>Thêm cửa hàng &amp; tạo tài khoản</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nhà hàng</th>
                <th>Chủ sở hữu</th>
                <th>Thành phố</th>
                <th>Tài khoản</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const state = statusMap[row.statusKey] ?? statusMap.pending;
                const toggleAction = state?.action;
                const next = state?.next;
                const accountRow = accounts[row.id];
                return (
                  <tr key={row.id || row.name}>
                    <td>{row.name}</td>
                    <td>{row.owner}</td>
                    <td>{row.city}</td>
                    <td>
                      {accountRow ? (
                        <div className="account-cell">
                          <strong>{accountRow.username}</strong>
                          <span>{accountRow.email}</span>
                        </div>
                      ) : (
                        <span className="muted">Chưa có</span>
                      )}
                    </td>
                    <td>
                      <span className={`status status-${row.statusKey}`}>{row.status}</span>
                    </td>
                    <td className="action-cell">
                      {toggleAction ? (
                        <button type="button" className="primary" onClick={() => handleStatusChange(row.id, next)}>
                          {toggleAction}
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="danger ghost"
                        onClick={() => handleStatusChange(row.id, 'suspended')}
                      >
                        Khoá cửa hàng
                      </button>
                    </td>
                    <td>{row.rating}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Restaurants
