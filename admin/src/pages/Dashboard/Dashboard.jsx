import React, { useEffect, useMemo, useState } from 'react'
import './Dashboard.css'
import { order_list } from '../../assets/assest'
import { useAdminLanguage } from '../../context/LanguageContext'

const ORDERS_STORAGE_KEY = 'foodfast-orders'

const readStoredOrders = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error(error)
    return []
  }
}

const digitsOnly = value => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, value)
  }
  if (typeof value === 'string') {
    const numeric = value.replace(/[^0-9]/g, '')
    return numeric ? Number(numeric) : 0
  }
  return 0
}

const normaliseItem = item => ({
  name: item?.name ?? 'Product',
  quantity: Math.max(1, digitsOnly(item?.quantity)),
  price: digitsOnly(item?.price),
  productId: item?.productId || item?.product_id || item?.id,
})

const transformOrder = order => {
  const items = Array.isArray(order?.items) ? order.items.map(normaliseItem) : []
  const normaliseStatus = value => {
    if (!value) return 'new'
    if (['new', 'preparing', 'completed'].includes(value)) return value
    if (value === 'complete' || value === 'conplete') return 'completed'
    if (value === 'delivered') return 'completed'
    if (value === 'pending' || value === 'new_order') return 'new'
    if (value === 'in_progress') return 'preparing'
    return 'new'
  }
  const status = normaliseStatus(order?.adminStatus ?? order?.status)
  return {
    id: order?.id ?? `order-${Math.random().toString(36).slice(2, 9)}`,
    customer: order?.customer ?? 'Customer',
    address: order?.address ?? '',
    status,
    trackingStatus: order?.trackingStatus,
    paid: Boolean(order?.paid),
    deliveryFee: digitsOnly(order?.deliveryFee),
    total: digitsOnly(order?.total),
    items,
    deliveryMethod: order?.deliveryMethod ?? 'drone',
    estimatedArrival: order?.estimatedArrival ?? '',
    estimatedMinutes: digitsOnly(order?.estimatedMinutes),
    createdAt: order?.createdAt ?? null,
  }
}

const mergeOrders = (baseOrders, dynamicOrders) => {
  const unique = new Map()
  baseOrders.forEach(order => unique.set(order.id, order))
  dynamicOrders.forEach(order => unique.set(order.id, order))
  return Array.from(unique.values())
}

const calculateOrderTotal = order => {
  const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = order.deliveryFee || 0
  const storedTotal = order.total || 0
  return storedTotal || itemsTotal + deliveryFee
}

const sortByRecency = (a, b) => {
  const parseDate = value => {
    if (!value) return Number.NEGATIVE_INFINITY
    const timestamp = Date.parse(value)
    return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY
  }
  return parseDate(b.createdAt) - parseDate(a.createdAt)
}

const toValidDate = value => {
  const timestamp = Date.parse(value)
  if (!Number.isFinite(timestamp)) {
    return null
  }
  return new Date(timestamp)
}

const getProductId = product => product?.id ?? product?.productId ?? product?._id
const normalizeName = (value = '') => value.toString().trim().toLowerCase()

