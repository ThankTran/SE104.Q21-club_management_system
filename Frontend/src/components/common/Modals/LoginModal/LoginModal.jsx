// src/components/LoginModal.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import styles from './LoginModal.module.css'

const LoginModal = ({ onClose, onSwitchToRegister }) => {
  const { login, loading, error } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.email.trim())
      newErrors.email = 'Please enter email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email address'
    if (!form.password)
      newErrors.password = 'Please enter password'
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    await login(form)
    navigate('/home')
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>

        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Đăng nhập</h2>
          <p className={styles.subtitle}>Chào mừng trở lại!</p>
        </div>

        {/* Server error */}
        {error && <div className={styles.serverError}>{error}</div>}

        {/* Form */}
        <div className={styles.form}>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            />
            {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div className={styles.field}>
            <label className={styles.label}>Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
            />
            {errors.password && <p className={styles.errorMsg}>{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          {/* Switch to register */}
          <p className={styles.footer}>
            Chưa có tài khoản?{' '}
            <span className={styles.footerLink} onClick={onSwitchToRegister}>
              Đăng ký
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginModal