import { logisticsControls } from '../../data/managementData'
import './Operations.css'

const controlBlocks = Object.values(logisticsControls)

function Operations() {
  return (
    <div className="sa-page operations-page">
      <section className="sa-section">
        <header>
          <div>
            <h2>Vận hành &amp; Ưu đãi</h2>
            <p>Tùy chỉnh chính sách phí ship, voucher khuyến mãi và vùng phủ để tối ưu chi phí.</p>
          </div>
          <div className="section-actions">
            <button type="button" className="primary">Cập nhật chính sách</button>
            <button type="button" className="ghost">Lịch sử thay đổi</button>
          </div>
        </header>
        <div className="operations-grid">
          {controlBlocks.map(block => (
            <article key={block.title} className="operations-card">
              <header>
                <h3>{block.title}</h3>
                <button type="button">Thiết lập</button>
              </header>
              <ul>
                {block.items.map(item => (
                  <li key={item.label}>
                    <div>
                      <strong>{item.label}</strong>
                      <small>{item.status}</small>
                    </div>
                    <span>{item.value}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Operations
