import { useState } from "react";

export default function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
  
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[name];
      return updatedErrors;
    });
  }
    

  function handleCustomChange(field, value) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
    
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(values); 
        setSuccessMsg("Form submitted successfully!");
        setValues(initialValues);
      } catch (err) {
        if (err.response?.status === 409) {
          setErrors({ EmpNo: err.response.data.message });
        } else if (err.response?.status === 400) {
          setErrors({ general: err.response.data.message });
        } else {
          setErrors({ general: "Something went wrong. Please try again." });
        }        
      }
    }
  } 

  function resetForm() {
    setValues(initialValues);
    setErrors({});
    setSuccessMsg("");
  }

  return {
    values,
    errors,
    successMsg,
    handleChange,
    handleCustomChange,
    handleSubmit,
    resetForm,
    setValues,
    setErrors
  };
}


