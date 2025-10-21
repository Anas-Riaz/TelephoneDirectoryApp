import useEmployeeForm from "../../hooks/useEmployeeForm.js";
import InputField from "../InputField/InputField.jsx";
import addIcon from "../../assets/add.png";
import "./AddEmployeeForm.css";
import SelectWithAdd from "../SelectWithAdd/SelectWithAdd.jsx";

export default function AddEmployeeForm({ onAdd, dropdownData, loading }) {
  const {
    values,
    errors,
    successMsg,
    handleChange,
    handleCustomChange,
    handleSubmit,
  } = useEmployeeForm(onAdd);

  function handleIpChange(index, value) {
    const updatedIps = [...values.IPNumbers];
    updatedIps[index] = value;
    handleCustomChange("IPNumbers", updatedIps);
  }

  function addIpField() {
    handleCustomChange("IPNumbers", [...values.IPNumbers, ""]);
  }

  function removeIpField(index) {
    handleCustomChange(
      "IPNumbers",
      values.IPNumbers.filter((_, i) => i !== index)
    );
  }

  return (
    <section className="form-section">
      <h2 className="form-heading">Add New Employee</h2>
      <div className="add-employee-form-wrapper">
        <form className="Add-form" onSubmit={handleSubmit}>
          <InputField
            id="EmpNo"
            name="EmpNo"
            placeholder="Emp No."
            value={values.EmpNo}
            onChange={handleChange}
          />
          <InputField
            id="Name"
            name="Name"
            placeholder="Name"
            value={values.Name}
            onChange={handleChange}
          />

          <SelectWithAdd
            id="departments"
            name="DepartmentID"
            placeholder="Departments"
            value={values.DepartmentID}
            options={dropdownData.departments}
            onChange={handleChange}
          />

          <SelectWithAdd
            id="designations"
            name="DesignationID"
            placeholder="Designations"
            value={values.DesignationID}
            options={dropdownData.designations}
            onChange={handleChange}
          />

          <SelectWithAdd
            id="locations"
            name="LocationID"
            placeholder="Locations"
            value={values.LocationID}
            options={dropdownData.locations}
            onChange={handleChange}
          />

          <InputField
            id="source"
            name="Source"
            placeholder="Source"
            value={values.Source}
            onChange={handleChange}
          />

          <InputField
            id="email"
            name="Email"
            placeholder="Email"
            value={values.Email}
            onChange={handleChange}
          />

          <div className="ip-extensions">
            {values.IPNumbers.map((ip, index) => (
              <div key={index} className="ip-extension-row">
                <input
                  type="text"
                  placeholder={`IP ${index + 1}`}
                  value={ip}
                  onChange={(e) => handleIpChange(index, e.target.value)}
                  className={errors[`ip-${index}`] ? "input-error" : ""}
                />
                {index === 0 ? (
                  <button type="button" onClick={addIpField}>
                    Add
                  </button>
                ) : (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeIpField(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            <img src={addIcon} alt="addBtn" /> Submit
          </button>

          {Object.keys(errors).length > 0 && (
            <div className="error-list">
              <ul>
                {Object.values(errors).map((msg, idx) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {successMsg && <p className="success-msg">{successMsg}</p>}
        </form>
      </div>
    </section>
  );
}
