import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EmployeeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);

                const response = await api.get(`/employees/${id}`);

                const data = response.data.employee || response.data.data || response.data;

                setEmployee(data);

            } catch (err) {
                console.error("Fetch employee error:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load employee details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatSalary = (salary) => {
        if (!salary) return "-";

        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(salary);
    };

    if (loading) {
        return (
            <div className="page-container">
                <p>Loading employee details...</p>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="page-container">

                <div className="error-message">
                    {error || "Employee not found"}
                </div>

                <button
                    className="secondary-btn"
                    onClick={() => navigate("/employees")}
                >
                    ← Back to Employees
                </button>

            </div>
        );
    }

    return (
        <div className="page-container">

            {/* Header */}

            <div className="page-header">

                <div>
                    <h1>Employee Details</h1>
                    <p>View complete employee information</p>
                </div>

                <div className="header-actions">

                    <button
                        className="secondary-btn"
                        onClick={() => navigate("/employees")}
                    >
                        ← Back
                    </button>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate(`/employees/${employee.id}/edit`)
                        }
                    >
                        Edit Employee
                    </button>

                </div>

            </div>


            {/* Employee Profile */}

            <div className="employee-profile-card">

                <div className="employee-avatar">

                    {employee.first_name
                        ?.charAt(0)
                        ?.toUpperCase()}

                </div>

                <div className="employee-profile-info">

                    <h2>
                        {employee.first_name}{" "}
                        {employee.last_name}
                    </h2>

                    <p>
                        {employee.designation || employee.designation_name || "Employee"}
                    </p>

                    <span
                        className={`status-badge ${
                            employee.status === "Active"
                                ? "active"
                                : "inactive"
                        }`}
                    >
                        {employee.status || "Active"}
                    </span>

                </div>

            </div>


            {/* Personal Information */}

            <div className="details-card">

                <div className="details-card-header">
                    <h2>Personal Information</h2>
                </div>

                <div className="details-grid">

                    <div className="detail-item">
                        <span className="detail-label">
                            Employee ID
                        </span>

                        <strong>
                            #{employee.id}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            First Name
                        </span>

                        <strong>
                            {employee.first_name || "-"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Last Name
                        </span>

                        <strong>
                            {employee.last_name || "-"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Email
                        </span>

                        <strong>
                            {employee.email || "-"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Phone
                        </span>

                        <strong>
                            {employee.phone || "-"}
                        </strong>
                    </div>

                </div>

            </div>


            {/* Employment Information */}

            <div className="details-card">

                <div className="details-card-header">
                    <h2>Employment Information</h2>
                </div>

                <div className="details-grid">

                    <div className="detail-item">
                        <span className="detail-label">
                            Department
                        </span>

                        <strong>
                            {employee.department || employee.department_name || "-"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Designation
                        </span>

                        <strong>
                            {employee.designation || employee.designation_name || "-"}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Salary
                        </span>

                        <strong>
                            {formatSalary(employee.salary)}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Joining Date
                        </span>

                        <strong>
                            {formatDate(employee.joining_date)}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Status
                        </span>

                        <strong>
                            {employee.status || "-"}
                        </strong>
                    </div>

                </div>

            </div>


            {/* Created / Updated */}

            <div className="details-card">

                <div className="details-card-header">
                    <h2>Record Information</h2>
                </div>

                <div className="details-grid">

                    <div className="detail-item">
                        <span className="detail-label">
                            Created At
                        </span>

                        <strong>
                            {formatDate(employee.created_at)}
                        </strong>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Last Updated
                        </span>

                        <strong>
                            {formatDate(employee.updated_at)}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default EmployeeDetails;