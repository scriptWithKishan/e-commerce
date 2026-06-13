import DashboardSidebar from "./sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex-1 flex">
            <DashboardSidebar />
            {children}
        </div>
    )
}