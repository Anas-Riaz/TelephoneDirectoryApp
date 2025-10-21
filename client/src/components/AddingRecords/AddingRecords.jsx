import { useState } from "react";
import {
  addEmployee,
  addDepartment,
  addDesignation,
  addLocation,
} from "../../api/api.js";
import { useDropDownData } from "../../store/DropDownContext.jsx";
import AddEmployeeForm from "../AddEmployeeForm/AddEmployeeForm";
import Form from "../Form/Form.jsx";

const formConfigs = {
  Department: {
    apiFn: addDepartment,
    key: "DepartmentName",
  },
  Designation: {
    apiFn: addDesignation,
    key: "DesignationName",
  },
  Location: {
    apiFn: addLocation,
    key: "LocationName",
  },
};

export default function AddingRecords() {
  const {
    dropdownData,
    loading: dropdownLoading,
    refreshDropdowns,
  } = useDropDownData();
  const [loading, setLoading] = useState(false);

  async function handleAdd(values) {
    setLoading(true);
    try {
      await addEmployee(values);
    } catch (error) {
      console.error("Error adding employee:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AddEmployeeForm
        onAdd={handleAdd}
        dropdownData={dropdownData}
        loading={loading || dropdownLoading}
      />
      <section className="compose-form-section">
        {Object.entries(formConfigs).map(([label, { apiFn, key }]) => (
          <Form
            key={label}
            id={label.toLowerCase()}
            label={label}
            onSubmit={async (value) => {
              await apiFn({ [key]: value });
              await refreshDropdowns();
            }}
          />
        ))}
      </section>
    </>
  );
}
