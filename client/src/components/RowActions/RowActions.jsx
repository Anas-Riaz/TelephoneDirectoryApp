import "./RowActions.css";

export default function RowActions({
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isEditing,
}) {
  return (
    <div className="row-actions">
      {isEditing ? (
        <>
          <button className="btn save-btn" onClick={onSave}>
            Save
          </button>
          <button className="btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <button className="btn edit-btn" onClick={onEdit}>
            Edit
          </button>
          <button className="btn delete-btn" onClick={onDelete}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}
