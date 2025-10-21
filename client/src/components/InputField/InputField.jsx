import "./InputField.css";

export default function InputField({
  id,
  name,
  placeholder,
  value,
  onChange,
  ...props
}) {
  return (
    <div className="form-group">
      <input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...(name ? { name } : {})}
        {...props}
      />
      {/* {error && <p></p>} */}
    </div>
  );
}
