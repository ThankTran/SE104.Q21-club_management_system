import React from "react";
import styles from "./AuthLayout.module.css";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1>Câu lạc bộ</h1>
          <h1>học thuật THMN </h1>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
