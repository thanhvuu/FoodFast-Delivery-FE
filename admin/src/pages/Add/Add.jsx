import React, { useEffect, useMemo, useState } from 'react'
import './Add.css'
import { assests } from '../../assets/assest'
import { useAdminLanguage } from '../../context/LanguageContext'

const Add = ({ onAddProduct, restaurant }) => {
    const { dictionary } = useAdminLanguage()
    const t = dictionary.addPage

    const defaultCategory = useMemo(
        () => t.categories[0]?.value ?? '',
        [t.categories]
    )

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: defaultCategory,
        price: '',
        status: 'available',
        restaurantName: restaurant?.name || '',
        restaurantAddress: restaurant?.address || '',
    })
    const [imagePreview, setImagePreview] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [lastSavedId, setLastSavedId] = useState(null)

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            category: t.categories.some(option => option.value === prev.category)
                ? prev.category
                : defaultCategory,
        }))
    }, [t.categories, defaultCategory])

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview)
            }
        }
    }, [imagePreview])

    const handleChange = event => {
        const { name, value } = event.target
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleImageChange = event => {
        const file = event.target.files?.[0]
        if (!file) return
        const previewUrl = URL.createObjectURL(file)
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview)
        }
        setImagePreview(previewUrl)
        setImageFile(file)
    }

    const handleSubmit = async event => {
        event.preventDefault()
        if (!onAddProduct) return

        const trimmedName = formData.name.trim()
        if (!trimmedName) {
            return
        }

        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(file)
            })

        let imageToSave = imagePreview || assests.upload_area
        if (imageFile) {
            try {
                imageToSave = await toBase64(imageFile)
            } catch (err) {
                console.error('Không thể đọc ảnh tải lên, dùng ảnh mặc định', err)
                imageToSave = assests.upload_area
            }
        }

        const newProduct = {
            _id: `prod-${Date.now()}`,
            name: trimmedName,
            description: formData.description.trim(),
            category: formData.category,
            price: Number(formData.price) || 0,
            status: formData.status,
            image: imageToSave,
            restaurant: restaurant
                ? { id: restaurant.id, name: restaurant.name, address: restaurant.address }
                : {
                    name: formData.restaurantName.trim(),
                    address: formData.restaurantAddress.trim(),
                },
        }

        try {
            const created = await onAddProduct(newProduct)
            setLastSavedId(created?._id || newProduct._id)
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm', error)
            return
        }
        setFormData({
            name: '',
            description: '',
            category: defaultCategory,
            price: '',
            status: 'available',
            restaurantName: restaurant?.name || '',
            restaurantAddress: restaurant?.address || '',
        })
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview)
        }
        setImagePreview('')
        setImageFile(null)
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={handleSubmit}>
                <div className="add-img-upload flex-col">
                    <p>{t.uploadLabel}</p>
                    <label htmlFor="image">
                        <img src={imagePreview || assests.upload_area} alt="preview" />
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                    />
                </div>
                <div className="add-product-name flex-col">
                    <p>{t.nameLabel}</p>
                    <input
                        type="text"
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t.namePlaceholder}
                        required
                    />
                </div>
                <div className="add-product-description flex-col">
                    <p>{t.descriptionLabel}</p>
                    <textarea
                        name="description"
                        rows="6"
                        placeholder={t.descriptionPlaceholder}
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>
                {restaurant ? (
                    <div className="add-restaurant flex-col">
                        <p>{t.restaurantNameLabel}</p>
                        <div className="readonly-field">
                            <strong>{restaurant.name}</strong>
                            <div style={{ color: '#6b7280', marginTop: 4 }}>{restaurant.address}</div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="add-restaurant flex-col">
                            <p>{t.restaurantNameLabel}</p>
                            <input
                                type="text"
                                name="restaurantName"
                                value={formData.restaurantName}
                                onChange={handleChange}
                                placeholder={t.restaurantNamePlaceholder}
                            />
                        </div>
                        <div className="add-restaurant flex-col">
                            <p>{t.restaurantAddressLabel}</p>
                            <input
                                type="text"
                                name="restaurantAddress"
                                value={formData.restaurantAddress}
                                onChange={handleChange}
                                placeholder={t.restaurantAddressPlaceholder}
                            />
                        </div>
                    </>
                )}
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>{t.categoryLabel}</p>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            {t.categories.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>{t.priceLabel}</p>
                        <input
                            type="number"
                            name='price'
                            min='0'
                            step='1000'
                            placeholder={t.pricePlaceholder}
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <div className='add-status flex-col'>
                    <p>{t.statusLabel}</p>
                    <select name='status' value={formData.status} onChange={handleChange}>
                        {t.statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button type='submit' className='add-btn'>{t.submit}</button>
                {lastSavedId && (
                    <p className='add-success'>{t.successMessage}</p>
                )}
            </form>
        </div>
    )
}

export default Add
