import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";


function Employees() {

    const [employees, setEmployees] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [deletingId, setDeletingId] =
        useState(null);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const fetchEmployees = async () => {

            try {

                const response =
                    await api.get("/employees");

                setEmployees(response.data.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchEmployees();

    }, []);

    const handleDelete = async (employee) => {
        const fullName = `${employee.first_name || ""} ${employee.last_name || ""}`.trim();

        if (!window.confirm(`Delete ${fullName || employee.employee_code}? This cannot be undone.`)) {
            return;
        }

        setDeletingId(employee.id);
        setError("");

        try {
            await api.delete(`/employees/${employee.id}`);
            setEmployees((currentEmployees) =>
                currentEmployees.filter((current) => current.id !== employee.id)
            );
        } catch (deleteError) {
            console.error(deleteError);
            setError(
                deleteError.response?.data?.message ||
                "Failed to delete employee. Please try again."
            );
        } finally {
            setDeletingId(null);
        }
    };


    if (loading) {

        return (
            <main className="page-container">
                <div className="page-loading">Loading employees...</div>
            </main>
        );

    }


    return (

        <main className="page-container employees-page">
            <header className="page-header">
                <div>
                    <span className="page-eyebrow">PEOPLE DIRECTORY</span>
                    <h1>Employees</h1>
                    <p>Browse and manage employee records.</p>
                </div>
                <Link to="/employees/add" className="primary-btn">
                    Add Employee
                </Link>
            </header>

            {error && <div className="error-message" role="alert">{error}</div>}

            <div className="employee-table-shell">
                <div className="employee-list-wrap">
                    <table className="employee-list-table">

                <thead>

                    <tr>

                        <th>Code</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Status</th>
                        <th>Actions</th>

                    </tr>

                </thead>


                <tbody>

                    {employees.length === 0 ? (
                        <tr>
                            <td className="employee-empty" colSpan="7">No employees found.</td>
                        </tr>
                    ) : employees.map(employee => (

                        <tr key={employee.id}>

                            <td>
                                {employee.employee_code}
                            </td>

                            <td>
                                {employee.first_name}
                                {" "}
                                {employee.last_name}
                            </td>

                            <td>
                                {employee.email}
                            </td>

                            <td>
                                {employee.department_name}
                            </td>

                            <td>
                                {employee.designation_name}
                            </td>

                            <td>
                                <span className={`employee-status ${String(employee.status || "").toLowerCase() === "active" ? "active" : String(employee.status || "").toLowerCase() === "on leave" ? "leave" : "inactive"}`}>
                                    {employee.status || "Unknown"}
                                </span>
                            </td>

                            <td>
                                <div className="employee-actions">
                                    <Link
                                        to={`/employees/${employee.id}/edit`}
                                        className="row-action-link"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        type="button"
                                        className="row-action-danger"
                                        onClick={() => handleDelete(employee)}
                                        disabled={deletingId === employee.id}
                                    >
                                        {deletingId === employee.id ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            </td>

                        </tr>

                    ))}

                </tbody>

                    </table>
                </div>
            </div>
        </main>

    );

}

export default Employees;