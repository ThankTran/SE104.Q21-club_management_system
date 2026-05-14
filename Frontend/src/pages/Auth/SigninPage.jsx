import React from "react";
import AuthLayout from "../../components/layout/Navigation/AuthLayout";
import styles from "./SignupPage.module.css";

const LoginPage = () => {
  return (
    <AuthLayout>
      <form>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          className={styles.textInput}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className={styles.pwInput}
        />
        <div className={styles.rememberForgot}>
          <div>
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <a href="#" className={styles.signupLink}>
            Forgot password?
          </a>
        </div>
        <button type="submit" className={styles.button}>
          Đăng nhập
        </button>
        {/* <div className={styles.signup}>
          <div className={styles.text}>Chưa có tài khoản?</div>
          <a href="/signup" className={styles.signupLink}>
            Đăng ký ngay
          </a>
        </div> */}
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
