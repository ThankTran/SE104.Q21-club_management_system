// src/components/LoginModal.jsx
import { useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import styles from './LoginModal.module.css'

const LoginModal = ({ onClose }) => {
  const { login, loading, error } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.username.trim())
      newErrors.username = 'Vui lòng nhập tên đăng nhập'
    if (!form.password)
      newErrors.password = 'Vui lòng nhập mật khẩu'
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    await login({
      username: form.username.trim(),
      password: form.password,
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>

        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <div className={styles.header}>
          <h2 className={styles.title}>Đăng nhập</h2>
          <p className={styles.subtitle}>Chào mừng trở lại!</p>
        </div>

        {error && <div className={styles.serverError}>{error}</div>}

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Tên đăng nhập</label>
            <input
              name="username"
              type="text"
              placeholder="Nhập MSSV"
              value={form.username}
              onChange={handleChange}
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
            />
            {errors.username && <p className={styles.errorMsg}>{errors.username}</p>}
          </div>

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

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
