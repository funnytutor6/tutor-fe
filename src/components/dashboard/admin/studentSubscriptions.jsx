import React, { useEffect, useMemo, useState } from "react";
import DataTable from "./dataTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { studentService } from "../../../api/services/studentService";

const StudentSubscriptions = () => {
  const [data, setData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await studentService.getAllPremiumStudentsForAdmin({
        page: currentPage,
        pageSize: pageSize,
        search: "",
      });
      console.log("response", response);
      setData(response?.data?.items || []);
      setTotalStudents(response?.data?.total || 0);
      setTotalPages(response?.data?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching student subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const columns = useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        cell: ({ getValue }) => {
          const id = getValue();
          return <code>{id?.substring(0, 8)}...</code>;
        },
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ getValue }) => (
          <span>
            <i className="bi bi-envelope me-2"></i>
            {getValue()}
          </span>
        ),
      },
      {
        header: "Subject",
        accessorKey: "subject",
        cell: ({ getValue }) => (
          <span>
            <i className="bi bi-book me-2"></i>
            {getValue() || "N/A"}
          </span>
        ),
      },
      {
        header: "Subscription Type",
        accessorKey: "subscriptionType",
        cell: ({ getValue }) => {
          const type = getValue();
          const badgeClass = type === "Premium" ? "bg-success" : "bg-secondary";
          return <span className={`badge ${badgeClass}`}>{type}</span>;
        },
      },
      {
        header: "Payment Status",
        accessorKey: "isPaid",
        cell: ({ getValue }) => {
          const isPaid = getValue();
          return (
            <span className={`badge ${isPaid ? "bg-success" : "bg-danger"}`}>
              {isPaid ? "PAID" : "FREE"}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <i className="bi bi-mortarboard me-2"></i>
          Student Subscriptions
        </h4>
        <span className="badge bg-primary">{totalStudents} students</span>
      </div>
      <DataTable
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        totalData={totalStudents}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => setPageSize(size)}
      />
    </div>
  );
};

export default StudentSubscriptions;
