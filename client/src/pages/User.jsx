// src/User.jsx
import { useState } from "react";
import SearchForm from "../components/SearchForm/SearchForm";
import ResultTable from "../components/ResultTable/ResultTable.jsx";
import { fetchEmployees } from "../api/api.js";
import { useDropDownData } from "../store/DropDownContext.jsx";

export default function User() {
  const { dropdownData, loading: dropdownLoading } = useDropDownData();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(filters) {
    setLoading(true);
    try {
      const filteredEmployees = await fetchEmployees(filters);
      setEmployees(filteredEmployees);
    } catch (error) {
      console.error("Error searching employees:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SearchForm
        onSearch={handleSearch}
        dropdownData={dropdownData}
        loading={loading || dropdownLoading}
      />
      <ResultTable
        data={employees}
        isLoading={loading || dropdownLoading}
        dropdownData={dropdownData}
        readOnly={false}
      />
    </>
  );
}
