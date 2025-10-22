import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ModalLogin.css'

const API_BASE_URL = (import.meta.env?.VITE_AUTH_API_BASE_URL || '/api').replace(/\/$/, '')
const USERS_API_URL = `${API_BASE_URL}/users`

const ModalLogin = ({ open, onClose, onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true)
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

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

        try {
            if (isLogin) {
                // Đăng nhập: đọc danh sách người dùng từ db.json thông qua API
 codex/rework-registration-and-login-process
                const res = await fetch(USERS_API_URL)
                const usersPayload = await res.json().catch(() => null)
                if (!res.ok || !Array.isArray(usersPayload)) {
                    const message = usersPayload?.message || 'Không thể tải danh sách người dùng.'
                    throw new Error(message)
                }
                const users = usersPayload

                const res = await fetch(API_URL)
                if (!res.ok) {
                    throw new Error('NETWORK_ERROR')
                }
                const users = await res.json()
 main
                const matchedUser = users.find(
                    (user) =>
                        user.email?.toLowerCase() === email.trim().toLowerCase() &&
                        user.password === password
                )

                if (matchedUser) {
                    setSuccess('Đăng nhập thành công!')
                    localStorage.setItem('user', JSON.stringify(matchedUser))
                    setTimeout(() => {
                        resetForm()
                        setSuccess('')
                        if (typeof onLoginSuccess === 'function') {
                            onLoginSuccess()
                        } else if (typeof onClose === 'function') {
                            onClose()
                        }
                        navigate('/')
                    }, 1200)
                } else {
                    setError('Thông tin đăng nhập không chính xác. Vui lòng thử lại.')
                }
            } else {
                // Đăng ký: lưu thông tin người dùng mới vào db.json
                if (!userName || !email || !password) {
                    setError('Vui lòng nhập đủ thông tin')
                    return
                }

 codex/rework-registration-and-login-process
                const response = await fetch(USERS_API_URL)
                const existingUsersPayload = await response.json().catch(() => null)
                if (!response.ok || !Array.isArray(existingUsersPayload)) {
                    const message = existingUsersPayload?.message || 'Không thể tải danh sách người dùng.'
                    throw new Error(message)
                }
                const existingUsers = existingUsersPayload

                const response = await fetch(API_URL)
                if (!response.ok) {
                    throw new Error('NETWORK_ERROR')
                }
                const existingUsers = await response.json()
 main
                const isEmailTaken = existingUsers.some(
                    (user) => user.email?.toLowerCase() === email.trim().toLowerCase()
                )
                if (isEmailTaken) {
                    setError('Email đã được đăng ký!')
                    return
                }
                const isUsernameTaken = existingUsers.some(
                    (user) => user.username?.toLowerCase() === userName.trim().toLowerCase()
                )
                if (isUsernameTaken) {
                    setError('Tên người dùng đã được đăng ký!')
                    return
                }

                const newUser = {
                    username: userName,
                    email: email.trim(),
                    password,
                    fullName: userName,
                }

 codex/rework-registration-and-login-process
                const createRes = await fetch(USERS_API_URL, {

                const createRes = await fetch(API_URL, {
 main
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                })

 codex/rework-registration-and-login-process
                const createdPayload = await createRes.json().catch(() => null)
                if (!createRes.ok) {
                    const message = createdPayload?.message || 'Không thể đăng ký tài khoản mới.'
                    throw new Error(message)

                if (!createRes.ok) {
                    throw new Error('NETWORK_ERROR')
 main
                }

                setIsLogin(true)
                resetForm()
                setSuccess('Đăng ký thành công! Bạn có thể đăng nhập.')
            }
        } catch (err) {
            console.error(err)
 codex/rework-registration-and-login-process
            const fallbackMessage = err?.message || 'Lỗi kết nối server!'
            setError(fallbackMessage)

            setError('Lỗi kết nối server!')
 main
        } finally {
            setLoading(false)
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
