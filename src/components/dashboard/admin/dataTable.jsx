import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const DataTable = ({
  data,
  columns,
  isLoading = false,
  enableFiltering = true,
  enablePagination = true,
  pageSize = 10,
  currentPage = 1,
  totalPages = 1,
  totalData = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {},
}) => {
  const memoizedData = useMemo(() => data || [], [data]);
  const memoizedColumns = useMemo(() => columns || [], [columns]);

  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading data...</p>
      </div>
    );
  }

  if (memoizedData.length === 0) {
    return (
      <div
        className="alert alert-info d-flex align-items-center"
        role="alert"
        style={{
          borderRadius: "12px",
          border: "none",
          padding: "2rem",
          backgroundColor: "#e7f3ff",
        }}
      >
        <i
          className="bi bi-info-circle me-3"
          style={{ fontSize: "1.5rem" }}
        ></i>
        <div>
          <strong>No data available</strong>
          <p className="mb-0 text-muted">There are no records to display.</p>
        </div>
      </div>
    );
  }

  const startIndex = table.getState().pagination.pageIndex * pageSize + 1;
  const endIndex = Math.min(
    (table.getState().pagination.pageIndex + 1) * pageSize,
    memoizedData.length
  );

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        border: "1px solid #e9ecef",
      }}
    >
      <div className="table-responsive" style={{ maxHeight: "600px" }}>
        <table
          className="table mb-0"
          style={{
            marginBottom: 0,
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="align-middle"
                    style={{
                      backgroundColor: "#f8f9fa",
                      color: "#495057",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "1rem 1.25rem",
                      borderBottom: "2px solid #dee2e6",
                      whiteSpace: "nowrap",
                      position: "sticky",
                      top: 0,
                      zIndex: 10,
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className="align-middle"
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                  transition: "all 0.2s ease",
                  borderBottom: "1px solid #e9ecef",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f0f4ff";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(102, 126, 234, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#ffffff" : "#f8f9fa";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="align-middle"
                    style={{
                      padding: "1rem 1.25rem",
                      fontSize: "0.9rem",
                      color: "#495057",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enablePagination && totalPages > 1 && (
        <div
          style={{
            backgroundColor: "#f8f9fa",
            borderTop: "1px solid #e9ecef",
            padding: "1.25rem 1.5rem",
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div className="text-muted" style={{ fontSize: "0.875rem" }}>
              Showing <strong className="text-dark">{startIndex}</strong> to{" "}
              <strong className="text-dark">{endIndex}</strong> of{" "}
              <strong className="text-dark">{totalData}</strong> entries
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-sm"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                title="First page"
                style={{
                  backgroundColor: currentPage === 1 ? "#e9ecef" : "#667eea",
                  color: currentPage === 1 ? "#adb5bd" : "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = "#5568d3";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = "#667eea";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <i className="bi bi-chevron-double-left"></i>
              </button>
              <button
                className="btn btn-sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                title="Previous page"
                style={{
                  backgroundColor: currentPage === 1 ? "#e9ecef" : "#667eea",
                  color: currentPage === 1 ? "#adb5bd" : "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = "#5568d3";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor = "#667eea";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <div
                style={{
                  minWidth: "120px",
                  textAlign: "center",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #dee2e6",
                  fontWeight: 600,
                  color: "#495057",
                  fontSize: "0.875rem",
                }}
              >
                {currentPage} / {totalPages}
              </div>
              <button
                className="btn btn-sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                title="Next page"
                style={{
                  backgroundColor:
                    currentPage === totalPages ? "#e9ecef" : "#667eea",
                  color: currentPage === totalPages ? "#adb5bd" : "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = "#5568d3";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = "#667eea";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
              <button
                className="btn btn-sm"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                title="Last page"
                style={{
                  backgroundColor:
                    currentPage === totalPages ? "#e9ecef" : "#667eea",
                  color: currentPage === totalPages ? "#adb5bd" : "#ffffff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = "#5568d3";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor = "#667eea";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <i className="bi bi-chevron-double-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
