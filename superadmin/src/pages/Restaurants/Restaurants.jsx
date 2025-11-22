import { restaurants } from '../../data/managementData'
import './Restaurants.css'

function Restaurants() {
  return (
    <div className="sa-page restaurants-page">
      <section className="sa-section">
        <header>
          <div>
            <h2>Quản lý nhà hàng &amp; Merchant</h2>
            <p>Duyệt đối tác mới, khoá các đơn vị vi phạm và theo dõi chất lượng dịch vụ.</p>
          </div>
          <div className="section-actions">
            <button type="button" className="primary">Duyệt nhanh</button>
            <button type="button" className="ghost">Xuất danh sách</button>
          </div>
        </header>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nhà hàng</th>
                <th>Chủ sở hữu</th>
                <th>Thành phố</th>
                <th>Trạng thái</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map(row => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.owner}</td>
                  <td>{row.city}</td>
                  <td>
                    <span className={`status status-${row.statusKey}`}>{row.status}</span>
                  </td>
                  <td>{row.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Restaurants
