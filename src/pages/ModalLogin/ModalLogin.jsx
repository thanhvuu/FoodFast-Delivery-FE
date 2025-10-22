import React, { useState } from 'react'
import './ModalLogin.css'

const API_URL = "http://localhost:4000/users"

const ModalLogin = ({ open, onClose }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')

    if (!open) return null

    const resetForm = () => {
        setUserName('')
        setEmail('')
        setPassword('')
        setConfirmPass('')
        setError('')
        setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        if (!isLogin && password !== confirmPass) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp')
            setLoading(false)
            return
        }

        if (isLogin) {
            // Đăng nhập
            try {
                const res = await fetch(
                    `${API_URL}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
                )
                const users = await res.json()
                if (users.length > 0) {
                    setSuccess('Đăng nhập thành công!')
                    resetForm()
                    setTimeout(() => {
                        onClose()
                        setSuccess('')
                    }, 1000)
                    // Lưu user nếu cần
                    localStorage.setItem('user', JSON.stringify(users[0]))
                } else {
                    setError('Sai email hoặc mật khẩu!')
                }
            } catch {
                setError('Lỗi kết nối server!')
            }
            setLoading(false)
        } else {
            // Đăng ký
            if (!userName || !email || !password) {
                setError('Vui lòng nhập đủ thông tin')
                setLoading(false)
                return
            }
            try {
                // Kiểm tra tồn tại email và username
                const respEmail = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`)
                const existsEmail = await respEmail.json()
                if (existsEmail.length > 0) {
                    setError('Email đã được đăng ký!')
                    setLoading(false)
                    return
                }
                const respUser = await fetch(`${API_URL}?username=${encodeURIComponent(userName)}`)
                const existsUser = await respUser.json()
                if (existsUser.length > 0) {
                    setError('Tên người dùng đã được đăng ký!')
                    setLoading(false)
                    return
                }
                // Tạo user mới
                const newUser = {
                    username: userName,
                    email,
                    password,
                    fullName: userName,
                }
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                })
                setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.')
                setLoading(false)
                setIsLogin(true)
                resetForm()
            } catch {
                setError('Lỗi kết nối server!')
                setLoading(false)
            }
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-login-card" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>Đăng nhập hoặc Đăng ký</h2>
                <div className="modal-switcher">
                    <button className={isLogin ? 'active' : ''} onClick={() => { setIsLogin(true); resetForm() }}>Đăng nhập</button>
                    <button className={!isLogin ? 'active' : ''} onClick={() => { setIsLogin(false); resetForm() }}>Đăng ký</button>
                </div>
                <div className="social-login-section">
                    <button className="social-btn google">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="social-icon" />
                        Đăng nhập với Google
                    </button>
                    <button className="social-btn facebook">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="" className="social-icon" />
                        Đăng nhập với Facebook
                    </button>
                </div>
                <div className="modal-divider">
                    <span>hoặc tiếp tục với email</span>
                </div>
                <form className="modal-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <label htmlFor="username">Tên người dùng</label>
                            <input
                                id="username"
                                type="text"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                placeholder="Nhập tên người dùng"
                                required
                            />
                        </>
                    )}
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Mật khẩu"
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    {!isLogin && (
                        <>
                            <label htmlFor="confirmPass">Xác nhận mật khẩu</label>
                            <input
                                id="confirmPass"
                                type="password"
                                value={confirmPass}
                                placeholder="Xác nhận mật khẩu"
                                onChange={e => setConfirmPass(e.target.value)}
                                required
                            />
                        </>
                    )}
                    <button type="submit" className="modal-btn-main" disabled={loading}>
                        {loading ? (isLogin ? 'Đang đăng nhập...' : 'Đang đăng ký...') : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
                    </button>
                    {error && <div style={{ color: 'tomato', marginTop: 8 }}>{error}</div>}
                    {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
                </form>
            </div>
        </div>
    )
}

export default ModalLogin
