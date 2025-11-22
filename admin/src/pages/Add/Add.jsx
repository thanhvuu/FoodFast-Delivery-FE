import React, { useEffect, useMemo, useState } from 'react'
import './Add.css'
import { assests } from '../../assets/assest'
import { useAdminLanguage } from '../../context/LanguageContext'

const Add = ({ onAddProduct }) => {
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
    })
    const [imagePreview, setImagePreview] = useState('')
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
    }

    const handleSubmit = event => {
        event.preventDefault()
        if (!onAddProduct) return

        const trimmedName = formData.name.trim()
        if (!trimmedName) {
            return
        }

        const newProduct = {
            _id: `prod-${Date.now()}`,
            name: trimmedName,
            description: formData.description.trim(),
            category: formData.category,
            price: Number(formData.price) || 0,
            status: formData.status,
            image: imagePreview || assests.upload_area,
            restaurant: {
                name: '',
                address: '',
            },
        }

        onAddProduct(newProduct)
        setLastSavedId(newProduct._id)
        setFormData({
            name: '',
            description: '',
            category: defaultCategory,
            price: '',
            status: 'available',
        })
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview)
        }
        setImagePreview('')
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
