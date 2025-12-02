import { useCallback, useEffect, useMemo, useState } from 'react'
import { seedUsers, userSegments } from '../../data/userData'
import {
  changeUserPassword as changeUserPasswordApi,
  fetchUsers as fetchUsersApi,
  updateUser as updateUserApi,
} from '../../services/api'
import './Users.css'

const normalizeUser = (user) => ({
  id: user?.id ?? user?._id ?? crypto.randomUUID(),
  name: user?.name ?? 'Không rõ tên',
  email: user?.email ?? 'chua-cap-nhat@foodfast.vn',
  phone: user?.phone ?? '—',
  role: user?.role ?? 'Khách hàng',
  platform: user?.platform ?? (user?.channel ?? 'Frontend'),
  status: user?.status ?? 'active',
  verified: Boolean(user?.verified ?? user?.isVerified),
  lastActive: user?.lastActive ?? 'Chưa có',
  city: user?.city ?? '—',
  account: user?.account ?? user?.username ?? user?.login ?? user?.email?.split('@')[0] ?? 'khach-hang',
  password: user?.password ?? user?.credentials?.password ?? 'Chưa cập nhật',
  createdAt: user?.createdAt ?? user?.created_at ?? 'Đang cập nhật',
})

const mergeUsers = (base, incoming) => {
  const unique = new Map()
  base.forEach((user) => unique.set(user.id, normalizeUser(user)))
  incoming.forEach((user) => unique.set(user.id, normalizeUser(user)))
  return Array.from(unique.values())
}

