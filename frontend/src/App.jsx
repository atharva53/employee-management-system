import {
    BrowserRouter,
    Link,
    NavLink,
    Routes,
    Route,
    useLocation
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import EmployeeDetails from "./pages/EmployeeDetails";



function AppShell() {
    const { pathname } = useLocation();
    const isEmployeeSection =
        pathname.startsWith("/employees") && pathname !== "/employees/add";

    return (
        <div className="app-shell">
            <header className="app-shell-header">
                <div className="app-shell-inner">
                    <Link to="/" className="app-brand" aria-label="PeopleOps dashboard">
                        <span className="app-brand-mark">EM</span>
                        <span className="app-brand-copy">
                            <strong>PeopleOps</strong>
                            <small>EMPLOYEE MANAGEMENT</small>
                        </span>
                    </Link>

                    <nav className="app-primary-nav" aria-label="Primary navigation">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `app-nav-link${isActive ? " active" : ""}`
                            }
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/employees"
                            className={({ isActive }) =>
                                `app-nav-link${isActive && isEmployeeSection ? " active" : ""}`
                            }
                        >
                            Employees
                        </NavLink>
                        <NavLink
                            to="/employees/add"
                            end
                            className={({ isActive }) =>
                                `app-nav-link${isActive ? " active" : ""}`
                            }
                        >
                            Add Employee
                        </NavLink>
                    </nav>

                    <div className="app-shell-status">
                        <span></span>
                        Workspace
                    </div>
                </div>
            </header>

            <div className="app-shell-content">
                <Routes>

                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/employees"
                    element={<Employees />}
                />

                <Route
                    path="/employees/add"
                    element={<AddEmployee />}
                />

                <Route
                    path="/employees/:id/edit"
                    element={<EditEmployee />}
                />

                <Route
                    path="/employees/:id"
                    element={<EmployeeDetails />}
                />

                </Routes>
            </div>
        </div>
    );

}

function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    );
}

export default App;