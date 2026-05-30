import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../components/layout/Navigation/AuthLayout";
import useAuth from "../../hooks/useAuth";
import styles from "./SignupPage.module.css";

const LoginPage = () => {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.username.trim() || !form.password) {
      setFormError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    await login({
      username: form.username.trim(),
      password: form.password,
    });
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        {(formError || error) && <p className={styles.formError}>{formError || error}</p>}
        <input
          name="username"
          type="text"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
          className={styles.textInput}
        />
        <div className={styles.passwordWrapper}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className={styles.pwInput}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className={styles.rememberForgot}>
          <div>
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
