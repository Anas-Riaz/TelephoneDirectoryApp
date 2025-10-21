import useSearchForm from "../../hooks/useSearchForm.js";
import InputField from "../InputField/InputField.jsx";
import searchLogo from "../../assets/searchLogo.png";
import SelectWithAdd from "../SelectWithAdd/SelectWithAdd.jsx";
import "./SearchForm.css";

export default function SearchForm({ onSearch, dropdownData, loading }) {
  const { values, errors, handleChange, handleSubmit, resetForm } =
    useSearchForm((formValues) => {
      const filledFields = Object.fromEntries(
        Object.entries(formValues).filter(([, value]) => value)
      );
      onSearch(filledFields);
    });

  return (
    <section className="form-section">
      <h2 className="form-heading">Search Employees</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <InputField
          id="emp-no"
          name="EmpNo"
          placeholder="Employee No."
          value={values.EmpNo}
          onChange={handleChange}
        />

        <InputField
          id="name"
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
          id="ip-number"
          name="IPNumbers"
          placeholder="IP Extension"
          value={values.IPNumbers}
          onChange={handleChange}
        />

        {Object.keys(errors).length > 0 && (
          <div className="error-list">
            <ul>
              {Object.values(errors).map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="search-button" disabled={loading}>
          <img src={searchLogo} alt="search-button" />
          Search
        </button>

        <button type="button" onClick={resetForm}>
          Clear
        </button>
      </form>
    </section>
  );
}
