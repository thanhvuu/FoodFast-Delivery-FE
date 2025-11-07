import React, { useState, useEffect } from 'react'
import './FoodEdit.css'

const FoodEdit = ({ food, onSave, onClose }) => {
    // Bản sao state để edit live
    const [editData, setEditData] = useState(food || {})

    useEffect(() => {
        setEditData(food)
    }, [food])

    if (!food) return null // Không truyền food thì không hiện (ẩn popup)

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Đổi giá, đổi hình, đổi category... đều chung handleChange, string thôi
    // Riêng ingredients thì nhập chuỗi rồi tách mảng khi save (Xem bên dưới)

    const handleSubmit = (e) => {
        e.preventDefault()
        // Đảm bảo ingredients là mảng
        onSave({
            ...editData,
            ingredients: typeof editData.ingredients === 'string'
                ? editData.ingredients.split(',').map(x => x.trim())
                : editData.ingredients
        })
    }

    return (
        <div className="popup-overlay">
            <form className="food-edit-popup" onSubmit={handleSubmit}>
                <h3>Chỉnh sửa món: {food.name}</h3>
                <label>
                    Tên món
                    <input
                        name="name"
                        value={editData.name || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Giá
                    <input
                        name="price"
                        value={editData.price || ''}
                        onChange={handleChange}
                        type="number"
                        required
                    />
                </label>
                <label>
                    Danh mục
                    <input
                        name="category"
                        value={editData.category || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Mô tả
                    <textarea
                        name="description"
                        value={editData.description || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Thành phần (cách nhau bởi dấu phẩy)
                    <input
                        name="ingredients"
                        value={
                            Array.isArray(editData.ingredients)
                                ? editData.ingredients.join(', ')
                                : editData.ingredients || ''
                        }
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Địa chỉ
                    <input
                        name="address"
                        value={editData.address || ''}
                        onChange={handleChange}
                    />
                </label>
                <div className="popup-btn-group">
                    <button type="submit" className="save-btn">Lưu thay đổi</button>
                    <button type="button" onClick={onClose} className="close-btn">Đóng</button>
                </div>
            </form>
        </div>
    )
}

export default FoodEdit
