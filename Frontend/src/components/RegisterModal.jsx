import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import styles from './RegisterModal.module.css'

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const { register, loading, error } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim())
      newErrors.name = 'Please enter username'
    if (!form.email.trim())
      newErrors.email = 'Please enter email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email address'
    if (!form.password)
      newErrors.password = 'Please enter password'
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters'
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    await register(form)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>

        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Đơn gia nhập câu lạc bộ</h2>
          <p className={styles.subtitle}>Tham gia câu lạc bộ để nhận ngay ưu đãi!</p>
        </div>

        {/* Server error */}
        {error && <div className={styles.serverError}>{error}</div>}

        {/* Form */}
        <div className={styles.form}>
          {/* Username */}
          <div className={styles.field}>
            <label className={styles.label}>Họ và tên</label>
            <input
              name="name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={handleChange}
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            />
            {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
          </div>

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
            <label className={styles.label}>Mật Khẩu</label>
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
            {loading ? 'Đang đăng ký...' : 'Tham gia'}
          </button>

          {/* Switch to login */}
          <p className={styles.footer}>
            Đã có tài khoản?{' '}
            <span className={styles.footerLink} onClick={onSwitchToLogin}>
              Đăng nhập
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal