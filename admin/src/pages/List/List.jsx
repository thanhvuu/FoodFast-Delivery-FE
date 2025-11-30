import React, { useMemo, useState } from 'react'
import './List.css'
import FoodEdit from '../../component/FoodEdit/FoodEdit' // Đường dẫn đúng đến FoodEdit.jsx
import { useAdminLanguage } from '../../context/LanguageContext'

const List = ({ products = [], onDelete, onUpdate }) => {
    const [editingProduct, setEditingProduct] = useState(null)
    const { dictionary, formatCurrency } = useAdminLanguage()
    const t = dictionary.listPage

    const enhancedProducts = useMemo(() => products.map(item => ({
        status: 'available',
        ...item,
       productId: item.id ?? item.productId ?? item._id,
    })), [products])

    // Xoá sản phẩm
    const handleDelete = async (id) => {
        if (!id) return
        if (window.confirm(t.confirmDelete)) {
            await onDelete?.(id)
        }
    }

    // Mở popup chỉnh sửa
    const handleEdit = (product) => {
        setEditingProduct(product)
    }

    // Lưu sản phẩm đã sửa từ popup
    const handleSaveEdit = (updatedProduct) => {
        onUpdate?.(updatedProduct)
        setEditingProduct(null)
    }

    // Đóng popup
    const handleCloseEdit = () => setEditingProduct(null)

    const handleToggleStatus = (product) => {
        const nextStatus = product.status === 'available' ? 'out_of_stock' : 'available'
        onUpdate?.({ ...product, status: nextStatus })
    }

    const statusLabels = t.statusLabels || {}

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
                        <th>{t.columns.status}</th>
                        <th>{t.columns.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {enhancedProducts.map(item => (
                        <tr key={item.productId}>
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
                                <span className={`status-pill ${item.status === 'available' ? 'status-available' : 'status-out'}`}>
                                    {statusLabels[item.status] || item.status}
                                </span>
                            </td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(item)}>{t.edit}</button>
                                <button className="delete-btn" onClick={() => handleDelete(item.productId)}>{t.delete}</button>
                                <button
                                    className="status-toggle-btn"
                                    onClick={() => handleToggleStatus(item)}
                                    type='button'
                                >
                                    {item.status === 'available' ? t.markOutOfStock : t.markAvailable}
                                </button>
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
