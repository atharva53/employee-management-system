import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


function AddEmployee() {

    const navigate = useNavigate();


    const [departments, setDepartments] =
        useState([]);

    const [designations, setDesignations] =
        useState([]);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        department_id: "",
        designation_id: "",
        joining_date: "",
        salary: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [employeeCode, setEmployeeCode] = useState("");


    useEffect(() => {

    const loadDropdowns = async () => {

        try {

            const [departmentResponse, designationResponse, codeResponse] =
                await Promise.all([
                    api.get("/departments"),
                    api.get("/designations"),
                    api.get("/employees/next-code")
                ]);


            setDepartments(
                departmentResponse.data.data
            );

            setDesignations(
                designationResponse.data.data
            );

            setEmployeeCode(codeResponse.data.data.employee_code);

        } catch (error) {

            console.error(error);

        }

    };


    loadDropdowns();

}, []);


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            const response = await api.post(
                "/employees",
                { ...formData, employee_code: employeeCode }
            );


            alert(
                `Employee created successfully. Code: ${response.data.employeeCode}`
            );


            navigate("/employees");


        } catch (error) {

            console.error(error);

            alert(
                "Failed to create employee"
            );

        }

    };


    return (

        <main className="page-container add-employee-page">
            <header className="page-header">
                <div>
                    <span className="page-eyebrow">EMPLOYEE MANAGEMENT</span>
                    <h1>Add Employee</h1>
                    <p>Create a new employee record.</p>
                </div>

                <button
                    type="button"
                    className="secondary-btn"
                    onClick={() => navigate("/employees")}
                >
                    Back to Employees
                </button>
            </header>

            <form className="employee-form" onSubmit={handleSubmit}>
                <section className="form-section">
                    <h2>Personal Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="employee_code">Employee Code</label>
                            <input id="employee_code" type="text" name="employee_code" value={employeeCode} placeholder="Generating..." readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="first_name">First Name *</label>
                            <input id="first_name" type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input id="last_name" type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input id="date_of_birth" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Employment Information</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="department_id">Department *</label>
                            <select id="department_id" name="department_id" value={formData.department_id} onChange={handleChange} required>
                                <option value="">Select department</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>{department.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="designation_id">Designation *</label>
                            <select id="designation_id" name="designation_id" value={formData.designation_id} onChange={handleChange} required>
                                <option value="">Select designation</option>
                                {designations.map((designation) => (
                                    <option key={designation.id} value={designation.id}>{designation.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="joining_date">Joining Date *</label>
                            <input id="joining_date" type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="salary">Salary</label>
                            <input id="salary" type="number" name="salary" min="0" placeholder="0" value={formData.salary} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Address</h2>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="address">Street Address</label>
                            <textarea id="address" name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city">City</label>
                            <input id="city" type="text" name="city" value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="state">State</label>
                            <input id="state" type="text" name="state" value={formData.state} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="pincode">Pincode</label>
                            <input id="pincode" type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
                        </div>
                    </div>
                </section>

                <div className="form-actions">
                    <button type="button" className="secondary-btn" onClick={() => navigate("/employees")}>
                        Cancel
                    </button>
                    <button type="submit" className="primary-btn">
                        Save Employee
                    </button>
                </div>
            </form>
        </main>

    );

}

export default AddEmployee;