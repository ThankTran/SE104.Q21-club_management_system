import React from "react";
import AuthLayout from "../components/layout/Navigation/AuthLayout";
import styles from "./SignupPage.module.css";

const SignupPage = () => {
  return (
    <AuthLayout>
      <form>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          className={styles.textInput}
        />
        <input type="email" placeholder="Email" className={styles.textInput} />
        <input
          type="password"
          placeholder="Mật khẩu"
          className={styles.pwInput}
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          className={styles.pwInput}
        />
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
