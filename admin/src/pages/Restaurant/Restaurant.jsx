import React, { useEffect, useMemo, useState } from 'react'
import './Restaurant.css'
import { useAdminLanguage } from '../../context/LanguageContext'

const STORAGE_KEY = 'foodfast-restaurant-profile'

const defaultProfile = {
  name: 'FoodFast Bistro',
  address: '273 An Dương Vương, Quận 5, TP.HCM',
  phone: '0987 654 321',
  openingTime: '08:00',
  closingTime: '22:00',
  shippingFee: 15000,
  notes: '',
}

const readProfile = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch (error) {
    console.error(error)
    return null
  }
}

const saveProfile = (profile) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  window.dispatchEvent(new CustomEvent('foodfast-restaurant-profile-updated'))
}

const Restaurant = () => {
  const { dictionary, formatCurrency } = useAdminLanguage()
  const t = dictionary.restaurantPage

  const [profile, setProfile] = useState(defaultProfile)
  const [lastSaved, setLastSaved] = useState(null)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const stored = readProfile()
    if (stored) {
      setProfile(prev => ({ ...prev, ...stored }))
      if (stored.updatedAt) {
        setLastSaved(new Date(stored.updatedAt))
      }
    }
  }, [])

  useEffect(() => {
    const listener = () => {
      const stored = readProfile()
      if (stored) {
        setProfile(prev => ({ ...prev, ...stored }))
        if (stored.updatedAt) {
          setLastSaved(new Date(stored.updatedAt))
        }
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('foodfast-restaurant-profile-updated', listener)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('foodfast-restaurant-profile-updated', listener)
      }
    }
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setProfile(prev => ({
      ...prev,
      [name]: name === 'shippingFee' ? Math.max(0, Number(value)) : value,
    }))
  }

  const formattedSchedule = useMemo(() => {
    if (!profile.openingTime || !profile.closingTime) return t.summary.scheduleFallback
    return t.summary.scheduleText
      .replace('{{open}}', profile.openingTime)
      .replace('{{close}}', profile.closingTime)
  }, [profile.openingTime, profile.closingTime, t.summary.scheduleFallback, t.summary.scheduleText])

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...profile,
      updatedAt: new Date().toISOString(),
    }
    saveProfile(payload)
    setLastSaved(new Date(payload.updatedAt))
    setStatus('saved')
    setTimeout(() => setStatus('idle'), 3200)
  }

  return (
    <div className='restaurant-page'>
      <header className='restaurant-header'>
        <div>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>
        {status === 'saved' && (
          <span className='restaurant-status'>{t.savedMessage}</span>
        )}
      </header>

      <div className='restaurant-layout'>
        <form className='restaurant-form' onSubmit={handleSubmit}>
          <div className='form-row'>
            <label>
              <span>{t.fields.name}</span>
              <input
                type='text'
                name='name'
                value={profile.name}
                onChange={handleChange}
                placeholder={t.placeholders.name}
                required
              />
            </label>
            <label>
              <span>{t.fields.phone}</span>
              <input
                type='text'
                name='phone'
                value={profile.phone}
                onChange={handleChange}
                placeholder={t.placeholders.phone}
              />
            </label>
          </div>

          <label className='form-full'>
            <span>{t.fields.address}</span>
            <textarea
              name='address'
              rows={3}
              value={profile.address}
              onChange={handleChange}
              placeholder={t.placeholders.address}
              required
            />
          </label>

          <div className='form-row'>
            <label>
              <span>{t.fields.openingTime}</span>
              <input
                type='time'
                name='openingTime'
                value={profile.openingTime}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              <span>{t.fields.closingTime}</span>
              <input
                type='time'
                name='closingTime'
                value={profile.closingTime}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <label className='form-half'>
            <span>{t.fields.shippingFee}</span>
            <div className='input-with-hint'>
              <input
                type='number'
                name='shippingFee'
                min='0'
                step='1000'
                value={profile.shippingFee}
                onChange={handleChange}
                required
              />
              <small>{t.hints.shippingFee.replace('{{value}}', formatCurrency(profile.shippingFee || 0))}</small>
            </div>
          </label>

          <label className='form-full'>
            <span>{t.fields.notes}</span>
            <textarea
              name='notes'
              rows={3}
              value={profile.notes}
              onChange={handleChange}
              placeholder={t.placeholders.notes}
            />
          </label>

          <div className='form-actions'>
            <button type='submit'>{t.actions.save}</button>
            {lastSaved && (
              <span className='last-saved'>
                {t.lastUpdated.replace('{{time}}', lastSaved.toLocaleString())}
              </span>
            )}
          </div>
        </form>

        <aside className='restaurant-summary'>
          <h2>{t.summary.title}</h2>
          <p>{t.summary.subtitle}</p>
          <dl>
            <div>
              <dt>{t.summary.labels.name}</dt>
              <dd>{profile.name}</dd>
            </div>
            <div>
              <dt>{t.summary.labels.address}</dt>
              <dd>{profile.address}</dd>
            </div>
            <div>
              <dt>{t.summary.labels.schedule}</dt>
              <dd>{formattedSchedule}</dd>
            </div>
            <div>
              <dt>{t.summary.labels.shippingFee}</dt>
              <dd>{formatCurrency(profile.shippingFee || 0)}</dd>
            </div>
            <div>
              <dt>{t.summary.labels.phone}</dt>
              <dd>{profile.phone || t.summary.phoneFallback}</dd>
            </div>
            {profile.notes && (
              <div>
                <dt>{t.summary.labels.notes}</dt>
                <dd>{profile.notes}</dd>
              </div>
            )}
          </dl>
        </aside>
      </div>
    </div>
  )
}

export default Restaurant
