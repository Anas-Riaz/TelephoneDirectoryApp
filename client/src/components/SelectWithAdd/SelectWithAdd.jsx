import { Select, MenuItem } from "@mui/material";
import "./SelectWithAdd.css";

export default function SelectWithAdd({
  name,
  value,
  placeholder,
  onChange,
  options,
}) {
  return (
    <div className="select-wrapper">
      <Select
        name={name}
        value={value}
        onChange={onChange}
        displayEmpty
        fullWidth
        sx={{
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
          "&.Mui-focused": {
            borderColor: "#4a90e2",
            backgroundColor: "#fff",
          },
        }}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>

        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id}>
            {opt.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
