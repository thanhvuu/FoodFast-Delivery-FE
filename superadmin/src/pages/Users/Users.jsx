import { useCallback, useEffect, useMemo, useState } from 'react'
import { seedUsers, userSegments } from '../../data/userData'
import {
  changeUserPassword as changeUserPasswordApi,
  deleteUser as deleteUserApi,
  fetchUsers as fetchUsersApi,
  updateUser as updateUserApi,
} from '../../services/api'
import './Users.css'

const normalizeUser = (user) => {
  const roleMap = {
    restaurant: 'Merchant',
    merchant: 'Merchant',
    shipper: 'Shipper',
    'Khách hàng': 'Khách hàng',
  }
  const role = roleMap[user?.role] ?? 'Khách hàng'

  return {
    id: user?.id ?? user?._id ?? crypto.randomUUID(),
    name: user?.name ?? user?.username ?? 'Không rõ tên',
    email: user?.email ?? 'chua-cap-nhat@foodfast.vn',
    phone: user?.phone ?? '—',
    role,
    platform: user?.platform ?? user?.channel ?? 'Frontend',
    status: user?.status ?? 'active',
    verified: Boolean(user?.verified ?? user?.isVerified ?? false),
    lastActive: user?.lastActive ?? 'Chưa có',
    city: user?.city ?? user?.address ?? '—',
  }
}

const mergeUsers = (base, incoming) => {
  const unique = new Map()
  base.forEach((user) => unique.set(user.id, normalizeUser(user)))
  incoming.forEach((user) => unique.set(user.id, normalizeUser(user)))
  return Array.from(unique.values())
}

function Users() {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ role: 'all', platform: 'all', search: '' })
  const [selectedUserId, setSelectedUserId] = useState('')
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
        setMessage('Đã lấy danh sách người dùng từ backend (dtb.json).')
      } else {
        setUsers(seedUsers.map(normalizeUser))
        setSelectedUserId(seedUsers[0]?.id ?? '')
        setMessage('Backend chưa có dữ liệu, đang dùng dữ liệu mẫu.')
      }
    } catch (error) {
      console.warn('Không thể đồng bộ danh sách user', error)
      setUsers(seedUsers.map(normalizeUser))
      setSelectedUserId(seedUsers[0]?.id ?? '')
      setMessage('Không thể lấy từ backend, đang hiển thị dữ liệu mẫu.')
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
      const matchText = !query
        || user.name.toLowerCase().includes(query)
        || user.email.toLowerCase().includes(query)
        || user.phone.toLowerCase().includes(query)
      return matchRole && matchPlatform && matchText
    })
  }, [filters.platform, filters.role, filters.search, users])

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

  const handleDelete = async (user) => {
    if (!user) return
    if (!window.confirm('Xoá tài khoản này? Người dùng sẽ không thể đăng nhập frontend hoặc mobile.')) return
    setUsers((prev) => prev.filter((item) => item.id !== user.id))
    setMessage('Đang xoá tài khoản…')
    setActionLoading(`delete-${user.id}`)
    try {
      await deleteUserApi(user.id)
      setMessage('Tài khoản đã bị xoá khỏi hệ thống.')
    } catch (error) {
      console.error('Không thể xoá user', error)
      setMessage('Không thể xoá khỏi máy chủ, đã xoá tạm tại giao diện.')
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
      <section className="sa-section">
        <header>
          <div>
            <h2>Quản lý người dùng</h2>
            <p>Kiểm soát tài khoản đăng nhập trên frontend & mobile, khoá/xoá sẽ ngăn đăng nhập lập tức.</p>
            {message && <small className="hint">{message}</small>}
          </div>
          <div className="sync-badge">
            <span className={syncing ? 'live' : ''}>Đồng bộ realtime</span>
            <small>{syncing ? 'Đang kết nối' : 'Dữ liệu cập nhật'}</small>
            <button type="button" onClick={loadUsers}>Đồng bộ ngay</button>
          </div>
        </header>

        <div className="access-grid">
          <article className="access-card">
            <header>
              <div>
                <p className="eyebrow">Trạng thái đăng nhập</p>
                <h3>{accessStats.active} đang hoạt động</h3>
              </div>
              <span className="pill success">{accessStats.locked} đã khoá</span>
            </header>
            <p>Các tài khoản khoá hoặc bị xoá sẽ không thể đăng nhập trên cả web frontend và app mobile.</p>
            <div className="platform-stats">
              <span className="pill neutral">{accessStats.frontend} Frontend</span>
              <span className="pill neutral">{accessStats.mobile} Mobile</span>
            </div>
          </article>
          <article className="access-card">
            <header>
              <div>
                <p className="eyebrow">Đồng bộ 2 kênh</p>
                <h3>Một lần thao tác = áp dụng cả hai</h3>
              </div>
              <span className="pill warning">Frontend & Mobile</span>
            </header>
            <p>Mọi cập nhật hồ sơ, khoá/mở khoá đều đẩy sang cả web khách hàng và ứng dụng mobile để tránh sai lệch.</p>
            <ul className="sync-rules">
              <li>Sửa thông tin: hiển thị thống nhất trên tất cả thiết bị.</li>
              <li>Khoá đăng nhập: chặn ngay lập tức trên web + app.</li>
              <li>Mở khoá: cấp quyền lại cho cả hai kênh cùng lúc.</li>
            </ul>
          </article>
          <article className="access-card policies">
            <header>
              <div>
                <p className="eyebrow">Chính sách bảo mật</p>
                <h3>Bảo vệ đăng nhập</h3>
              </div>
              <span className="pill warning">Đổi mật khẩu tại đây</span>
            </header>
            <ul>
              <li>Khoá login: chặn đăng nhập ngay lập tức trên web + app.</li>
              <li>Xoá tài khoản: vô hiệu hoá hoàn toàn, không thể phục hồi đăng nhập.</li>
              <li>Đổi mật khẩu: áp dụng cho cả frontend và mobile, yêu cầu nhập lại khi đăng nhập.</li>
            </ul>
          </article>
        </div>

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
                <small>Khoá/Xoá sẽ ngăn đăng nhập ngay trên frontend & mobile.</small>
              </div>
              <span className="total-count">{filteredUsers.length} user</span>
            </header>
            <div className="table-head">
              <span>Tài khoản</span>
              <span>Liên hệ</span>
              <span>Nền tảng</span>
              <span>Đăng nhập</span>
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
                      <button type="button" className="ghost" onClick={() => handleSelect(user.id)}>
                        Sửa
                      </button>
                      <button
                        type="button"
                        className="ghost"
                        disabled={actionLoading === `lock-${user.id}`}
                        onClick={() => handleToggleLock(user)}
                      >
                        {isLocked ? 'Mở khoá' : 'Khoá login'}
                      </button>
                      <button
                        type="button"
                        className="danger"
                        disabled={actionLoading === `delete-${user.id}`}
                        onClick={() => handleDelete(user)}
                      >
                        Xoá vĩnh viễn
                      </button>
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
              <label>
                Thành phố
                <input
                  value={editingUser.city}
                  onChange={(event) => handleFieldChange('city', event.target.value)}
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
