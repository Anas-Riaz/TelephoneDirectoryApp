import useForm from "./useForm";

export default function useSearchForm(onSubmit) {
  const validate = (values) => {
    let errors = {};

    if (values.EmpNo && !/^\d{1,10}$/.test(values.EmpNo)) {
      errors.EmpNo = "Emp No must be between 1 and 10 digits.";
    }

    if (values.Name && !/^[A-Za-z\s]+$/.test(values.Name.trim())) {
      errors.Name = "Name must not contain numbers.";
    }

    if (values.IPNumbers && !/^\d{1,4}$/.test(values.IPNumbers)) {
      errors.IPNumbers = "IP Extension must be 1-4 digits.";
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filledFields = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value)
    );
    const newErrors = validate(filledFields);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(filledFields);
    }
  };

  const { values, errors, handleChange, resetForm, setErrors } = useForm({
    initialValues: {
      EmpNo: "",
      Name: "",
      DepartmentID: "",
      LocationID: "",
      DesignationID: "",
      IPNumbers: "",
      Source: "",
    },
    validate,
    onSubmit: handleSubmit, // Use the custom handleSubmit
  });

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
