import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../components/layout/Navigation/AuthLayout";
import styles from "./SignupPage.module.css";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <AuthLayout>
      <form>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          className={styles.textInput}
        />
        <input type="email" placeholder="Email" className={styles.textInput} />
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mật khẩu"
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
        <div className={styles.passwordWrapper}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Xác nhận mật khẩu"
            className={styles.pwInput}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className={styles.rememberForgot}>
          <div>
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
        </div>
        <button type="submit" className={styles.button}>
          Đăng ký
        </button>
        <div className={styles.signup}>
          <div className={styles.text}>Đã có tài khoản?</div>
          <a href="/login" className={styles.signupLink}>
            Đăng nhập ngay
          </a>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignupPage;
