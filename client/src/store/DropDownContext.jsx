import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchDepartments,
  fetchDesignations,
  fetchLocations,
} from "../api/api";

const DropDownContext = createContext();

export function useDropDownData() {
  return useContext(DropDownContext);
}

export default function DropDownDataProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [dropdownData, setDropdownData] = useState({
    departments: [],
    designations: [],
    locations: [],
  });

  // ✅ function to fetch dropdowns
  const fetchData = async () => {
    setLoading(true);
    try {
      const [departments, designations, locations] = await Promise.all([
        fetchDepartments(),
        fetchDesignations(),
        fetchLocations(),
      ]);

      setDropdownData({
        departments: departments.map((d) => ({ id: d.id, name: d.name })),
        designations: designations.map((d) => ({ id: d.id, name: d.name })),
        locations: locations.map((l) => ({ id: l.id, name: l.name })),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetch once on mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DropDownContext.Provider
      value={{ dropdownData, loading, refreshDropdowns: fetchData }}
    >
      {children}
    </DropDownContext.Provider>
  );
}
