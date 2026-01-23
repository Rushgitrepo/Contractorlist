export const MOCK_ACCOUNTS = [
    {
        email: "homeowner@demo.com",
        password: "password123",
        role: "homeowner",
        name: "Demo Homeowner",
        redirectPath: "/homeowner-dashboard"
    },
    {
        email: "pro@demo.com",
        password: "password123",
        role: "contractor",
        name: "Demo General Contractor",
        redirectPath: "/gc-dashboard"
    },
    {
        email: "sub@demo.com",
        password: "password123",
        role: "contractor", // Subcontractors often share the contractor role but have different dashboard access in some apps. Based on previous file analysis, checking Login.tsx...
        // Login.tsx redirects 'contractor' to '/gc-dashboard'.
        // However, the dashboard is '/subcontractor-dashboard'.
        // Let's set a specific redirect for this mock user.
        name: "Demo Subcontractor",
        redirectPath: "/subcontractor-dashboard"
    },
    {
        email: "vendor@demo.com",
        password: "password123",
        role: "vendor",
        name: "Demo Supplier",
        redirectPath: "/supplier-dashboard"
    }
];
