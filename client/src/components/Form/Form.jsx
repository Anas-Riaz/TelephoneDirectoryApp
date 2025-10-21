import { useState } from "react";
import InputField from "../InputField/InputField.jsx";
import "./Form.css";

export default function Form({ id, label, onSubmit }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await onSubmit(value); // call API function passed as prop
      setSuccessMsg(`${label} added successfully!`);
      setValue(""); // reset input after success
    } catch (err) {
      if(err.response?.status == 400){
        setError(`${label} Already Exists.`)
      }
      else{
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dropdowns-form">
      <h2 className="form-heading">Add New {label}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor={id}>{label}</label>
        <InputField
          id={id}
          placeholder={`Enter ${label}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="form-action">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => setValue("")} disabled={loading}>
            Clear
          </button>
        </div>
      </form>
      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
      {successMsg && (
        <div className="success-msg">
          <p>{successMsg}</p>
        </div>
      )}
    </div>
  );
}