const Dashboard = ({ products = [], restaurant }) => {
  const { dictionary, formatCurrency } = useAdminLanguage()
  const t = dictionary.dashboardPage
  const ordersTranslations = dictionary.ordersPage
  const locale = dictionary.common?.currencyLocale ?? 'vi-VN'

  const staticOrders = useMemo(() => order_list.map(transformOrder), [])
  const [orders, setOrders] = useState([])

  const allowedProductIds = useMemo(() => {
    if (!restaurant) return null
    const set = new Set()
    const targetName = normalizeName(restaurant.name)
    products.forEach((p) => {
      const pid = getProductId(p)
      const restName = normalizeName(p?.restaurant?.name || '')
      const restId = p?.restaurant?.id
      if (restId === restaurant.id || (restName && restName === targetName)) {
        if (pid) set.add(pid)
      }
    })
    return set
  }, [products, restaurant])

  const filterOrdersByRestaurant = (list) => {
    if (!allowedProductIds) return list
    return list.filter((order) => order.items.some((it) => allowedProductIds.has(it.productId)))
  }

  const loadOrders = () => {
    const stored = readStoredOrders().map(transformOrder)
    const merged = mergeOrders(staticOrders, stored)
    return filterOrdersByRestaurant(merged)
  }

  const dailyFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }),
    [locale]
  )

  const monthlyFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }),
    [locale]
  )

  useEffect(() => {
    const sync = () => setOrders(loadOrders())
    sync()
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', sync)
      window.addEventListener('foodfast-orders-update', sync)
      return () => {
        window.removeEventListener('storage', sync)
        window.removeEventListener('foodfast-orders-update', sync)
      }
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticOrders, allowedProductIds])

  const metrics = useMemo(() => {
    const totalOrders = orders.length
    const completedOrders = orders.filter(order => order.status === 'completed')
    const pendingOrders = totalOrders - completedOrders.length

    const totalRevenue = orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0)

    const methodBreakdown = orders.reduce(
      (acc, order) => {
        const method = order.deliveryMethod ?? 'drone'
        acc[method] = (acc[method] || 0) + 1
        return acc
      },
      {}
    )

    const estimatedMinutes = orders
      .map(order => order.estimatedMinutes)
      .filter(value => value > 0)

    const averageEta = estimatedMinutes.length
      ? Math.round(estimatedMinutes.reduce((sum, value) => sum + value, 0) / estimatedMinutes.length)
      : null

    return {
      totalProducts: products.length,
      totalOrders,
      deliveredOrders: completedOrders.length,
      pendingOrders,
      deliveredRate: totalOrders ? Math.round((completedOrders.length / totalOrders) * 100) : 0,
      totalRevenue,
      methodBreakdown,
      averageEta,
    }
  }, [orders, products.length])

  const statusSummary = useMemo(() => {
    const keys = ['new', 'preparing', 'completed']
    const counts = keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
    orders.forEach(order => {
      const key = keys.includes(order.status) ? order.status : 'new'
      counts[key] = (counts[key] || 0) + 1
    })
    const total = keys.reduce((sum, key) => sum + (counts[key] || 0), 0)
    const percentages = keys.reduce((acc, key) => {
      acc[key] = total ? Math.round(((counts[key] || 0) / total) * 100) : 0
      return acc
    }, {})
    return { counts, percentages, total }
  }, [orders])

  const customerInsights = useMemo(() => {
    const totals = new Map()
    orders.forEach(order => {
      const amount = calculateOrderTotal(order)
      const name = order.customer ?? 'Customer'
      totals.set(name, (totals.get(name) || 0) + amount)
    })
    const list = Array.from(totals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, total]) => ({ name, total }))
    const max = list.length ? list[0].total : 0
    return { list, max }
  }, [orders])

  const topProducts = useMemo(() => {
    const counter = new Map()
    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.name
        const quantity = item.quantity || 0
        counter.set(key, (counter.get(key) || 0) + quantity)
      })
    })
    return Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [orders])

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort(sortByRecency)
      .slice(0, 6)
  }, [orders])

  const methodLabels = t.methodBreakdown.labels

  const formatMethodLabel = method => methodLabels[method] ?? methodLabels.default ?? method

  const analytics = useMemo(() => {
    const base = { daily: [], monthly: [], maxDailyOrders: 0, maxMonthlyRevenue: 0 }
    if (!orders.length) {
      return base
    }

    const validOrders = orders
      .map(order => ({ order, date: toValidDate(order.createdAt) }))
      .filter(entry => entry.date)

    if (!validOrders.length) {
      return base
    }

    const byDay = new Map()
    validOrders.forEach(({ order, date }) => {
      const dayKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
      const current = byDay.get(dayKey) || { date, orders: 0, revenue: 0 }
      current.orders += 1
      current.revenue += calculateOrderTotal(order)
      byDay.set(dayKey, current)
    })

    const daily = Array.from(byDay.values())
      .sort((a, b) => a.date - b.date)
      .slice(-7)
      .map(entry => ({
        label: dailyFormatter.format(entry.date),
        orders: entry.orders,
        revenue: entry.revenue,
      }))

    const maxDailyOrders = daily.reduce((max, item) => Math.max(max, item.orders), 0)

    const byMonth = new Map()
    validOrders.forEach(({ order, date }) => {
      const monthDate = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthKey = monthDate.getTime()
      const current = byMonth.get(monthKey) || { date: monthDate, orders: 0, revenue: 0 }
      current.orders += 1
      current.revenue += calculateOrderTotal(order)
      byMonth.set(monthKey, current)
    })

    const monthly = Array.from(byMonth.values())
      .sort((a, b) => a.date - b.date)
      .slice(-6)
      .map(entry => ({
        label: monthlyFormatter.format(entry.date),
        orders: entry.orders,
        revenue: entry.revenue,
      }))

    const maxMonthlyRevenue = monthly.reduce((max, item) => Math.max(max, item.revenue), 0)

    return { daily, monthly, maxDailyOrders, maxMonthlyRevenue }
  }, [orders, dailyFormatter, monthlyFormatter])

  const dailyVelocity = useMemo(() => {
    const series = analytics.daily ?? []
    const maxRevenue = series.reduce((max, item) => Math.max(max, item.revenue), 0)
    return { series, maxRevenue }
  }, [analytics.daily])

  const statusTexts = {
    title: 'Tình trạng xử lý đơn',
    description: 'Theo dõi tiến độ xử lý đơn hiện tại.',
    completionLabel: 'Tỷ lệ hoàn tất',
    labels: {},
    countTemplate: '{{count}} · {{percentage}}%',
    ...(t.statusInsights ?? {}),
  }
  const customerTexts = {
    title: 'Khách hàng giá trị',
    description: 'Những khách có tổng giá trị đơn cao nhất.',
    empty: 'Chưa có dữ liệu khách hàng.',
    ...(t.customerInsights ?? {}),
  }
  const velocityTexts = {
    title: 'Nhịp đơn theo ngày',
    description: 'So sánh số lượng đơn và doanh thu từng ngày.',
    empty: 'Chưa có dữ liệu nhịp đơn.',
    ...(t.orderVelocity ?? {}),
  }
  const completionRate = metrics.deliveredRate
  const radialGradient = `conic-gradient(#ff7a45 0% ${completionRate}%, rgba(255, 122, 69, 0.16) ${completionRate}% 100%)`

  return (
    <div className='dashboard-page'>
      <header className='dashboard-header'>
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <div className='dashboard-highlight'>
          <span>{t.metrics.deliveredRate}</span>
          <strong>{metrics.deliveredRate}%</strong>
          <small>
            {metrics.totalOrders > 0
              ? t.metrics.deliveredRateHint.replace('{{completed}}', metrics.deliveredOrders).replace('{{total}}', metrics.totalOrders)
              : t.metrics.noOrders}
          </small>
        </div>
      </header>

      <section className='dashboard-metrics'>
        <article className='metric-card'>
          <span className='metric-label'>{t.metrics.totalProducts}</span>
          <strong className='metric-value'>{metrics.totalProducts}</strong>
          <small>{t.metrics.totalProductsHint}</small>
        </article>
        <article className='metric-card'>
          <span className='metric-label'>{t.metrics.activeOrders}</span>
          <strong className='metric-value'>{metrics.pendingOrders}</strong>
          <small>{t.metrics.activeOrdersHint}</small>
        </article>
        <article className='metric-card'>
          <span className='metric-label'>{t.metrics.totalRevenue}</span>
          <strong className='metric-value'>{formatCurrency(metrics.totalRevenue)}</strong>
          <small>{t.metrics.totalRevenueHint}</small>
        </article>
        <article className='metric-card'>
          <span className='metric-label'>{t.metrics.averageEta}</span>
          <strong className='metric-value'>
            {metrics.averageEta ? `${metrics.averageEta}′` : t.metrics.averageEtaFallback}
          </strong>
          <small>{t.metrics.averageEtaHint}</small>
        </article>
      </section>

      <section className='revenue-analytics'>
        <article className='chart-card'>
          <div className='chart-heading'>
            <div>
              <h2>{t.revenueAnalytics.daily.title}</h2>
              <p className='section-description'>{t.revenueAnalytics.daily.description}</p>
            </div>
            <span className='chart-legend'>{t.revenueAnalytics.daily.ordersLabel}</span>
          </div>
          {analytics.daily.length ? (
            <div className='bar-chart'>
              {analytics.daily.map(item => {
                const height = analytics.maxDailyOrders
                  ? Math.max(8, (item.orders / analytics.maxDailyOrders) * 100)
                  : 0
                return (
                  <div key={item.label} className='bar-item'>
                    <div className='bar' style={{ height: `${height}%` }}>
                      <span>{item.orders}</span>
                    </div>
                    <strong>{item.label}</strong>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className='empty-copy'>{t.revenueAnalytics.empty}</p>
          )}
        </article>

        <article className='chart-card'>
          <div className='chart-heading'>
            <div>
              <h2>{t.revenueAnalytics.monthly.title}</h2>
              <p className='section-description'>{t.revenueAnalytics.monthly.description}</p>
            </div>
            <span className='chart-legend'>{t.revenueAnalytics.monthly.revenueLabel}</span>
          </div>
          {analytics.monthly.length ? (
            <div className='lineup-chart'>
              {analytics.monthly.map(item => {
                const width = analytics.maxMonthlyRevenue
                  ? Math.max(12, (item.revenue / analytics.maxMonthlyRevenue) * 100)
                  : 0
                return (
                  <div key={item.label} className='bar-item horizontal'>
                    <div className='bar horizontal' style={{ width: `${width}%` }}>
                      <span>{formatCurrency(item.revenue)}</span>
                    </div>
                    <strong>{item.label}</strong>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className='empty-copy'>{t.revenueAnalytics.empty}</p>
          )}
        </article>
      </section>

      <section className='dashboard-insights'>
        <article className='insight-card status-insight'>
          <div className='insight-heading'>
            <h2>{statusTexts.title}</h2>
            <p className='section-description'>{statusTexts.description}</p>
          </div>
          <div className='status-content'>
            <div className='radial-chart' style={{ background: radialGradient }}>
              <strong>{completionRate}%</strong>
              <span>{statusTexts.completionLabel}</span>
            </div>
            <ul className='status-legend'>
              {['completed', 'preparing', 'new'].map(statusKey => {
                const count = statusSummary.counts[statusKey] ?? 0
                const percentage = statusSummary.percentages[statusKey] ?? 0
                const statusLabel = ordersTranslations.statuses?.[statusKey]
                  ?? statusTexts.labels?.[statusKey]
                  ?? statusKey
                const detail = typeof statusTexts.countTemplate === 'string'
                  ? statusTexts.countTemplate
                    .replace('{{count}}', count)
                    .replace('{{percentage}}', percentage)
                  : `${count} · ${percentage}%`
                return (
                  <li key={statusKey}>
                    <span className={`legend-dot legend-${statusKey}`} aria-hidden='true' />
                    <div className='legend-copy'>
                      <span>{statusLabel}</span>
                      <small>{detail}</small>
                    </div>
                    <span className='legend-percentage'>{percentage}%</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </article>

        <article className='insight-card customers-insight'>
          <div className='insight-heading'>
            <h2>{customerTexts.title}</h2>
            <p className='section-description'>{customerTexts.description}</p>
          </div>
          {customerInsights.list.length ? (
            <ul className='customer-list'>
              {customerInsights.list.map(customer => {
                const ratio = customerInsights.max
                  ? Math.max(10, Math.round((customer.total / customerInsights.max) * 100))
                  : 0
                return (
                  <li key={customer.name}>
                    <div className='customer-copy'>
                      <strong>{customer.name}</strong>
                      <span>{formatCurrency(customer.total)}</span>
                    </div>
                    <div className='customer-progress'>
                      <div style={{ width: `${ratio}%` }} />
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className='empty-copy'>{customerTexts.empty}</p>
          )}
        </article>

        <article className='insight-card velocity-insight'>
          <div className='insight-heading'>
            <h2>{velocityTexts.title}</h2>
            <p className='section-description'>{velocityTexts.description}</p>
          </div>
          {dailyVelocity.series.length ? (
            <div className='spark-chart'>
              {dailyVelocity.series.map(item => {
                const ordersHeight = analytics.maxDailyOrders
                  ? Math.max(8, Math.round((item.orders / analytics.maxDailyOrders) * 100))
                  : 0
                const revenueHeight = dailyVelocity.maxRevenue
                  ? Math.max(6, Math.round((item.revenue / dailyVelocity.maxRevenue) * 100))
                  : 0
                return (
                  <div key={item.label} className='spark-column'>
                    <div className='spark-bars'>
                      <div
                        className='spark-orders'
                        style={{ height: `${ordersHeight}%` }}
                        title={`${velocityTexts.ordersLabel ?? t.revenueAnalytics.daily.ordersLabel}: ${item.orders}`}
                      />
                      <div
                        className='spark-revenue'
                        style={{ height: `${revenueHeight}%` }}
                        title={`${velocityTexts.revenueLabel ?? t.revenueAnalytics.monthly.revenueLabel}: ${formatCurrency(item.revenue)}`}
                      />
                    </div>
                    <span className='spark-label'>{item.label}</span>
                    <div className='spark-values'>
                      <strong>{item.orders}</strong>
                      <small>{formatCurrency(item.revenue)}</small>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className='empty-copy'>{velocityTexts.empty ?? t.revenueAnalytics.empty}</p>
          )}
        </article>
      </section>

      <section className='dashboard-grid'>
        <article className='delivery-split'>
          <h2>{t.methodBreakdown.title}</h2>
          <p className='section-description'>{t.methodBreakdown.description}</p>
          <div className='split-list'>
            {Object.keys(metrics.methodBreakdown).length ? (
              Object.entries(metrics.methodBreakdown).map(([method, count]) => {
                const ratio = metrics.totalOrders ? Math.round((count / metrics.totalOrders) * 100) : 0
                return (
                  <div key={method} className='split-row'>
                    <div className='split-info'>
                      <span className={`split-dot split-${method}`} />
                      <div>
                        <strong>{formatMethodLabel(method)}</strong>
                        <small>{t.methodBreakdown.orders.replace('{{count}}', count)}</small>
                      </div>
                    </div>
                    <div className='split-progress'>
                      <div style={{ width: `${ratio}%` }} />
                    </div>
                    <span className='split-percentage'>{ratio}%</span>
                  </div>
                )
              })
            ) : (
              <p className='empty-copy'>{t.methodBreakdown.empty}</p>
            )}
          </div>
        </article>

        <article className='top-products'>
          <h2>{t.topProducts.title}</h2>
          <p className='section-description'>{t.topProducts.description}</p>
          {topProducts.length ? (
            <ul>
              {topProducts.map(([name, quantity]) => (
                <li key={name}>
                  <span>{name}</span>
                  <strong>{quantity}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className='empty-copy'>{t.topProducts.empty}</p>
          )}
        </article>
      </section>

      <section className='recent-orders'>
        <div className='section-heading'>
          <h2>{t.recentOrders.title}</h2>
          <p>{t.recentOrders.description}</p>
        </div>
        {recentOrders.length ? (
          <table>
            <thead>
              <tr>
                <th>{t.recentOrders.headers.code}</th>
                <th>{t.recentOrders.headers.customer}</th>
                <th>{t.recentOrders.headers.method}</th>
                <th>{t.recentOrders.headers.status}</th>
                <th>{t.recentOrders.headers.total}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => {
                const method = formatMethodLabel(order.deliveryMethod ?? 'drone')
                const statusKey = order.status ?? 'new'
                const statusLabel = ordersTranslations.statuses?.[statusKey] ?? statusKey
                const statusClass = statusKey === 'completed'
                  ? 'completed'
                  : statusKey === 'preparing'
                    ? 'preparing'
                    : 'new'
                return (
                  <tr key={order.id}>
                    <td>{order.id.toUpperCase()}</td>
                    <td>{order.customer}</td>
                    <td>{method}</td>
                    <td>
                      <span className={`status-chip ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td>{formatCurrency(calculateOrderTotal(order))}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <p className='empty-copy'>{t.recentOrders.empty}</p>
        )}
      </section>
    </div>
  )
}

export default Dashboard
