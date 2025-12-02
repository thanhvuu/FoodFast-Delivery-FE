import { useMemo, useState } from 'react'
import './Login.css'
import { assests } from '../../assets/assest'
import { loginRestaurant } from '../../services/api'

const Login = ({ onSuccess }) => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const disabled = useMemo(() => !identifier.trim() || !password.trim(), [identifier, password])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (disabled) return

    setLoading(true)
    setError('')
    try {
      const user = await loginRestaurant(identifier, password)
      onSuccess?.(user)
    } catch (err) {
      setError(err.message || 'Không thể đăng nhập. Vui lòng thử lại hoặc liên hệ Super Admin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-hero">
          <div className="hero-logo">
            <img src={assests.logo} alt="FoodFast" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">FoodFast Admin</p>
            <h1>Đăng nhập bằng tài khoản cửa hàng</h1>
            <p>
              Tài khoản và mật khẩu được cấp từ trang Super Admin. Mọi thay đổi (cấp mới, đổi mật khẩu,
              khoá/mở) sẽ đồng bộ ngay tại đây.
            </p>
            <ul>
              <li>Mỗi cửa hàng có một tài khoản riêng, chỉ tài khoản đúng mới truy cập được.</li>
              <li>Nếu tài khoản bị khoá tại Super Admin, đăng nhập sẽ bị chặn.</li>
            </ul>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier">Email hoặc tên đăng nhập cửa hàng</label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="ví dụ: pizza@foodfast.io"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Nhập mật khẩu được cấp"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" disabled={disabled || loading}>
            {loading ? 'Đang kiểm tra...' : 'Đăng nhập và đồng bộ'}
          </button>

          <p className="form-hint">
            Cần hỗ trợ? Kiểm tra lại thông tin tài khoản được tạo tại trang Super Admin hoặc liên hệ quản trị
            hệ thống để mở khoá.
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