function Users() {
  const [users, setUsers] = useState(() => seedUsers.map(normalizeUser))
  const [filters, setFilters] = useState({ role: 'all', platform: 'all', status: 'all', search: '' })
  const [selectedUserId, setSelectedUserId] = useState(seedUsers[0]?.id ?? '')
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })
  const [actionLoading, setActionLoading] = useState('')

  const loadUsers = useCallback(async () => {
    setSyncing(true)
    try {
      const apiUsers = await fetchUsersApi({ includeLocked: true })
      if (Array.isArray(apiUsers) && apiUsers.length) {
        setUsers((prev) => {
          const merged = mergeUsers(prev, apiUsers)
          const hasSelection = merged.some((user) => user.id === selectedUserId)
          if (!hasSelection) {
            setSelectedUserId(merged[0]?.id ?? '')
          }
          return merged
        })
        setMessage('Đã đồng bộ danh sách tài khoản giữa frontend và mobile.')
      }
    } catch (error) {
      console.warn('Không thể đồng bộ danh sách user', error)
      setMessage('Không thể đồng bộ realtime, đang hiển thị dữ liệu lưu sẵn.')
    } finally {
      setSyncing(false)
    }
  }, [selectedUserId])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? users[0],
    [selectedUserId, users]
  )

  const filteredUsers = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    return users.filter((user) => {
      const matchRole = filters.role === 'all' || user.role === filters.role
      const matchPlatform = filters.platform === 'all' || user.platform === filters.platform
      const matchStatus = filters.status === 'all' || user.status === filters.status
      const matchText = !query
        || user.name.toLowerCase().includes(query)
        || user.email.toLowerCase().includes(query)
        || user.phone.toLowerCase().includes(query)
        || user.account.toLowerCase().includes(query)
      return matchRole && matchPlatform && matchStatus && matchText
    })
  }, [filters.platform, filters.role, filters.search, filters.status, users])

  const segmentStats = useMemo(() => {
    const base = { 'Khách hàng': 0, Shipper: 0, Merchant: 0 }
    users.forEach((user) => {
      const role = user.role in base ? user.role : 'Khách hàng'
      base[role] += 1
    })
    return base
  }, [users])

  const accessStats = useMemo(() => {
    const total = users.length
    const locked = users.filter((user) => user.status === 'locked').length
    const active = total - locked
    const frontend = users.filter((user) => user.platform === 'Frontend').length
    const mobile = users.filter((user) => user.platform === 'Mobile').length
    return { total, active, locked, frontend, mobile }
  }, [users])

  const handleSelect = (id) => {
    setSelectedUserId(id)
  }

  const handleFieldChange = (key, value) => {
    if (!selectedUser) return
    setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, [key]: value } : user)))
  }

  const handleSave = async () => {
    if (!selectedUser) return
    setMessage('')
    setActionLoading('save')
    try {
      await updateUserApi(selectedUser.id, selectedUser)
      setMessage('Đã đồng bộ thông tin tài khoản thành công.')
    } catch (error) {
      console.error('Không thể cập nhật user', error)
      setMessage('Không thể đồng bộ lên máy chủ, đã lưu tại giao diện.')
    } finally {
      setActionLoading('')
    }
  }

  const handleToggleLock = async (user) => {
    const nextStatus = user.status === 'locked' ? 'active' : 'locked'
    setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)))
    setMessage(nextStatus === 'locked'
      ? 'Đã khoá đăng nhập: tài khoản bị chặn ngay trên web và app.'
      : 'Đã mở khoá: người dùng đăng nhập lại được trên cả frontend & mobile.')
    setActionLoading(`lock-${user.id}`)
    try {
      await updateUserApi(user.id, { status: nextStatus })
    } catch (error) {
      console.error('Không thể cập nhật trạng thái user', error)
      setMessage('Không thể đồng bộ trạng thái, vui lòng thử lại.')
    } finally {
      setActionLoading('')
    }
  }

  const handlePasswordSubmit = async () => {
    if (!editingUser) return
    if (!passwordForm.password || passwordForm.password !== passwordForm.confirm) {
      setMessage('Mật khẩu không hợp lệ: cần nhập và trùng khớp xác nhận.')
      return
    }

    setMessage('Đang đổi mật khẩu đăng nhập…')
    setActionLoading(`password-${editingUser.id}`)

    try {
      await changeUserPasswordApi(editingUser.id, passwordForm.password)
      setUsers((prev) => prev.map((user) => (
        user.id === editingUser.id
          ? { ...user, password: passwordForm.password }
          : user
      )))
      setMessage('Đã cập nhật mật khẩu, tài khoản có thể đăng nhập với mật khẩu mới.')
      setPasswordForm({ password: '', confirm: '' })
    } catch (error) {
      console.error('Không thể đổi mật khẩu user', error)
      setMessage('Không thể đổi mật khẩu trên máy chủ, vui lòng thử lại.')
    } finally {
      setActionLoading('')
    }
  }

  const editingUser = selectedUser ?? filteredUsers[0]

  const syncPreview = useMemo(() => ({
    frontend: editingUser?.status !== 'locked',
    mobile: editingUser?.status !== 'locked',
    channel: editingUser?.platform ?? 'Frontend',
  }), [editingUser])

  useEffect(() => {
    setPasswordForm({ password: '', confirm: '' })
  }, [selectedUserId])

  return (
    <div className="sa-page users-page">
      <section className="sa-section users-shell">
        <header className="users-header">
          <div>
            <p className="eyebrow">Customer management</p>
            <h2>Quản lý khách hàng</h2>
            <p>Đồng bộ toàn bộ tài khoản đăng nhập web & mobile. Khoá hoặc đổi mật khẩu áp dụng ngay cho cả hai kênh.</p>
            {message && <small className="hint">{message}</small>}
          </div>
          <div className="header-actions">
            <div className="live-sync">
              <span className={syncing ? 'live' : ''}>{syncing ? 'Đang đồng bộ' : 'Realtime đã kết nối'}</span>
              <small>{accessStats.total} tài khoản đang hiển thị</small>
            </div>
            <div className="header-buttons">
              <button type="button" className="ghost" onClick={loadUsers}>
                Đồng bộ
              </button>
              <button type="button" className="primary">Tạo mới</button>
            </div>
          </div>
        </header>

        <div className="users-meta">
          <div>
            <p className="eyebrow">Hoạt động</p>
            <strong>{accessStats.active} đang hoạt động</strong>
            <small>{accessStats.locked} tài khoản đang bị khoá</small>
          </div>
          <div>
            <p className="eyebrow">Kênh đăng nhập</p>
            <strong>{accessStats.frontend} Web frontend</strong>
            <small>{accessStats.mobile} App mobile</small>
          </div>
          <div>
            <p className="eyebrow">Phân loại</p>
            <strong>{segmentStats['Khách hàng']} khách hàng</strong>
            <small>{segmentStats.Shipper} shipper • {segmentStats.Merchant} merchant</small>
          </div>
        </div>

        <div className="user-panels">
          <div className="user-table-panel">
            <div className="user-filters">
              <input
                type="search"
                placeholder="Tìm tên, email, tài khoản"
                value={filters.search}
                onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              />
              <select
                value={filters.role}
                onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value }))}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="Khách hàng">Khách hàng</option>
                <option value="Shipper">Shipper</option>
                <option value="Merchant">Merchant</option>
              </select>
              <select
                value={filters.platform}
                onChange={(event) => setFilters((prev) => ({ ...prev, platform: event.target.value }))}
              >
                <option value="all">Tất cả kênh</option>
                <option value="Frontend">Frontend (Web)</option>
                <option value="Mobile">Mobile (App)</option>
              </select>
              <select
                value={filters.status}
                onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="locked">Khoá</option>
              </select>
            </div>

            <div className="user-table">
              <div className="table-head">
                <span>Khách hàng</span>
                <span>Email</span>
                <span>Ngày tạo</span>
                <span>Trạng thái</span>
                <span>Hành động</span>
              </div>
              <div className="table-body">
                {filteredUsers.map((user) => {
                  const isLocked = user.status === 'locked'
                  return (
                    <div
                      key={user.id}
                      className={`table-row ${user.id === selectedUserId ? 'active' : ''}`}
                      onClick={() => handleSelect(user.id)}
                    >
                      <div className="cell">
                        <strong>{user.name}</strong>
                        <small>{user.role}</small>
                      </div>
                      <div className="cell">
                        <div className="contact-line">{user.email}</div>
                        <small className="credential-hint">Tài khoản: {user.account} • Mật khẩu: {user.password}</small>
                        <small>{user.phone}</small>
                      </div>
                      <div className="cell">
                        <span className="pill neutral">{user.platform}</span>
                        <small>{user.createdAt}</small>
                      </div>
                      <div className="cell status-cell">
                        <span className={`status ${isLocked ? 'locked' : 'active'}`}>
                          {isLocked ? 'Khoá' : 'Hoạt động'}
                        </span>
                        <small>{user.verified ? 'Đã xác minh' : 'Chưa xác minh'}</small>
                      </div>
                      <div className="cell row-actions" onClick={(event) => event.stopPropagation()}>
                        <button type="button" className="ghost" onClick={() => handleSelect(user.id)}>
                          Xem
                        </button>
                        <button
                          type="button"
                          className={isLocked ? 'primary' : 'danger'}
                          disabled={actionLoading === `lock-${user.id}`}
                          onClick={() => handleToggleLock(user)}
                        >
                          {isLocked ? 'Mở khoá' : 'Khoá'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="segment-strip">
              {userSegments.map((segment) => (
                <div key={segment.role} className="segment-pill">
                  <div>
                    <p className="eyebrow">{segment.role}</p>
                    <strong>{segment.description}</strong>
                  </div>
                  <span>{segment.actions.join(' • ')}</span>
                </div>
              ))}
            </div>
          </div>

          {editingUser ? (
            <aside className="user-editor">
              <header>
                <div>
                  <p className="eyebrow">Thông tin khách hàng</p>
                  <h3>{editingUser.name}</h3>
                  <small>Thông tin đăng nhập hiển thị ở mọi kênh.</small>
                </div>
                <span className={`status ${editingUser.status === 'locked' ? 'locked' : 'active'}`}>
                  {editingUser.status === 'locked' ? 'Đã khoá' : 'Đang hoạt động'}
                </span>
              </header>

              <div className="inspector-grid">
                <label>
                  Họ tên
                  <input
                    value={editingUser.name}
                    onChange={(event) => handleFieldChange('name', event.target.value)}
                  />
                </label>
                <label>
                  Tài khoản đăng nhập
                  <input
                    value={editingUser.account}
                    onChange={(event) => handleFieldChange('account', event.target.value)}
                  />
                </label>
                <label>
                  Email đăng nhập
                  <input
                    value={editingUser.email}
                    onChange={(event) => handleFieldChange('email', event.target.value)}
                  />
                </label>
                <label>
                  Số điện thoại
                  <input
                    value={editingUser.phone}
                    onChange={(event) => handleFieldChange('phone', event.target.value)}
                  />
                </label>
                <label>
                  Thành phố
                  <input
                    value={editingUser.city}
                    onChange={(event) => handleFieldChange('city', event.target.value)}
                  />
                </label>
                <label>
                  Ngày tạo
                  <input
                    value={editingUser.createdAt}
                    onChange={(event) => handleFieldChange('createdAt', event.target.value)}
                  />
                </label>
              </div>

              <div className="input-grid">
                <label>
                  Vai trò
                  <select
                    value={editingUser.role}
                    onChange={(event) => handleFieldChange('role', event.target.value)}
                  >
                    <option value="Khách hàng">Khách hàng</option>
                    <option value="Shipper">Shipper</option>
                    <option value="Merchant">Merchant</option>
                  </select>
                </label>
                <label>
                  Nền tảng
                  <select
                    value={editingUser.platform}
                    onChange={(event) => handleFieldChange('platform', event.target.value)}
                  >
                    <option value="Frontend">Frontend (Web)</option>
                    <option value="Mobile">Mobile (App)</option>
                  </select>
                </label>
              </div>

              <div className="sync-preview">
                <div>
                  <p className="eyebrow">Frontend</p>
                  <strong>{syncPreview.frontend ? 'Có thể đăng nhập' : 'Đang bị khoá'}</strong>
                  <small>Áp dụng ngay khi lưu hoặc khoá/mở khoá.</small>
                </div>
                <div>
                  <p className="eyebrow">Mobile</p>
                  <strong>{syncPreview.mobile ? 'Có thể đăng nhập' : 'Đang bị khoá'}</strong>
                  <small>Đồng bộ cùng trạng thái với frontend.</small>
                </div>
                <div>
                  <p className="eyebrow">Kênh ưu tiên</p>
                  <strong>{syncPreview.channel}</strong>
                  <small>Dữ liệu hồ sơ chính lấy từ kênh này.</small>
                </div>
              </div>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={editingUser.verified}
                  onChange={(event) => handleFieldChange('verified', event.target.checked)}
                />
                Đã xác minh email/CMND
              </label>

              <div className="credential-card">
                <header>
                  <p className="eyebrow">Thông tin đăng nhập</p>
                  <span className="pill warning">Hiển thị đồng bộ</span>
                </header>
                <div className="credential-grid">
                  <div>
                    <small>Tài khoản</small>
                    <strong>{editingUser.account}</strong>
                  </div>
                  <div>
                    <small>Mật khẩu hiện tại</small>
                    <strong className="password-value">{editingUser.password}</strong>
                  </div>
                </div>
                <small>Những tài khoản đăng ký trước đây cũng hiển thị tài khoản/mật khẩu ngay tại đây.</small>
              </div>

              <div className="editor-actions">
                <button
                  type="button"
                  className="ghost"
                  disabled={actionLoading === `lock-${editingUser.id}`}
                  onClick={() => handleToggleLock(editingUser)}
                >
                  {editingUser.status === 'locked' ? 'Mở khoá đăng nhập' : 'Khoá đăng nhập'}
                </button>
                <button
                  type="button"
                  className="primary"
                  disabled={actionLoading === 'save'}
                  onClick={handleSave}
                >
                  Lưu & đồng bộ
                </button>
              </div>

              <div className="password-card">
                <header>
                  <div>
                    <p className="eyebrow">Đổi mật khẩu</p>
                    <strong>Mật khẩu mới áp dụng cho frontend & mobile</strong>
                  </div>
                  <span className="pill warning">Bảo vệ đăng nhập</span>
                </header>
                <div className="input-grid">
                  <label>
                    Mật khẩu mới
                    <input
                      type="password"
                      value={passwordForm.password}
                      placeholder="Tối thiểu 8 ký tự"
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, password: event.target.value }))}
                    />
                  </label>
                  <label>
                    Nhập lại
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      placeholder="Nhập lại để xác nhận"
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))}
                    />
                  </label>
                </div>
                <div className="editor-actions">
                  <small>Khuyến nghị thay đổi định kỳ, mật khẩu cũ sẽ hết hiệu lực ngay.</small>
                  <button
                    type="button"
                    className="primary"
                    disabled={actionLoading === `password-${editingUser.id}`}
                    onClick={handlePasswordSubmit}
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </div>
            </aside>
          ) : null}
        </div>
      </section>
    </div>
  )
}

export default Users
