import React, { useState } from "react";
import styles from "./Searchbar.module.css";
import search from "../../../assets/icons/search.svg";

const Searchbar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Search archives..."
          className={styles.searchInput}
        />
        <button className={styles.searchBtn}>
          <img src={search} alt="Search" className={styles.searchIcon} />
        </button>
      </div>
  );
};
export default Searchbar;
