import ProjectManagementSidebar from "./ProjectManagementSidebar";
import AppHeader from "./AppHeader";

export default function ProjectManagementLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background gc-dashboard-theme">
            <ProjectManagementSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-6 custom-scrollbar">
                    {children}
                </main>
            </div>
        </div>
    );
}
