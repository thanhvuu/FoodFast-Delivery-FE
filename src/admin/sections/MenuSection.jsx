import { useMemo, useState } from 'react'
import './MenuSection.css'

const emptyForm = {
  id: '',
  name: '',
  category: 'Fast Food',
  price: 0,
  status: 'Đang bán',
  description: '',
}

const MenuSection = ({ menuItems, onSave, onRemove }) => {
  const [formState, setFormState] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const totalActive = useMemo(() => menuItems.filter((item) => item.status !== 'Tạm ngưng').length, [menuItems])

  const resetForm = () => {
    setFormState(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...formState,
      price: Number(formState.price),
      id: editingId ?? formState.id,
      featured: Boolean(formState.featured),
    }
    onSave(payload)
    resetForm()
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setFormState({ ...item })
  }

  return (
    <div className='menu-section'>
      <div className='menu-header'>
        <div>
          <h3>Thực đơn hiện hành</h3>
          <p>
            {totalActive}/{menuItems.length} món đang bán • dữ liệu lưu bằng JSON, cập nhật realtime cho admin và user.
          </p>
        </div>
        <button type='button' className='ghost-btn' onClick={resetForm}>
          Tạo món mới
        </button>
      </div>

      <form className='menu-form' onSubmit={handleSubmit}>
        <div className='form-grid'>
          <label>
            Mã món
            <input
              required={!editingId}
              value={formState.id}
              onChange={(event) => setFormState((prev) => ({ ...prev, id: event.target.value }))}
              placeholder='Ví dụ: 99'
              disabled={!!editingId}
            />
          </label>
          <label>
            Tên món
            <input
              required
              value={formState.name}
              onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label>
            Danh mục
            <select
              value={formState.category}
              onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option>Fast Food</option>
              <option>Đồ ăn vặt</option>
              <option>Đồ ngọt</option>
              <option>Món nước</option>
              <option>Món khô</option>
              <option>Thức uống</option>
            </select>
          </label>
          <label>
            Giá bán (đ)
            <input
              type='number'
              min='0'
              value={formState.price}
              onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
            />
          </label>
          <label>
            Trạng thái
            <select
              value={formState.status}
              onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option>Đang bán</option>
              <option>Tạm ngưng</option>
            </select>
          </label>
          <label className='featured-check'>
            <input
              type='checkbox'
              checked={Boolean(formState.featured)}
              onChange={(event) => setFormState((prev) => ({ ...prev, featured: event.target.checked }))}
            />
            Hiển thị nổi bật trên trang user
          </label>
        </div>
        <label>
          Mô tả món ăn
          <textarea
            rows='3'
            value={formState.description}
            onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
          />
        </label>
        <div className='form-actions'>
          {editingId && (
            <button type='button' className='ghost-btn' onClick={resetForm}>
              Hủy chỉnh sửa
            </button>
          )}
          <button type='submit' className='primary-btn'>
            {editingId ? 'Cập nhật món' : 'Thêm món'}
          </button>
        </div>
      </form>

      <div className='menu-table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên món</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </td>
                <td>{item.category}</td>
                <td>{item.price.toLocaleString('vi-VN')}đ</td>
                <td>
                  <span className={`status-pill ${item.status === 'Đang bán' ? 'active' : 'paused'}`}>
                    {item.status}
                  </span>
                </td>
                <td className='actions'>
                  <button type='button' onClick={() => handleEdit(item)}>
                    Sửa
                  </button>
                  <button type='button' className='danger' onClick={() => onRemove(item.id)}>
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


export default MenuSection
