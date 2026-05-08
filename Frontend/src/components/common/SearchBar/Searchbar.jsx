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
    <div className={styles["searchbar-container"]}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
        className={styles["search-input"]}
      />
      <button onClick={handleSearch} className={styles["search-button"]}>
        <img src={search} alt="Search" className={styles["search-icon"]} />
      </button>
    </div>
  );
};
export default Searchbar;
