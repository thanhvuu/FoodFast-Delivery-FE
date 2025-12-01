import React, { useContext, useEffect, useMemo, useState } from 'react'
import './RestaurantSection.css'
import { fetchRestaurants } from '../../services/api'
import { StoreContext } from '../../Context/StoreContext'

const normalizeName = (value = '') => value.toString().trim().toLowerCase()

const toMinutes = (time) => {
  if (!time) return null
  const [h, m] = time.split(':').map((v) => Number(v))
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  return h * 60 + m
}

const isWithinHours = (openingHours) => {
  if (!openingHours?.open || !openingHours?.close) return true
  const openM = toMinutes(openingHours.open)
  const closeM = toMinutes(openingHours.close)
  if (openM === null || closeM === null) return true
  const now = new Date()
  const current = now.getHours() * 60 + now.getMinutes()
  if (closeM < openM) {
    return current >= openM || current < closeM
  }
  if (closeM === openM) return false
  return current >= openM && current < closeM
}

const RestaurantSection = ({ selectedRestaurant = 'all', onSelect }) => {
  const { food_list = [] } = useContext(StoreContext)
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await fetchRestaurants()
        if (!cancelled && Array.isArray(data)) {
          setRestaurants(data)
        }
      } catch (error) {
        console.error('Không thể tải danh sách nhà hàng', error)
        if (!cancelled) setRestaurants([])
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const dishCountByRestaurant = useMemo(() => {
    const counts = new Map()
    food_list.forEach(item => {
      const name = normalizeName(item?.restaurant?.name)
      if (!name) return
      counts.set(name, (counts.get(name) || 0) + 1)
    })
    return counts
  }, [food_list])

  const activeRestaurants = useMemo(
    () => restaurants.filter((res) => (res.statusKey || '').toString().toLowerCase() === 'active'),
    [restaurants]
  )

  const handlePick = (name) => {
    if (!onSelect) return
    onSelect((prev) => {
      const current = normalizeName(prev)
      const next = normalizeName(name)
      if (!next) return 'all'
      return current === next ? 'all' : name
    })
  }

  const normalizedSelected = normalizeName(selectedRestaurant)

  return (
    <section className="restaurant-section" id="restaurants">
      <div className="restaurant-header">
        <div>
          <p className="eyebrow">Restaurants</p>
          <h2>Khám phá theo nhà hàng</h2>
          <p className="description">Chọn nhà hàng để xem nhanh những món đang phục vụ.</p>
        </div>
      </div>
      <div className="restaurant-grid">
        {activeRestaurants.map((res) => {
          const isActive = normalizeName(res.name) === normalizedSelected
          const dishCount = dishCountByRestaurant.get(normalizeName(res.name)) || 0
          const isOpen = isWithinHours(res.openingHours)
          const statusKey = isOpen ? res.statusKey || 'pending' : 'closed'
          const statusLabel = isOpen ? res.status || 'Đang cập nhật' : 'Đã đóng cửa'
          const hoursLabel =
            res.openingHours?.open && res.openingHours?.close
              ? `${res.openingHours.open} - ${res.openingHours.close}`
              : null
          return (
            <button
              key={res.id || res.name}
              type="button"
              className={`restaurant-card ${isActive ? 'active' : ''}`}
              onClick={() => handlePick(res.name)}
            >
              <div className="restaurant-card__top">
                <span className="restaurant-name">{res.name}</span>
                <span className={`status-pill status-${statusKey}`}>{statusLabel}</span>
              </div>
              <p className="restaurant-meta">
                <span>{res.owner || 'Ẩn danh'}</span> • <span>{res.city || '—'}</span>
                {hoursLabel ? <> • <span>{hoursLabel}</span></> : null}
              </p>
              <div className="restaurant-stats">
                <span className="stat-number">{dishCount}</span>
                <span className="stat-label">Món hiện có</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default RestaurantSection
