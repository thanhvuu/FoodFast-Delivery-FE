import { profileInfo, overviewBadges } from '../../data/managementData'
import './Topbar.css'

function Topbar() {
  return (
    <header className="sa-topbar">
      <div className="profile-card">
        <div className="profile-heading">
          <span className="profile-label">Hồ sơ quản trị</span>
          <button type="button">Đăng xuất</button>
        </div>
        <div className="profile-info">
          <div>
            <strong>{profileInfo.name}</strong>
            <span>{profileInfo.email}</span>
          </div>
          <div>
            <span>Điện thoại</span>
            <strong>{profileInfo.phone}</strong>
          </div>
          <div>
            <span>Sở chỉ huy</span>
            <strong>{profileInfo.office}</strong>
          </div>
        </div>
      </div>
      <div className="overview-card">
        <h2>Tổng quan hệ thống</h2>
        <div className="badge-list">
          {overviewBadges.map(badge => (
            <div key={badge.label} className="badge">
              <strong>{badge.value}</strong>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Topbar
