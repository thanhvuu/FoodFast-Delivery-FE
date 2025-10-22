import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ModalLogin.css'

const API_BASE_URL = (import.meta.env?.VITE_AUTH_API_BASE_URL || '/api').replace(/\/$/, '')
const USERS_API_URL = `${API_BASE_URL}/users`

export default function ModalLogin({ open, onClose, onLoginSuccess }) {
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

    try {
      const res = await fetch(USERS_API_URL)
      if (!res.ok) throw new Error('Không thể giao tiếp với server')
      const users = await res.json()

      if (isLogin) {
        if (!email || !password) {
          setError('Vui lòng nhập email và mật khẩu')
          setLoading(false)
          return
        }

        const matched = Array.isArray(users) && users.find((u) => u.email?.toLowerCase() === email.trim().toLowerCase() && u.password === password)
        if (matched) {
          localStorage.setItem('user', JSON.stringify(matched))
          setSuccess('Đăng nhập thành công')
          setTimeout(() => {
            resetForm()
            if (onLoginSuccess) onLoginSuccess()
            if (onClose) onClose()
            navigate('/')
          }, 400)
        } else {
          setError('Thông tin đăng nhập không chính xác')
        }
      } else {
        if (!userName || !email || !password || password !== confirmPass) {
          setError('Vui lòng nhập đầy đủ và chính xác thông tin')
          setLoading(false)
          return
        }

        if (Array.isArray(users) && users.some((u) => u.email?.toLowerCase() === email.trim().toLowerCase())) {
          setError('Email đã tồn tại')
          setLoading(false)
          return
        }

        const createRes = await fetch(USERS_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: userName, email: email.trim(), password }),
        })

        if (!createRes.ok) throw new Error('Không thể tạo tài khoản mới')

        setSuccess('Đăng ký thành công — hãy đăng nhập')
        setIsLogin(true)
        resetForm()
      }
    } catch (err) {
      console.error(err)
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-login-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>

        <div className="modal-switcher">
          <button className={isLogin ? 'active' : ''} onClick={() => { setIsLogin(true); resetForm() }}>Đăng nhập</button>
          <button className={!isLogin ? 'active' : ''} onClick={() => { setIsLogin(false); resetForm() }}>Đăng ký</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label htmlFor="username">Tên người dùng</label>
              <input id="username" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label htmlFor="password">Mật khẩu</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {!isLogin && (
            <>
              <label htmlFor="confirmPass">Xác nhận mật khẩu</label>
              <input id="confirmPass" type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
            </>
          )}

          <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}</button>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  )
}