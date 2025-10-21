import { useState } from "react";
import ResultTable from "../ResultTable/ResultTable";
import SearchForm from "../SearchForm/SearchForm";
import { useDropDownData } from "../../store/DropDownContext";
import { deleteEmployee, fetchEmployees, updateEmployee } from "../../api/api";

export default function SearchingViewing() {
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

  async function handleDelete(empNo) {
    setLoading(true);
    try {
      await deleteEmployee(empNo);
      setEmployees((prev) => prev.filter((row) => row.EmpNo !== empNo));
    } catch (error) {
      console.error("Error deleting employee:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(updatedEmployee) {
    setLoading(true);
    try {
      const updatedFromBackend = await updateEmployee(
        updatedEmployee.EmpNo,
        updatedEmployee
      );
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.EmpNo === updatedFromBackend.EmpNo ? updatedFromBackend : emp
        )
      );
    } catch (error) {
      console.error("Error updating employee:", error);
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
        onSave={handleUpdate}
        onDelete={handleDelete}
        dropdownData={dropdownData}
        readOnly={true}
      />
    </>
  );
}
