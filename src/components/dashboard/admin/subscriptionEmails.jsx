import React, { useMemo } from "react";
import DataTable from "./dataTable";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const SubscriptionEmails = ({ data, isLoading }) => {
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
        header: "Subscribed At",
        accessorKey: "subscribedAt",
        cell: ({ getValue }) => (
          <span>
            <i className="bi bi-calendar me-2"></i>
            {getValue()}
          </span>
        ),
      },
      {
        header: "Plan",
        accessorKey: "plan",
        cell: ({ getValue }) => (
          <span className="badge bg-secondary">{getValue()}</span>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <i className="bi bi-envelope-check me-2"></i>
          Subscription Emails
        </h4>
        <span className="badge bg-primary">{data?.length || 0} subscribers</span>
      </div>
      <DataTable
        data={data || []}
        columns={columns}
        isLoading={isLoading}
        pageSize={10}
      />
    </div>
  );
};

export default SubscriptionEmails;

