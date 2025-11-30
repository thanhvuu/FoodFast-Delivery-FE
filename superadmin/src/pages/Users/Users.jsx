import { useEffect, useMemo, useState } from 'react'
import { seedUsers, userSegments } from '../../data/userData'
import { deleteUser as deleteUserApi, fetchUsers as fetchUsersApi, updateUser as updateUserApi } from '../../services/api'
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
})

const mergeUsers = (base, incoming) => {
  const unique = new Map()
  base.forEach((user) => unique.set(user.id, normalizeUser(user)))
  incoming.forEach((user) => unique.set(user.id, normalizeUser(user)))
  return Array.from(unique.values())
}

function Users() {
  const [users, setUsers] = useState(() => seedUsers.map(normalizeUser))
  const [filters, setFilters] = useState({ role: 'all', platform: 'all', search: '' })
  const [selectedUserId, setSelectedUserId] = useState(seedUsers[0]?.id ?? '')
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadUsers = async () => {
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
        }
      } catch (error) {
        console.warn('Không thể đồng bộ danh sách user', error)
        setMessage('Không thể đồng bộ realtime, đang hiển thị dữ liệu lưu sẵn.')
      } finally {
        setSyncing(false)
      }
    }

    loadUsers()
  }, [])

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? users[0],
    [selectedUserId, users]
  )

  const filteredUsers = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    return users.filter((user) => {
      const matchRole = filters.role === 'all' || user.role === filters.role
      const matchPlatform = filters.platform === 'all' || user.platform === filters.platform
      const matchText = !query
        || user.name.toLowerCase().includes(query)
        || user.email.toLowerCase().includes(query)
        || user.phone.toLowerCase().includes(query)
      return matchRole && matchPlatform && matchText
    })
  }, [filters.platform, filters.role, filters.search, users])

  const segmentStats = useMemo(() => {
    const base = { Khách hàng: 0, Shipper: 0, Merchant: 0 }
    users.forEach((user) => {
      const role = user.role in base ? user.role : 'Khách hàng'
      base[role] += 1
    })
    return base
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
    try {
      await updateUserApi(selectedUser.id, selectedUser)
      setMessage('Đã đồng bộ thông tin tài khoản thành công.')
    } catch (error) {
      console.error('Không thể cập nhật user', error)
      setMessage('Không thể đồng bộ lên máy chủ, đã lưu tại giao diện.')
    }
  }

  const handleToggleLock = async (user) => {
    const nextStatus = user.status === 'locked' ? 'active' : 'locked'
    setUsers((prev) => prev.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item)))
    setMessage('Đang đồng bộ trạng thái khoá tài khoản…')
    try {
      await updateUserApi(user.id, { status: nextStatus })
      setMessage('Đã cập nhật trạng thái khoá/mở tài khoản.')
    } catch (error) {
      console.error('Không thể cập nhật trạng thái user', error)
      setMessage('Không thể đồng bộ trạng thái, vui lòng thử lại.')
    }
  }

  const handleDelete = async (user) => {
    if (!user) return
    setUsers((prev) => prev.filter((item) => item.id !== user.id))
    setMessage('Đang xoá tài khoản…')
    try {
      await deleteUserApi(user.id)
      setMessage('Tài khoản đã bị xoá khỏi hệ thống.')
    } catch (error) {
      console.error('Không thể xoá user', error)
      setMessage('Không thể xoá khỏi máy chủ, đã xoá tạm tại giao diện.')
    }
  }

  const editingUser = selectedUser ?? filteredUsers[0]

  return (
    <div className="sa-page users-page">
      <section className="sa-section">
        <header>
          <div>
            <h2>Quản lý người dùng</h2>
            <p>Kiểm soát quyền truy cập, trạng thái xác minh và hành động xử lý nhanh cho frontend & mobile.</p>
            {message && <small className="hint">{message}</small>}
          </div>
          <div className="sync-badge">
            <span className={syncing ? 'live' : ''}>Đồng bộ realtime</span>
            <small>{syncing ? 'Đang kết nối' : 'Dữ liệu cập nhật'}</small>
          </div>
        </header>

        <div className="segment-grid">
          {userSegments.map((segment) => (
            <article key={segment.role} className="segment-card">
              <header>
                <h3>{segment.role}</h3>
                <span>{segmentStats[segment.role] ?? 0} user</span>
              </header>
              <p>{segment.description}</p>
              <div className="segment-actions">
                {segment.actions.map((action) => (
                  <button key={action} type="button">{action}</button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="user-management">
          <div className="user-filters">
            <input
              type="search"
              placeholder="Tìm theo tên, email, SĐT"
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
          </div>

          <div className="user-table">
            <header>
              <div>
                <h3>Danh sách tài khoản</h3>
                <small>Được đồng bộ hai chiều cho giao diện web và ứng dụng.</small>
              </div>
              <span className="total-count">{filteredUsers.length} user</span>
            </header>
            <div className="table-head">
              <span>User</span>
              <span>Liên hệ</span>
              <span>Nền tảng</span>
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
                    <div>
                      <strong>{user.name}</strong>
                      <small>{user.role}</small>
                    </div>
                    <div>
                      <span>{user.email}</span>
                      <small>{user.phone}</small>
                    </div>
                    <div>
                      <span className="pill">{user.platform}</span>
                      <small>{user.city}</small>
                    </div>
                    <div>
                      <span className={`status ${isLocked ? 'locked' : 'active'}`}>
                        {isLocked ? 'Đã khoá' : 'Hoạt động'}
                      </span>
                      <small>{user.verified ? 'Đã xác minh' : 'Chưa xác minh'}</small>
                    </div>
                    <div className="row-actions" onClick={(event) => event.stopPropagation()}>
                      <button type="button" className="ghost" onClick={() => handleSelect(user.id)}>Sửa</button>
                      <button type="button" className="ghost" onClick={() => handleToggleLock(user)}>
                        {isLocked ? 'Mở khoá' : 'Khoá'}
                      </button>
                      <button type="button" className="danger" onClick={() => handleDelete(user)}>Xoá</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {editingUser ? (
            <aside className="user-editor">
              <header>
                <div>
                  <p className="eyebrow">Chỉnh sửa thông tin</p>
                  <h3>{editingUser.name}</h3>
                  <small>Mọi thay đổi được đồng bộ cả frontend và mobile login.</small>
                </div>
                <span className={`status ${editingUser.status === 'locked' ? 'locked' : 'active'}`}>
                  {editingUser.status === 'locked' ? 'Đã khoá' : 'Đang hoạt động'}
                </span>
              </header>
              <label>
                Họ tên
                <input
                  value={editingUser.name}
                  onChange={(event) => handleFieldChange('name', event.target.value)}
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
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={editingUser.verified}
                  onChange={(event) => handleFieldChange('verified', event.target.checked)}
                />
                Đã xác minh email/CMND
              </label>
              <div className="editor-actions">
                <button type="button" className="ghost" onClick={() => handleToggleLock(editingUser)}>
                  {editingUser.status === 'locked' ? 'Mở khoá đăng nhập' : 'Khoá đăng nhập'}
                </button>
                <button type="button" className="primary" onClick={handleSave}>Lưu & đồng bộ</button>
              </div>
            </aside>
          ) : null}
        </div>
      </section>
    </div>
  )
}

export default Users
