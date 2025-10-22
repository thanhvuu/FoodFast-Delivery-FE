import { useMemo, useState } from 'react'
import './CustomersSection.css'

const emptyCustomer = {
  id: '',
  name: '',
  email: '',
  phone: '',
  tier: 'Mới',
  status: 'Hoạt động',
}

const CustomersSection = ({ customers, onSave, onRemove, onPersist }) => {
  const [formState, setFormState] = useState(emptyCustomer)
  const [editingId, setEditingId] = useState(null)

  const stats = useMemo(() => {
    return {
      active: customers.filter((customer) => customer.status === 'Hoạt động').length,
      locked: customers.filter((customer) => customer.status !== 'Hoạt động').length,
      gold: customers.filter((customer) => customer.tier === 'Gold').length,
    }
  }, [customers])

  const resetForm = () => {
    setFormState(emptyCustomer)
    setEditingId(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...formState,
      id: editingId ?? formState.id,
      lastOrder: formState.lastOrder || new Date().toISOString(),
    }
    onSave(payload)
    resetForm()
  }

  const handleEdit = (customer) => {
    setEditingId(customer.id)
    setFormState(customer)
  }

  const handleImport = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'application/json'
    fileInput.onchange = (event) => {
      const file = event.target.files?.[0]
      if (!file) return
      file.text().then((text) => {
        try {
          const data = JSON.parse(text)
          if (!Array.isArray(data)) return
          onPersist(data)
        } catch (error) {
          console.error('Không thể đọc file khách hàng', error)
        }
      })
    }
    fileInput.click()
  }

  return (
    <div className='customers-section'>
      <div className='customers-stats'>
        <article>
          <span>Đang hoạt động</span>
          <strong>{stats.active}</strong>
        </article>
        <article>
          <span>Đang tạm khóa</span>
          <strong>{stats.locked}</strong>
        </article>
        <article>
          <span>Hạng Gold</span>
          <strong>{stats.gold}</strong>
        </article>
        <button type='button' className='import-btn' onClick={handleImport}>
          Nhập từ JSON
        </button>
      </div>

      <form className='customer-form' onSubmit={handleSubmit}>
        <div className='form-grid'>
          <label>
            Mã khách hàng
            <input
              required={!editingId}
              value={formState.id}
              onChange={(event) => setFormState((prev) => ({ ...prev, id: event.target.value }))}
              placeholder='CUS-010'
              disabled={!!editingId}
            />
          </label>
          <label>
            Họ tên
            <input
              required
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label>
            Email
            <input
              required
              type='email'
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
            />
          </label>
          <label>
            Số điện thoại
            <input
              required
              value={formState.phone}
              onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
            />
          </label>
          <label>
            Hạng thành viên
            <select
              value={formState.tier}
              onChange={(event) => setFormState((prev) => ({ ...prev, tier: event.target.value }))}
            >
              <option>Mới</option>
              <option>Silver</option>
              <option>Gold</option>
            </select>
          </label>
          <label>
            Trạng thái
            <select
              value={formState.status}
              onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option>Hoạt động</option>
              <option>Tạm khóa</option>
            </select>
          </label>
        </div>
        <div className='form-actions'>
          {editingId && (
            <button type='button' className='ghost-btn' onClick={resetForm}>
              Hủy chỉnh sửa
            </button>
          )}
          <button type='submit' className='primary-btn'>
            {editingId ? 'Cập nhật khách hàng' : 'Thêm khách hàng'}
          </button>
        </div>
      </form>

      <div className='customers-table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khách hàng</th>
              <th>Liên hệ</th>
              <th>Hạng</th>
              <th>Trạng thái</th>
              <th>Lần đặt cuối</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>
                  <p>{customer.email}</p>
                  <p>{customer.phone}</p>
                </td>
                <td>{customer.tier}</td>
                <td>
                  <span className={`status-pill ${customer.status === 'Hoạt động' ? 'active' : 'paused'}`}>
                    {customer.status}
                  </span>
                </td>
                <td>{new Date(customer.lastOrder).toLocaleDateString('vi-VN')}</td>
                <td className='actions'>
                  <button type='button' onClick={() => handleEdit(customer)}>
                    Sửa
                  </button>
                  <button type='button' className='danger' onClick={() => onRemove(customer.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


export default CustomersSection
