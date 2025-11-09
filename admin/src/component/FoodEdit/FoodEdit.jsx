import React, { useState, useEffect } from 'react'
import './FoodEdit.css'
import { useAdminLanguage } from '../../context/LanguageContext'

const FoodEdit = ({ food, onSave, onClose }) => {
    // Bản sao state để edit live
    const [editData, setEditData] = useState(food || {})
    const { dictionary } = useAdminLanguage()
    const t = dictionary.foodEdit

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
                <h3>{t.title.replace('{{name}}', food.name)}</h3>
                <label>
                    {t.fields.name}
                    <input
                        name="name"
                        value={editData.name || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    {t.fields.price}
                    <input
                        name="price"
                        value={editData.price || ''}
                        onChange={handleChange}
                        type="number"
                        required
                    />
                </label>
                <label>
                    {t.fields.category}
                    <input
                        name="category"
                        value={editData.category || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    {t.fields.description}
                    <textarea
                        name="description"
                        value={editData.description || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    {t.fields.ingredients}
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
                    {t.fields.address}
                    <input
                        name="address"
                        value={editData.address || ''}
                        onChange={handleChange}
                    />
                </label>
                <div className="popup-btn-group">
                    <button type="submit" className="save-btn">{t.actions.save}</button>
                    <button type="button" onClick={onClose} className="close-btn">{t.actions.close}</button>
                </div>
            </form>
        </div>
    )
}

export default FoodEdit
