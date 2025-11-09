import React, { useState } from 'react'
import { food_list } from '../../assets/assest'
import './List.css'
import FoodEdit from '../../component/FoodEdit/FoodEdit' // Đường dẫn đúng đến FoodEdit.jsx
import { useAdminLanguage } from '../../context/LanguageContext'

const List = () => {
    const [products, setProducts] = useState(food_list)
    const [editingProduct, setEditingProduct] = useState(null)
    const { dictionary, formatCurrency } = useAdminLanguage()
    const t = dictionary.listPage

    // Xoá sản phẩm
    const handleDelete = (id) => {
        if (window.confirm(t.confirmDelete)) {
            setProducts(products.filter(item => item._id !== id))
        }
    }

    // Mở popup chỉnh sửa
    const handleEdit = (product) => {
        setEditingProduct(product)
    }

    // Lưu sản phẩm đã sửa từ popup
    const handleSaveEdit = (updatedProduct) => {
        setProducts(products.map(item =>
            item._id === updatedProduct._id ? updatedProduct : item
        ))
        setEditingProduct(null)
    }

    // Đóng popup
    const handleCloseEdit = () => setEditingProduct(null)

    return (
        <div className="admin-products-list">
            <h2>{t.title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>{t.columns.image}</th>
                        <th>{t.columns.name}</th>
                        <th>{t.columns.description}</th>
                        <th>{t.columns.category}</th>
                        <th>{t.columns.price}</th>
                        <th>{t.columns.restaurant}</th>
                        <th>{t.columns.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(item => (
                        <tr key={item._id}>
                            <td>
                                <img src={item.image} alt={item.name} className='prod-img' />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.category}</td>
                            <td>{formatCurrency(item.price)}</td>
                            <td>
                                {item.restaurant?.name}<br />
                                <span style={{ fontSize: 12, color: '#888' }}>{item.restaurant?.address}</span>
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(item)}>{t.edit}</button>
                                <button className="delete-btn" onClick={() => handleDelete(item._id)}>{t.delete}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {editingProduct &&
                <FoodEdit
                    food={editingProduct}
                    onSave={handleSaveEdit}
                    onClose={handleCloseEdit}
                />
            }
        </div>
    )
}

export default List
