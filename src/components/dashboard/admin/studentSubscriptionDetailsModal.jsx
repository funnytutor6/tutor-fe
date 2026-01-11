import React, { useState, useEffect } from "react";
import { subscriptionService } from "../../../api/services/subscriptionService";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const StudentSubscriptionDetailsModal = ({
  subscription,
  onClose,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    if (subscription?.email) {
      fetchInvoiceHistory();
    }
  }, [subscription]);

  const fetchInvoiceHistory = async () => {
    try {
      setLoadingInvoices(true);
      const response = await subscriptionService.getStudentInvoiceHistory(
        subscription.email
      );
      const invoices = response?.data || response;
      setInvoiceHistory(Array.isArray(invoices) ? invoices : []);
    } catch (error) {
      console.error("Error fetching invoice history:", error);
      setInvoiceHistory([]);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const getStatusBadge = (status, isPaid, currentPeriodEnd) => {
    if (!status && isPaid) {
      return <span className="badge bg-info">Legacy Payment</span>;
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

  const handleCancelSubscription = async (cancelAtPeriodEnd = true) => {
    if (
      !window.confirm(
        cancelAtPeriodEnd
          ? "Are you sure you want to cancel this subscription? It will remain active until the end of the current billing period."
          : "Are you sure you want to cancel this subscription immediately? Access will be revoked right away."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await subscriptionService.cancelStudentSubscription(
        subscription.email,
        cancelAtPeriodEnd
      );
      toast.success(
        cancelAtPeriodEnd
          ? "Subscription will be canceled at the end of the billing period"
          : "Subscription canceled immediately"
      );
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to cancel subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    try {
      await subscriptionService.reactivateStudentSubscription(
        subscription.email
      );
      toast.success("Subscription reactivated successfully");
      if (onUpdate) {
        onUpdate();
      }
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to reactivate subscription"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-mortarboard me-2"></i>
              Student Subscription Details
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Student Information */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">
                  <i className="bi bi-person me-2"></i>
                  Student Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Email:</strong> {subscription.email}
                    </p>
                    <p>
                      <strong>Subject:</strong> {subscription.subject || "N/A"}
                    </p>
                    <p>
                      <strong>Payment Status:</strong>{" "}
                      <span
                        className={`badge ${
                          subscription.ispayed ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {subscription.ispayed ? "PAID" : "UNPAID"}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Created:</strong>{" "}
                      {subscription.created
                        ? new Date(subscription.created).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Last Updated:</strong>{" "}
                      {subscription.updated
                        ? new Date(subscription.updated).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">
                  <i className="bi bi-credit-card me-2"></i>
                  Subscription Details
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Subscription Status:</strong>{" "}
                      {getStatusBadge(
                        subscription.subscriptionStatus,
                        subscription.ispayed,
                        subscription.currentPeriodEnd
                      )}
                    </p>
                    {subscription.stripeSubscriptionId && (
                      <p>
                        <strong>Stripe Subscription ID:</strong>{" "}
                        <code>
                          {subscription.stripeSubscriptionId.substring(0, 20)}
                          ...
                        </code>
                      </p>
                    )}
                    {subscription.stripeCustomerId && (
                      <p>
                        <strong>Stripe Customer ID:</strong>{" "}
                        <code>
                          {subscription.stripeCustomerId.substring(0, 20)}...
                        </code>
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    {subscription.currentPeriodStart && (
                      <p>
                        <strong>Current Period Start:</strong>{" "}
                        {new Date(
                          subscription.currentPeriodStart
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {subscription.currentPeriodEnd && (
                      <p>
                        <strong>Current Period End:</strong>{" "}
                        {new Date(
                          subscription.currentPeriodEnd
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {subscription.cancelAtPeriodEnd && (
                      <p>
                        <strong>Cancel At Period End:</strong>{" "}
                        <span className="badge bg-warning">Yes</span>
                      </p>
                    )}
                    {subscription.canceledAt && (
                      <p>
                        <strong>Canceled At:</strong>{" "}
                        {new Date(subscription.canceledAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {subscription.paymentAmount && (
                  <div className="mt-3">
                    <p>
                      <strong>Payment Amount:</strong> $
                      {subscription.paymentAmount}
                    </p>
                    {subscription.paymentDate && (
                      <p>
                        <strong>Last Payment Date:</strong>{" "}
                        {new Date(
                          subscription.paymentDate
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Invoice History */}
            <div className="card mb-4">
              <div className="card-header bg-secondary text-white">
                <h6 className="mb-0">
                  <i className="bi bi-receipt me-2"></i>
                  Invoice History
                </h6>
              </div>
              <div className="card-body">
                {loadingInvoices ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm"></div>
                    <p className="mt-2">Loading invoices...</p>
                  </div>
                ) : invoiceHistory.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Period</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceHistory.map((invoice) => (
                          <tr key={invoice.id}>
                            <td>
                              {invoice.created
                                ? new Date(invoice.created).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>
                              {invoice.currency} {invoice.amount}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  invoice.status === "paid"
                                    ? "bg-success"
                                    : invoice.status === "open"
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}
                              >
                                {invoice.status?.toUpperCase() || "N/A"}
                              </span>
                            </td>
                            <td>
                              {invoice.periodStart && invoice.periodEnd
                                ? `${new Date(
                                    invoice.periodStart
                                  ).toLocaleDateString()} - ${new Date(
                                    invoice.periodEnd
                                  ).toLocaleDateString()}`
                                : "N/A"}
                            </td>
                            <td>
                              {invoice.hostedInvoiceUrl && (
                                <a
                                  href={invoice.hostedInvoiceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="bi bi-download me-1"></i>
                                  View
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center py-3">
                    No invoice history available
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            {subscription.stripeSubscriptionId && (
              <div className="card">
                <div className="card-header bg-warning text-dark">
                  <h6 className="mb-0">
                    <i className="bi bi-gear me-2"></i>
                    Subscription Management
                  </h6>
                </div>
                <div className="card-body">
                  {subscription.subscriptionStatus === "active" &&
                    !subscription.cancelAtPeriodEnd && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleCancelSubscription(true)}
                          disabled={loading}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel at Period End
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelSubscription(false)}
                          disabled={loading}
                        >
                          <i className="bi bi-x-octagon me-2"></i>
                          Cancel Immediately
                        </button>
                      </div>
                    )}

                  {subscription.subscriptionStatus === "canceled" &&
                    !subscription.canceledAt && (
                      <button
                        className="btn btn-success"
                        onClick={handleReactivateSubscription}
                        disabled={loading}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Reactivate Subscription
                      </button>
                    )}
                  {subscription.cancelAtPeriodEnd ? (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      This subscription is scheduled to cancel at the end of the
                      current billing period.
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSubscriptionDetailsModal;
