import React, { useState } from 'react'
import './Add.css'
import { assests } from '../../assets/assest'
import { useAdminLanguage } from '../../context/LanguageContext'

const Add = () => {

    const [image, setIamge] = useState(false);
    const { dictionary } = useAdminLanguage()
    const t = dictionary.addPage

    return (
        <div className='add'>
            <form className='flex-col'>
                <div className="add-img-upload flex-col">
                    <p>{t.uploadLabel}</p>
                    <label htmlFor="image">
                        <img src={assests.upload_area} alt="" />
                    </label>
                    <input type="file" id="image" hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>{t.nameLabel}</p>
                    <input type="text" name='name' placeholder={t.namePlaceholder} />
                </div>
                <div className="add-product-description flex-col">
                    <p>{t.descriptionLabel}</p>
                    <textarea name="description" rows="6" placeholder={t.descriptionPlaceholder}></textarea>
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>{t.categoryLabel}</p>
                        <select name="category">
                            {t.categories.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>{t.priceLabel}</p>
                        <input type="number" name='price' placeholder={t.pricePlaceholder} />
                    </div>
                </div>
                <button type='submit' className='add-btn'>{t.submit}</button>
            </form>
        </div>
    )
}

export default Add
