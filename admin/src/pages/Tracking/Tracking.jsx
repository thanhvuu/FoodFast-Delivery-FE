import React, { useEffect, useMemo, useState } from 'react'
import './Tracking.css'
import { order_list } from '../../assets/assest'

const getInitialOrderId = () => order_list[0]?.id ?? ''

const Tracking = () => {
    const [selectedOrderId, setSelectedOrderId] = useState(getInitialOrderId)
    const selectedOrder = useMemo(
        () => order_list.find(order => order.id === selectedOrderId),
        [selectedOrderId]
    )

    const route = selectedOrder?.route ?? []
    const [progress, setProgress] = useState(0)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    useEffect(() => {
        setProgress(0)
        setLastUpdated(new Date())
    }, [selectedOrderId])

    useEffect(() => {
        if (route.length < 2) return

        const timer = setInterval(() => {
            setProgress(prev => {
                const nextValue = prev + 0.015
                if (nextValue >= route.length - 1) {
                    clearInterval(timer)
                    setLastUpdated(new Date())
                    return route.length - 1
                }
                setLastUpdated(new Date())
                return nextValue
            })
        }, 2000)

        return () => clearInterval(timer)
    }, [route])

    const currentIndex = Math.floor(progress)
    const nextIndex = Math.min(currentIndex + 1, route.length - 1)
    const segmentProgress = progress - currentIndex

    const currentPoint = route[currentIndex] ?? route[0]
    const nextPoint = route[nextIndex] ?? route[route.length - 1]

    const interpolatePosition = () => {
        if (!currentPoint) return { left: '10%', top: '70%' }
        if (!nextPoint) return {
            left: `${currentPoint.position.x}%`,
            top: `${currentPoint.position.y}%`
        }
        const left = currentPoint.position.x + (nextPoint.position.x - currentPoint.position.x) * segmentProgress
        const top = currentPoint.position.y + (nextPoint.position.y - currentPoint.position.y) * segmentProgress
        return {
            left: `${left}%`,
            top: `${top}%`
        }
    }

    const completion = route.length > 1 ? (progress / (route.length - 1)) * 100 : 0

    return (
        <div className='tracking-page'>
            <header className='tracking-header'>
                <div>
                    <h2>Theo dõi drone giao hàng</h2>
                    <p>
                        Giám sát trạng thái thực tế của các đơn hàng được giao bằng drone.
                        Dữ liệu được cập nhật tự động vài giây một lần.
                    </p>
                </div>
                <div className='tracking-selector'>
                    <label htmlFor='order-select'>Chọn đơn hàng</label>
                    <select
                        id='order-select'
                        value={selectedOrderId}
                        onChange={event => setSelectedOrderId(event.target.value)}
                    >
                        {order_list.map(order => (
                            <option key={order.id} value={order.id}>
                                {order.customer} — {order.id.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {selectedOrder ? (
                <div className='tracking-content'>
                    <section className='tracking-summary'>
                        <div className='summary-card'>
                            <span className='summary-label'>Khách hàng</span>
                            <strong>{selectedOrder.customer}</strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>Địa chỉ giao</span>
                            <strong>{selectedOrder.address}</strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>Trạng thái</span>
                            <strong className={selectedOrder.status === 'delivered' ? 'badge-success' : 'badge-pending'}>
                                {selectedOrder.status === 'delivered' ? 'Đã giao' : 'Đang giao'}
                            </strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>Thanh toán</span>
                            <strong className={selectedOrder.paid ? 'badge-success' : 'badge-pending'}>
                                {selectedOrder.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                            </strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>Tiến độ chuyến bay</span>
                            <div className='progress'>
                                <div className='progress-bar' style={{ width: `${completion}%` }} />
                            </div>
                            <small>{Math.round(completion)}% hoàn thành</small>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>Cập nhật cuối</span>
                            <strong>{lastUpdated.toLocaleTimeString()}</strong>
                        </div>
                    </section>

                    <section className='tracking-layout'>
                        <div className='tracking-map'>
                            <div className='map-grid'>
                                {[...Array(4)].map((_, index) => (
                                    <span
                                        key={index}
                                        className='grid-line horizontal'
                                        style={{ top: `${(index + 1) * 20}%` }}
                                    />
                                ))}
                                {[...Array(4)].map((_, index) => (
                                    <span
                                        key={`v-${index}`}
                                        className='grid-line vertical'
                                        style={{ left: `${(index + 1) * 20}%` }}
                                    />
                                ))}
                            </div>
                            {route.map(point => (
                                <div
                                    key={point.id}
                                    className='map-point'
                                    style={{ left: `${point.position.x}%`, top: `${point.position.y}%` }}
                                >
                                    <span className='point-dot' />
                                    <span className='point-label'>{point.title}</span>
                                </div>
                            ))}
                            <div className='drone-icon' style={interpolatePosition()}>
                                <span role='img' aria-label='Drone đang di chuyển'>🚁</span>
                            </div>
                            <div className='map-legend'>
                                <strong>Drone #{selectedOrder.id.toUpperCase()}</strong>
                                <span>Tọa độ hiện tại cập nhật lúc {lastUpdated.toLocaleTimeString()}</span>
                            </div>
                        </div>
                        <aside className='tracking-timeline'>
                            <h3>Lộ trình chuyến bay</h3>
                            <ul>
                                {route.map((point, index) => {
                                    const isCompleted = index < currentIndex || progress >= route.length - 1
                                    const isActive = index === currentIndex && progress < route.length - 1
                                    return (
                                        <li
                                            key={point.id}
                                            className={`${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                                        >
                                            <div className='timeline-header'>
                                                <span className='timeline-title'>{point.title}</span>
                                                <span className='timeline-eta'>{point.eta}</span>
                                            </div>
                                            <p>{point.description}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </aside>
                    </section>
                </div>
            ) : (
                <p>Không tìm thấy thông tin đơn hàng.</p>
            )}
        </div>
    )
}

export default Tracking
