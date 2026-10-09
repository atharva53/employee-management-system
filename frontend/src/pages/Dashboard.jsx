import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

const getEmployees = async () => {
    const response = await api.get("/employees");

    const data =
        response.data.employees ||
        response.data.data ||
        response.data;

    return Array.isArray(data) ? data : [];
};

function Dashboard() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                setEmployees(await getEmployees());
                setError("");
            } catch (err) {
                console.error("Dashboard employee fetch error:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load dashboard data"
                );
            } finally {
                setLoading(false);
            }
        };

        loadEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError("");
            setEmployees(await getEmployees());
        } catch (err) {
            console.error("Dashboard employee fetch error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to load dashboard data"
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       DASHBOARD STATISTICS
    ========================= */

    const stats = useMemo(() => {
        const totalEmployees = employees.length;

        const activeEmployees = employees.filter(
            (employee) =>
                String(employee.status || "").toLowerCase() === "active"
        ).length;

        const inactiveEmployees = employees.filter(
            (employee) =>
                String(employee.status || "").toLowerCase() === "inactive"
        ).length;

        const onLeaveEmployees = employees.filter(
            (employee) =>
                String(employee.status || "").toLowerCase() === "on leave"
        ).length;

        const departments = [
            ...new Set(
                employees
                    .map((employee) => employee.department || employee.department_name)
                    .filter(Boolean)
            ),
        ];

        const totalSalary = employees.reduce(
            (total, employee) =>
                total + Number(employee.salary || 0),
            0
        );

        const averageSalary =
            totalEmployees > 0
                ? totalSalary / totalEmployees
                : 0;

        return {
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            onLeaveEmployees,
            totalDepartments: departments.length,
            totalSalary,
            averageSalary,
        };
    }, [employees]);

    /* =========================
       DEPARTMENT DATA
    ========================= */

    const departmentData = useMemo(() => {
        const departmentMap = {};

        employees.forEach((employee) => {
            const department =
                employee.department ||
                employee.department_name ||
                "Not Assigned";

            departmentMap[department] =
                (departmentMap[department] || 0) + 1;
        });

        return Object.entries(departmentMap)
            .map(([name, count]) => ({
                name,
                count,
            }))
            .sort((a, b) => b.count - a.count);
    }, [employees]);

    /* =========================
       STATUS DATA
    ========================= */

    const statusData = useMemo(() => {
        return [
            {
                label: "Active",
                count: stats.activeEmployees,
                className: "active",
            },
            {
                label: "Inactive",
                count: stats.inactiveEmployees,
                className: "inactive",
            },
            {
                label: "On Leave",
                count: stats.onLeaveEmployees,
                className: "leave",
            },
        ];
    }, [stats]);

    /* =========================
       RECENT EMPLOYEES
    ========================= */

    const recentEmployees = useMemo(() => {
        return [...employees]
            .sort((a, b) => {
                const dateA = new Date(
                    a.created_at ||
                    a.joining_date ||
                    0
                );

                const dateB = new Date(
                    b.created_at ||
                    b.joining_date ||
                    0
                );

                return dateB - dateA;
            })
            .slice(0, 5);
    }, [employees]);

    /* =========================
       RECENT JOINERS
    ========================= */

    const recentJoiners = useMemo(() => {
        return [...employees]
            .filter((employee) => employee.joining_date)
            .sort(
                (a, b) =>
                    new Date(b.joining_date) -
                    new Date(a.joining_date)
            )
            .slice(0, 5);
    }, [employees]);

    /* =========================
       HELPERS
    ========================= */

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getInitials = (employee) => {
        const first =
            employee.first_name ||
            employee.firstName ||
            "";

        const last =
            employee.last_name ||
            employee.lastName ||
            "";

        return (
            `${first.charAt(0)}${last.charAt(0)}`
                .toUpperCase() || "E"
        );
    };

    const getFullName = (employee) => {
        const first =
            employee.first_name ||
            employee.firstName ||
            "";

        const last =
            employee.last_name ||
            employee.lastName ||
            "";

        return `${first} ${last}`.trim() || "Unknown Employee";
    };

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    /* =========================
       ERROR
    ========================= */

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-error">
                    <div className="error-icon">!</div>

                    <h2>Unable to load dashboard</h2>

                    <p>{error}</p>

                    <button
                        className="dashboard-btn primary"
                        onClick={fetchEmployees}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* =================================
                PAGE HEADER
            ================================= */}

            <div className="dashboard-header">

                <div>
                    <span className="dashboard-eyebrow">
                        ADMIN PANEL
                    </span>

                    <h1>Dashboard</h1>

                    <p>
                        Overview of your employee management system
                    </p>
                </div>

                <div className="dashboard-header-actions">

                    <button
                        className="dashboard-refresh-btn"
                        onClick={fetchEmployees}
                        title="Refresh dashboard"
                    >
                        ↻
                    </button>

                    <Link
                        to="/employees"
                        className="dashboard-btn primary"
                    >
                        View Employees
                    </Link>

                </div>

            </div>


            {/* =================================
                STAT CARDS
            ================================= */}

            <div className="stats-grid">

                {/* Total Employees */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon employees-icon">
                            👥
                        </div>

                        <span className="stat-label">
                            TOTAL EMPLOYEES
                        </span>

                    </div>

                    <div className="stat-value">
                        {stats.totalEmployees}
                    </div>

                    <div className="stat-footer">
                        <span className="stat-footer-icon">
                            —
                        </span>

                        <span>
                            All employees
                        </span>
                    </div>

                </div>


                {/* Active */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon active-icon">
                            ✓
                        </div>

                        <span className="stat-label">
                            ACTIVE EMPLOYEES
                        </span>

                    </div>

                    <div className="stat-value">
                        {stats.activeEmployees}
                    </div>

                    <div className="stat-footer success-text">
                        <span className="stat-footer-icon">
                            ●
                        </span>

                        <span>
                            Currently active
                        </span>
                    </div>

                </div>


                {/* On Leave */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon leave-icon">
                            ◷
                        </div>

                        <span className="stat-label">
                            ON LEAVE
                        </span>

                    </div>

                    <div className="stat-value">
                        {stats.onLeaveEmployees}
                    </div>

                    <div className="stat-footer warning-text">
                        <span className="stat-footer-icon">
                            ●
                        </span>

                        <span>
                            Currently on leave
                        </span>
                    </div>

                </div>


                {/* Departments */}

                <div className="stat-card">

                    <div className="stat-card-top">

                        <div className="stat-icon department-icon">
                            #
                        </div>

                        <span className="stat-label">
                            DEPARTMENTS
                        </span>

                    </div>

                    <div className="stat-value">
                        {stats.totalDepartments}
                    </div>

                    <div className="stat-footer">
                        <span className="stat-footer-icon">
                            —
                        </span>

                        <span>
                            Active departments
                        </span>
                    </div>

                </div>

            </div>


            {/* =================================
                SECONDARY STATS
            ================================= */}

            <div className="secondary-stats-grid">

                <div className="secondary-stat-card">

                    <div>
                        <span>
                            TOTAL PAYROLL
                        </span>

                        <h3>
                            {formatCurrency(stats.totalSalary)}
                        </h3>
                    </div>

                    <div className="secondary-stat-icon">
                        ₹
                    </div>

                </div>


                <div className="secondary-stat-card">

                    <div>
                        <span>
                            AVERAGE SALARY
                        </span>

                        <h3>
                            {formatCurrency(stats.averageSalary)}
                        </h3>
                    </div>

                    <div className="secondary-stat-icon">
                        ₹
                    </div>

                </div>


                <div className="secondary-stat-card">

                    <div>
                        <span>
                            INACTIVE EMPLOYEES
                        </span>

                        <h3>
                            {stats.inactiveEmployees}
                        </h3>
                    </div>

                    <div className="secondary-stat-icon">
                        —
                    </div>

                </div>

            </div>


            {/* =================================
                MAIN DASHBOARD GRID
            ================================= */}

            <div className="dashboard-main-grid">

                {/* ==========================
                    DEPARTMENT OVERVIEW
                ========================== */}

                <div className="dashboard-card department-card">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>Department Overview</h2>

                            <p>
                                Employee distribution by department
                            </p>
                        </div>

                        <Link
                            to="/employees"
                            className="view-all-link"
                        >
                            View All →
                        </Link>

                    </div>


                    <div className="department-list">

                        {departmentData.length === 0 ? (

                            <div className="empty-state">
                                <p>
                                    No department data available
                                </p>
                            </div>

                        ) : (

                            departmentData.map(
                                (department, index) => {

                                    const percentage =
                                        stats.totalEmployees > 0
                                            ? (
                                                department.count /
                                                stats.totalEmployees
                                            ) * 100
                                            : 0;

                                    return (
                                        <div
                                            className="department-row"
                                            key={department.name}
                                        >

                                            <div className="department-row-top">

                                                <div className="department-name-wrapper">

                                                    <div className="department-number">
                                                        {index + 1}
                                                    </div>

                                                    <span>
                                                        {department.name}
                                                    </span>

                                                </div>

                                                <strong>
                                                    {department.count}
                                                </strong>

                                            </div>

                                            <div className="progress-bar">

                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                ></div>

                                            </div>

                                        </div>
                                    );
                                }
                            )

                        )}

                    </div>

                </div>


                {/* ==========================
                    STATUS OVERVIEW
                ========================== */}

                <div className="dashboard-card status-card">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>Employee Status</h2>

                            <p>
                                Current workforce status
                            </p>
                        </div>

                    </div>


                    <div className="status-overview">

                        <div className="status-circle">

                            <div>
                                <strong>
                                    {stats.totalEmployees}
                                </strong>

                                <span>
                                    Employees
                                </span>
                            </div>

                        </div>


                        <div className="status-list">

                            {statusData.map((status) => {

                                const percentage =
                                    stats.totalEmployees > 0
                                        ? Math.round(
                                            (status.count /
                                                stats.totalEmployees) *
                                            100
                                        )
                                        : 0;

                                return (
                                    <div
                                        className="status-row"
                                        key={status.label}
                                    >

                                        <div className="status-row-info">

                                            <span
                                                className={`status-dot ${status.className}`}
                                            ></span>

                                            <span>
                                                {status.label}
                                            </span>

                                        </div>

                                        <div className="status-count">

                                            <strong>
                                                {status.count}
                                            </strong>

                                            <small>
                                                {percentage}%
                                            </small>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================
                RECENT EMPLOYEES
            ================================= */}

            <div className="dashboard-card recent-employees-card">

                <div className="dashboard-card-header">

                    <div>
                        <h2>Recent Employees</h2>

                        <p>
                            Recently added employee records
                        </p>
                    </div>

                    <Link
                        to="/employees"
                        className="view-all-link"
                    >
                        View All →
                    </Link>

                </div>


                {recentEmployees.length === 0 ? (

                    <div className="empty-state large">
                        <h3>No Employees Found</h3>

                        <p>
                            Start by adding your first employee.
                        </p>

                        <Link
                            to="/employees/add"
                            className="dashboard-btn primary"
                        >
                            Add Employee
                        </Link>
                    </div>

                ) : (

                    <div className="employee-table-wrapper">

                        <table className="employee-table">

                            <thead>

                                <tr>

                                    <th>EMPLOYEE</th>

                                    <th>DEPARTMENT</th>

                                    <th>DESIGNATION</th>

                                    <th>JOINING DATE</th>

                                    <th>STATUS</th>

                                    <th>ACTION</th>

                                </tr>

                            </thead>

                            <tbody>

                                {recentEmployees.map(
                                    (employee) => (

                                        <tr key={employee.id}>

                                            <td>

                                                <div className="employee-info">

                                                    <div className="employee-avatar-small">
                                                        {getInitials(employee)}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {getFullName(
                                                                employee
                                                            )}
                                                        </strong>

                                                        <span>
                                                            {employee.email ||
                                                                "-"}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>
                                                {employee.department ||
                                                    employee.department_name ||
                                                    "Not Assigned"}
                                            </td>


                                            <td>
                                                {employee.designation ||
                                                    employee.designation_name ||
                                                    "-"}
                                            </td>


                                            <td>
                                                {formatDate(
                                                    employee.joining_date
                                                )}
                                            </td>


                                            <td>

                                                <span
                                                    className={`table-status ${
                                                        String(
                                                            employee.status ||
                                                            ""
                                                        ).toLowerCase() ===
                                                        "active"
                                                            ? "active"
                                                            : String(
                                                                employee.status ||
                                                                ""
                                                            ).toLowerCase() ===
                                                            "on leave"
                                                                ? "leave"
                                                                : "inactive"
                                                    }`}
                                                >
                                                    {employee.status ||
                                                        "Unknown"}
                                                </span>

                                            </td>


                                            <td>

                                                <Link
                                                    to={`/employees/${employee.id}`}
                                                    className="view-btn"
                                                >
                                                    View
                                                </Link>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* =================================
                BOTTOM GRID
            ================================= */}

            <div className="dashboard-bottom-grid">

                {/* Recent Joiners */}

                <div className="dashboard-card">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>Recent Joiners</h2>

                            <p>
                                Latest joining dates
                            </p>
                        </div>

                    </div>


                    <div className="recent-joiners-list">

                        {recentJoiners.length === 0 ? (

                            <div className="empty-state">
                                <p>
                                    No joining date available
                                </p>
                            </div>

                        ) : (

                            recentJoiners.map(
                                (employee) => (

                                    <Link
                                        to={`/employees/${employee.id}`}
                                        className="joiner-item"
                                        key={employee.id}
                                    >

                                        <div className="employee-avatar-small">
                                            {getInitials(employee)}
                                        </div>

                                        <div className="joiner-info">

                                            <strong>
                                                {getFullName(employee)}
                                            </strong>

                                            <span>
                                                {employee.designation ||
                                                    employee.department ||
                                                    "Employee"}
                                            </span>

                                        </div>

                                        <div className="joiner-date">
                                            {formatDate(
                                                employee.joining_date
                                            )}
                                        </div>

                                    </Link>

                                )
                            )

                        )}

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="dashboard-card">

                    <div className="dashboard-card-header">

                        <div>
                            <h2>Quick Actions</h2>

                            <p>
                                Common employee management actions
                            </p>
                        </div>

                    </div>


                    <div className="quick-actions">

                        <Link
                            to="/employees/add"
                            className="quick-action"
                        >

                            <div className="quick-action-icon">
                                +
                            </div>

                            <div>
                                <strong>
                                    Add Employee
                                </strong>

                                <span>
                                    Create a new employee
                                </span>
                            </div>

                            <span className="quick-arrow">
                                →
                            </span>

                        </Link>


                        <Link
                            to="/employees"
                            className="quick-action"
                        >

                            <div className="quick-action-icon">
                                👥
                            </div>

                            <div>
                                <strong>
                                    Manage Employees
                                </strong>

                                <span>
                                    View and edit employees
                                </span>
                            </div>

                            <span className="quick-arrow">
                                →
                            </span>

                        </Link>


                        <Link
                            to="/employees"
                            className="quick-action"
                        >

                            <div className="quick-action-icon">
                                ◫
                            </div>

                            <div>
                                <strong>
                                    Employee Reports
                                </strong>

                                <span>
                                    View employee records
                                </span>
                            </div>

                            <span className="quick-arrow">
                                →
                            </span>

                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;