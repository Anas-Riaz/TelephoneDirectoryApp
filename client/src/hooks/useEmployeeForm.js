import useForm from "./useForm.js";

export default function useEmployeeForm(onSubmit) {
  const validate = (values) => {
    let errors = {};

    // EmpNo check
    if (!values.EmpNo || !/^\d{1,10}$/.test(values.EmpNo)) {
      errors.EmpNo = "Emp No must be 1-10 digits.";
    }

    // Name check
    if (!values.Name || !/^[A-Za-z\s]+$/.test(values.Name.trim())) {
      errors.Name = "Name must not contain numbers.";
    }

    // Required fields
    const fieldLabels = {
      DepartmentID: "Department",
      DesignationID: "Designation",
      LocationID: "Location",
      EmpNo: "Employee Number"
    };
    
    ["EmpNo", "Name", "DepartmentID", "DesignationID", "LocationID", "Email"].forEach((field) => {
      if (!values[field] || (typeof values[field] === "string" && !values[field].trim())) {
        const fieldName = fieldLabels[field] || field; // Use mapped label if available, otherwise fallback to the original field name
        errors[field] = `The ${fieldName} field is required.`;
      }
    });
    

    // Email format check
    if (values.Email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.Email)) {
      errors.Email = "Enter a valid email.";
    }

    // IP validation
    values.IPNumbers.forEach((ip, i) => {
      if (ip && !/^\d{1,4}$/.test(ip)) {
        errors[`ip-${i}`] = "IP must be 1-4 digits.";
      }
    });

    return errors;
  };

  return useForm({
    initialValues: {
      EmpNo: "",
      Name: "",
      DepartmentID: "",
      LocationID: "",
      DesignationID: "",
      Source: "",
      Email: "",
      IPNumbers: [""],
    },
    validate,
    onSubmit,
  });
}
