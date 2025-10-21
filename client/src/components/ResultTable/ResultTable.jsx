import { useEffect, useMemo, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography
} from "@mui/material";
import SelectWithAdd from "../SelectWithAdd/SelectWithAdd";
import RowActions from "../RowActions/RowActions";
import styles from "./ResultTable.module.css";
import "./ResultTable.css";


export default function ResultTable({
  data,
  isLoading,
  onSave,
  onDelete,
  dropdownData,
  readOnly,
}) {
  const groupedData = useMemo(() => {
    return (data || []).map((emp) => ({
      ...emp,
      ExtIDs: Array.isArray(emp.ExtIDs)
        ? emp.ExtIDs
        : emp.ExtIDs
        ? String(emp.ExtIDs).split(",")
        : [],
      IPNumbers: Array.isArray(emp.IPNumbers)
        ? emp.IPNumbers
        : emp.IPNumbers
        ? String(emp.IPNumbers).split(",")
        : [],
    }));
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil((groupedData?.length || 0) / rowsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [groupedData, totalPages]);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentRows = useMemo(
    () => groupedData.slice(startIndex, endIndex),
    [groupedData, startIndex, endIndex]
  );

  function handlePaging(pageNum) {
    const newPage = Math.max(1, Math.min(pageNum, totalPages));
    setCurrentPage(newPage);
    setEditingId(null);
    setDraft({});
  }

  const [editingId, setEditingId] = useState(null); // EmpNo of row being edited
  const [draft, setDraft] = useState({}); // editable copy of the row

  const isEditing = (emp) => editingId === emp.EmpNo;

  const startEdit = (emp) => {
    setEditingId(emp.EmpNo);
    setDraft({
      ...emp,
      DepartmentID: emp.DepartmentID,
      DesignationID: emp.DesignationID,
      LocationID: emp.LocationID,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (onSave) {
      try {
        const original = data.find((emp) => emp.EmpNo === draft.EmpNo);
        const changes = {};
        Object.keys(draft).forEach((key) => {
          if (draft[key] !== original[key]) {
            changes[key] = draft[key];
          }
        });

        await onSave({ EmpNo: draft.EmpNo, ...changes });
        setEditingId(null);
        setDraft({});
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleField = (field, value) => {
    setDraft((prev) => {
      if (field === "DepartmentID") {
        const name =
          dropdownData.departments.find((d) => d.id === value)?.name || "";
        return { ...prev, DepartmentID: value, DepartmentName: name };
      }
      if (field === "DesignationID") {
        const name =
          dropdownData.designations.find((d) => d.id === value)?.name || "";
        return { ...prev, DesignationID: value, DesignationName: name };
      }
      if (field === "LocationID") {
        const name =
          dropdownData.locations.find((l) => l.id === value)?.name || "";
        return { ...prev, LocationID: value, LocationName: name };
      }
      if (field === "IPNumbers") {
        return { ...prev, [field]: value.split("\n") };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  };

  if (isLoading) return <div className={styles.spinner}></div>;

  if (isLoading && (data?.length ?? 0) === 0) {
    return (
      <div className={styles.noResult}>
        <Typography>No Results Found.</Typography>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="resultContainer">
      <TableContainer 
        component={Paper}
        sx={{ width: "100%", borderRadius:"1rem" }}
        className="resultContainer"
      > 
        <h1>Search Results</h1>
        <Table sx={{ minWidth: "100%" }} className="customTable">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 120 }} className="customHeader">Emp. No.</TableCell>
              <TableCell sx={{ width: 200 }} className="customHeader">Name</TableCell>
              <TableCell sx={{ width: 150 }} className="customHeader">Department</TableCell>
              <TableCell sx={{ width: 150 }} className="customHeader">Designation</TableCell>
              <TableCell sx={{ width: 150 }} className="customHeader">Location</TableCell>
              <TableCell sx={{ width: 160 }} className="customHeader">IP Extension</TableCell>
              <TableCell sx={{ width: 210 }} className="customHeader">Email</TableCell>
              {readOnly && <TableCell sx={{ width: 120 }} className="customHeader">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {currentRows.map((emp) => (
              <TableRow key={emp.EmpNo}>
                <TableCell className="customCell">{emp.EmpNo}</TableCell>

                <TableCell  className="customCell">
                  {isEditing(emp) ? (
                    <input
                      className={styles.cellInput}
                      value={draft.Name ?? ""}
                      onChange={(e) => handleField("Name", e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  ) : (
                    emp.Name
                  )}
                </TableCell>

                <TableCell  className="customCell">
                  {isEditing(emp) ? (
                    <SelectWithAdd
                      name="DepartmentName"
                      value={draft.DepartmentID || ""}
                      placeholder="Departments"
                      options={dropdownData.departments}
                      onChange={(e) =>
                        handleField("DepartmentID", e.target.value)
                      }
                    />
                  ) : (
                    emp.DepartmentName
                  )}
                </TableCell>

                <TableCell  className="customCell">
                  {isEditing(emp) ? (
                    <SelectWithAdd
                      name="DesignationName"
                      value={draft.DesignationID || ""}
                      placeholder="Designations"
                      options={dropdownData.designations}
                      onChange={(e) =>
                        handleField("DesignationID", e.target.value)
                      }
                    />
                  ) : (
                    emp.DesignationName
                  )}
                </TableCell>

                <TableCell  className="customCell">
                  {isEditing(emp) ? (
                    <SelectWithAdd
                      name="LocationName"
                      value={draft.LocationID || ""}
                      placeholder="Locations"
                      options={dropdownData.locations}
                      onChange={(e) =>
                        handleField("LocationID", e.target.value)
                      }
                    />
                  ) : (
                    emp.LocationName
                  )}
                </TableCell>

                <TableCell  className="customCell">
                  {isEditing(emp) ? (
                    <textarea
                      className={styles.cellInput}
                      value={draft.IPNumbers?.join("\n") ?? ""}
                      onChange={(e) => handleField("IPNumbers", e.target.value)}
                    />
                  ) : Array.isArray(emp.IPNumbers) ? (
                    emp.IPNumbers.map((ip) => <div key={ip}>{ip}</div>)
                  ) : (
                    <div>{emp.IPNumbers ?? "N/A"}</div>
                  )}
                </TableCell>

                <TableCell  className="customCell" >
                  {isEditing(emp) ? (
                    <input
                      className={styles.cellInput}
                      value={draft.Email ?? ""}
                      onChange={(e) => handleField("Email", e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  ) : (
                    emp.Email
                  )}
                </TableCell>

                {readOnly && (
                  <TableCell>
                    <RowActions
                      isEditing={isEditing(emp)}
                      onEdit={() => startEdit(emp)}
                      onDelete={() => onDelete?.(emp.EmpNo)}
                      onSave={saveEdit}
                      onCancel={cancelEdit}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePaging(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? styles.active : ""}
              onClick={() => handlePaging(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePaging(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}