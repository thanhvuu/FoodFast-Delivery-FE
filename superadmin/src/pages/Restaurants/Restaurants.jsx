import { useEffect, useMemo, useState } from 'react'
import './Restaurants.css'

function Restaurants() {
  const [form, setForm] = useState({ name: '', owner: '', city: '' })
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '')
  const RESOURCE_URL = `${API_BASE_URL}/restaurants`

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(RESOURCE_URL)
        if (!res.ok) throw new Error('Không tải được danh sách nhà hàng')
        const data = await res.json()
        setRows(Array.isArray(data) ? data : [])
        setError('')
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Không thể tải danh sách')
      }
    }
    fetchData()
  }, [RESOURCE_URL])

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
    if (!form.name.trim() || !form.owner.trim() || !form.city.trim()) return;
    const payload = {
      name: form.name.trim(),
      owner: form.owner.trim(),
      city: form.city.trim(),
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
      setRows((prev) => [created, ...prev])
      setForm({ name: '', owner: '', city: '' })
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
        <div className="add-form">
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Tên cửa hàng"
          />
          <input
            value={form.owner}
            onChange={(e) => setForm((p) => ({ ...p, owner: e.target.value }))}
            placeholder="Chủ sở hữu"
          />
          <input
            value={form.city}
            onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
            placeholder="Thành phố"
          />
          <button type="button" onClick={handleAdd}>Thêm cửa hàng</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nhà hàng</th>
                <th>Chủ sở hữu</th>
                <th>Thành phố</th>
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
                return (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.owner}</td>
                    <td>{row.city}</td>
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
