import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditEmployee() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        employee_code: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        department_id: "",
        designation_id: "",
        salary: "",
        joining_date: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        status: "Active",
    });

    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true);

                const [employeeResponse, departmentResponse, designationResponse] =
                    await Promise.all([
                        api.get(`/employees/${id}`),
                        api.get("/departments"),
                        api.get("/designations"),
                    ]);

                const data =
                    employeeResponse.data.employee ||
                    employeeResponse.data.data ||
                    employeeResponse.data;

                setEmployee({
                    employee_code: data.employee_code || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    gender: data.gender || "",
                    date_of_birth: data.date_of_birth
                        ? data.date_of_birth.split("T")[0]
                        : "",
                    department_id: data.department_id || "",
                    designation_id: data.designation_id || "",
                    salary: data.salary || "",
                    joining_date: data.joining_date
                        ? data.joining_date.split("T")[0]
                        : "",
                    address: data.address || "",
                    city: data.city || "",
                    state: data.state || "",
                    pincode: data.pincode || "",
                    status: String(data.status || "active").toLowerCase(),
                });
                setDepartments(departmentResponse.data.data || []);
                setDesignations(designationResponse.data.data || []);

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            await api.put(`/employees/${id}`, employee);

            alert("Employee updated successfully!");

            navigate(`/employees/${id}`);

        } catch (err) {
            console.error("Update employee error:", err);

            setError(
                err.response?.data?.message ||
                "Failed to update employee"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-loading">Loading employee...</div>
            </div>
        );
    }

    if (error && !employee.first_name) {
        return (
            <div className="page-container">
                <div className="error-message">
                    {error}
                </div>

                <button className="secondary-btn" onClick={() => navigate("/employees")}>
                    Back to Employees
                </button>
            </div>
        );
    }

    return (
        <main className="page-container">

            <div className="page-header">
                <div>
                    <h1>Edit Employee</h1>
                    <p>Update employee profile, employment and contact details.</p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form
                className="employee-form"
                onSubmit={handleSubmit}
            >

                <div className="form-section">
                    <h2>Personal Information</h2>

                    <div className="form-grid">

                        <div className="form-group">
                            <label htmlFor="employee_code">Employee Code *</label>
                            <input
                                id="employee_code"
                                type="text"
                                name="employee_code"
                                value={employee.employee_code}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="first_name">First Name *</label>

                            <input
                                id="first_name"
                                type="text"
                                name="first_name"
                                value={employee.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name *</label>

                            <input
                                id="last_name"
                                type="text"
                                name="last_name"
                                value={employee.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={employee.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={employee.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={employee.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input
                                id="date_of_birth"
                                type="date"
                                name="date_of_birth"
                                value={employee.date_of_birth}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </div>


                <div className="form-section">
                    <h2>Employment Information</h2>

                    <div className="form-grid">

                        <div className="form-group">
                            <label htmlFor="department_id">Department *</label>
                            <select
                                id="department_id"
                                name="department_id"
                                value={employee.department_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select department</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="designation_id">Designation *</label>
                            <select
                                id="designation_id"
                                name="designation_id"
                                value={employee.designation_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select designation</option>
                                {designations.map((designation) => (
                                    <option key={designation.id} value={designation.id}>
                                        {designation.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="salary">Salary</label>

                            <input
                                id="salary"
                                type="number"
                                name="salary"
                                value={employee.salary}
                                onChange={handleChange}
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="joining_date">Joining Date *</label>

                            <input
                                id="joining_date"
                                type="date"
                                name="joining_date"
                                value={employee.joining_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>

                            <select
                                id="status"
                                name="status"
                                value={employee.status}
                                onChange={handleChange}
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>

                                <option value="on leave">
                                    On Leave
                                </option>
                            </select>
                        </div>

                    </div>
                </div>

                <div className="form-section">
                    <h2>Address</h2>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="address">Street Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={employee.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input id="city" type="text" name="city" value={employee.city} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input id="state" type="text" name="state" value={employee.state} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="pincode">Pincode</label>
                            <input id="pincode" type="text" name="pincode" value={employee.pincode} onChange={handleChange} />
                        </div>
                    </div>
                </div>


                <div className="form-actions">

                    <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={saving}
                    >
                        {saving
                            ? "Updating..."
                            : "Update Employee"}
                    </button>

                </div>

            </form>

        </main>
    );
}

export default EditEmployee;