import React, { useMemo, useState, useEffect } from "react";
import DataTable from "./dataTable";
import AdminSearchInput from "./adminSearchInput";
import { adminService } from "../../../api/services/adminService";
import TeacherSubscriptionDetailsModal from "./teacherSubscriptionDetailsModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const TeacherSubscriptions = ({ isLoading: parentLoading }) => {
  const [data, setData] = useState([]);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, search]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getAllTeacherSubscriptionsForAdmin({
        page: currentPage,
        pageSize: pageSize,
        search: search,
      });
      const responseData = response?.data || response;
      setData(responseData.items || []);
      setTotalSubscriptions(responseData.total || 0);
      setTotalPages(responseData.totalPages || 0);
    } catch (error) {
      console.error("Error fetching teacher subscriptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status, isPaid, currentPeriodEnd) => {
    if (!status && isPaid) {
      // Legacy one-time payment
      return <span className="badge bg-info">Legacy</span>;
    }

    const now = new Date();
    const periodEnd = currentPeriodEnd ? new Date(currentPeriodEnd) : null;
    const isActive = status === "active" && periodEnd && periodEnd > now;

    if (isActive) {
      return <span className="badge bg-success">Active</span>;
    } else if (status === "canceled") {
      return <span className="badge bg-secondary">Canceled</span>;
    } else if (status === "past_due") {
      return <span className="badge bg-warning">Past Due</span>;
    } else if (status === "unpaid") {
      return <span className="badge bg-danger">Unpaid</span>;
    } else if (status === "trialing") {
      return <span className="badge bg-info">Trialing</span>;
    } else {
      return <span className="badge bg-secondary">Inactive</span>;
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Email",
        accessorKey: "mail",
        cell: ({ getValue }) => (
          <span>
            <i className="bi bi-envelope me-2"></i>
            {getValue()}
          </span>
        ),
      },
      {
        header: "Subscription Status",
        accessorKey: "subscriptionStatus",
        cell: ({ row }) => {
          const status = row.original.subscriptionStatus;
          const isPaid = row.original.ispaid;
          const periodEnd = row.original.currentPeriodEnd;
          return getStatusBadge(status, isPaid, periodEnd);
        },
      },
      {
        header: "Current Period End",
        accessorKey: "currentPeriodEnd",
        cell: ({ getValue, row }) => {
          const periodEnd = getValue();
          if (periodEnd) {
            return new Date(periodEnd).toLocaleDateString();
          }
          // Legacy payment - calculate 1 year from payment date
          if (row.original.paymentDate) {
            const paymentDate = new Date(row.original.paymentDate);
            const oneYearLater = new Date(
              paymentDate.getTime() + 30 * 24 * 60 * 60 * 1000
            );
            return oneYearLater.toLocaleDateString();
          }
          return "N/A";
        },
      },
      {
        header: "Next Billing",
        accessorKey: "currentPeriodEnd",
        cell: ({ getValue, row }) => {
          const periodEnd = getValue();
          const cancelAtPeriodEnd = row.original.cancelAtPeriodEnd;
          if (periodEnd && !cancelAtPeriodEnd) {
            return new Date(periodEnd).toLocaleDateString();
          }
          return cancelAtPeriodEnd ? (
            <span className="text-muted">Will cancel</span>
          ) : (
            "N/A"
          );
        },
      },
      {
        header: "Payment Amount",
        accessorKey: "paymentAmount",
        cell: ({ getValue }) => {
          const amount = getValue();
          return amount ? `$${amount}` : "N/A";
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setSelectedSubscription(row.original);
              setShowDetailsModal(true);
            }}
          >
            <i className="bi bi-eye me-1"></i>
            View
          </button>
        ),
      },
    ],
    []
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          <i className="bi bi-person-workspace me-2"></i>
          Tutor Subscriptions
        </h4>
        <span className="badge bg-primary">{totalSubscriptions} teachers</span>
      </div>

      <AdminSearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by email..."
        maxWidth="500px"
      />

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading || parentLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        totalData={totalSubscriptions}
      />

      {showDetailsModal && selectedSubscription && (
        <TeacherSubscriptionDetailsModal
          subscription={selectedSubscription}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSubscription(null);
          }}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
};

export default TeacherSubscriptions;
