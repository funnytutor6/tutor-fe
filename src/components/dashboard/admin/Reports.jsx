import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { adminService } from "../../../api/services/adminService";
import toast from "react-hot-toast";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [signupView, setSignupView] = useState('daily'); // 'daily' or 'monthly'

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const reportData = await adminService.getReportsData();
            console.log("reportData", reportData?.data);
            setData(reportData?.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
            toast.error("Failed to load reports data");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = async () => {
        if (!data) return;
        const { jsPDF } = await import("jspdf");
        const { default: autoTable } = await import("jspdf-autotable");

        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text("Admin Analytics Report", 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Summary Table
        const summaryData = [
            ["Total Active Subscriptions", data.subscriptionStats?.active || 0],
            ["Monthly Recurring Revenue (MRR)", `$${(data.subscriptionStats?.mrr || 0).toFixed(2)}`],
            ["Total Cancellations", data.subscriptionStats?.cancellations || 0],
            ["Failed Payments", data.subscriptionStats?.failedPayments || 0],
            ["Pending Teacher Approvals", data.pendingApprovals || 0],
            ["Total Teacher Posts", data.posts?.teacher || 0],
            ["Total Student Posts", data.posts?.student || 0],
        ];

        autoTable(doc, {
            head: [['Metric', 'Value']],
            body: summaryData,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [78, 115, 223] }, // Primary color
        });

        // Top Subjects
        doc.text("Top Requested Subjects", 14, doc.lastAutoTable.finalY + 15);
        const subjectRows = (data.topSubjects || []).map(s => [s.subject, s.count]);
        autoTable(doc, {
            head: [['Subject', 'Requests']],
            body: subjectRows,
            startY: doc.lastAutoTable.finalY + 20,
            theme: 'striped',
        });

        // Top Locations
        doc.text("Top Teacher Locations", 14, doc.lastAutoTable.finalY + 15);
        const locationRows = (data.topLocations || []).map(l => [l.location, l.count]);
        autoTable(doc, {
            head: [['Location', 'Teachers']],
            body: locationRows,
            startY: doc.lastAutoTable.finalY + 20,
            theme: 'striped',
        });

        doc.save("admin_reports.pdf");
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!data) return <div className="p-4">No data available.</div>;

    // --- Chart Data Preparation ---

    // 1. Signups Line Chart
    const processSignups = () => {
        const sourceData = signupView === 'daily' ? data.signups?.daily : data.signups?.monthly;
        if (!sourceData) return { labels: [], datasets: [] };

        // Get unique dates/months and sort
        const dates = [...new Set(sourceData.map(item => item.date))].sort();

        const teacherData = dates.map(date => {
            const found = sourceData.find(item => item.date === date && item.type === 'teacher');
            return found ? found.count : 0;
        });

        const studentData = dates.map(date => {
            const found = sourceData.find(item => item.date === date && item.type === 'student');
            return found ? found.count : 0;
        });

        // Format labels for display
        const displayLabels = dates.map(d => new Date(d).toLocaleDateString(undefined,
            signupView === 'monthly' ? { year: 'numeric', month: 'short' } : { month: 'short', day: 'numeric' }
        ));

        return {
            labels: displayLabels,
            datasets: [
                {
                    label: 'Teachers',
                    data: teacherData,
                    borderColor: 'rgba(78, 115, 223, 1)', // Primary
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Students',
                    data: studentData,
                    borderColor: 'rgba(28, 200, 138, 1)', // Success
                    backgroundColor: 'rgba(28, 200, 138, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        };
    };

    const signupChartData = processSignups();

    // 2. Subscription Health Bar Chart (Active vs Canceled vs Failed)
    const subHealthData = {
        labels: ['Active', 'Canceled', 'Failed Payments'],
        datasets: [
            {
                label: 'Count',
                data: [
                    data.subscriptionStats?.active || 0,
                    data.subscriptionStats?.cancellations || 0,
                    data.subscriptionStats?.failedPayments || 0
                ],
                backgroundColor: [
                    'rgba(28, 200, 138, 0.8)', // Success
                    'rgba(246, 194, 62, 0.8)', // Warning
                    'rgba(231, 74, 59, 0.8)',  // Danger
                ],
                borderColor: [
                    'rgba(28, 200, 138, 1)',
                    'rgba(246, 194, 62, 1)',
                    'rgba(231, 74, 59, 1)',
                ],
                borderWidth: 1,
            }
        ]
    };

    // 3. Top Subjects Bar
    const subjectData = {
        labels: (data.topSubjects || []).map(s => s.subject),
        datasets: [
            {
                label: 'Student Requests',
                data: (data.topSubjects || []).map(s => s.count),
                backgroundColor: 'rgba(54, 185, 204, 0.8)', // Info
                borderRadius: 4,
            }
        ]
    };

    // 4. Top Locations Bar
    const locationData = {
        labels: (data.topLocations || []).map(l => l.location),
        datasets: [
            {
                label: 'Active Teachers',
                data: (data.topLocations || []).map(l => l.count),
                backgroundColor: 'rgba(246, 194, 62, 0.8)', // Warning
                borderRadius: 4,
            }
        ]
    };


    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-0 text-dark fw-bold">Analytics Reports</h3>
                    <p className="text-muted small mb-0">Overview of platform performance</p>
                </div>
                <button className="btn btn-primary shadow-sm" onClick={downloadPDF}>
                    <i className="bi bi-file-earmark-pdf me-2"></i>Export PDF
                </button>
            </div>

            {/* Summary Cards */}
            <div className="row mb-4 g-3">
                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-primary">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-uppercase text-primary fw-bold text-xs mb-1">MRR</div>
                                    <div className="h4 mb-0 fw-bold text-dark">
                                        ${(data.subscriptionStats?.mrr || 0).toFixed(2)}
                                    </div>
                                </div>
                                <i className="bi bi-currency-dollar fs-1 text-gray-300 opacity-25"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-success">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-uppercase text-success fw-bold text-xs mb-1">Active Subscriptions</div>
                                    <div className="h4 mb-0 fw-bold text-dark">{data.subscriptionStats?.active || 0}</div>
                                </div>
                                <i className="bi bi-credit-card fs-1 text-gray-300 opacity-25"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-warning">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-uppercase text-warning fw-bold text-xs mb-1">Issues (Cancel/Fail)</div>
                                    <div className="h4 mb-0 fw-bold text-dark">
                                        {(data.subscriptionStats?.cancellations || 0) + (data.subscriptionStats?.failedPayments || 0)}
                                        <small className="text-muted ms-2 fs-6 fw-normal">
                                            ({data.subscriptionStats?.failedPayments || 0} failed)
                                        </small>
                                    </div>
                                </div>
                                <i className="bi bi-exclamation-triangle fs-1 text-gray-300 opacity-25"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card border-0 shadow-sm h-100 border-start border-4 border-info">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="text-uppercase text-info fw-bold text-xs mb-1">Total Posts</div>
                                    <div className="h4 mb-0 fw-bold text-dark">
                                        {(data.posts?.teacher || 0) + (data.posts?.student || 0)}
                                    </div>
                                </div>
                                <i className="bi bi-file-post fs-1 text-gray-300 opacity-25"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1: Signups & Sub Health */}
            <div className="row mb-4">
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header py-3 bg-white d-flex justify-content-between align-items-center">
                            <h6 className="m-0 font-weight-bold text-primary">User Growth (Signups)</h6>
                            <div className="btn-group btn-group-sm">
                                <button
                                    className={`btn ${signupView === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setSignupView('daily')}
                                >
                                    Last 30 Days
                                </button>
                                <button
                                    className={`btn ${signupView === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => setSignupView('monthly')}
                                >
                                    Last 12 Months
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart-area" style={{ height: '350px' }}>
                                <Line
                                    data={signupChartData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'top' } },
                                        scales: {
                                            y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
                                            x: { grid: { display: false } }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header py-3 bg-white">
                            <h6 className="m-0 font-weight-bold text-primary">Subscription Health</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-area" style={{ height: '350px' }}>
                                <Bar
                                    data={subHealthData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { beginAtZero: true }
                                        }
                                    }}
                                />
                            </div>
                            <div className="mt-3 text-center small text-muted">
                                <span className="me-3"><i className="bi bi-circle-fill text-success me-1"></i>Active</span>
                                <span className="me-3"><i className="bi bi-circle-fill text-warning me-1"></i>Cancelled</span>
                                <span><i className="bi bi-circle-fill text-danger me-1"></i>Failed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Subjects & Locations */}
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header py-3 bg-white">
                            <h6 className="m-0 font-weight-bold text-primary">Top Requested Subjects</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-area" style={{ height: '300px' }}>
                                <Bar
                                    data={subjectData}
                                    options={{
                                        indexAxis: 'y',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 mb-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-header py-3 bg-white">
                            <h6 className="m-0 font-weight-bold text-primary">Top Teacher Locations</h6>
                        </div>
                        <div className="card-body">
                            <div className="chart-area" style={{ height: '300px' }}>
                                <Bar
                                    data={locationData}
                                    options={{
                                        indexAxis: 'y',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
