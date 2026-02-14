import { Construction, ArrowLeft, FileText, Users, Calendar, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Resource Leveling": Calendar,
  "AIA Progress Billing": FileText,
  "Change Order Management": FileText,
  "Daily Field Logs": FileText,
  "RFIs & Submittals": FileText,
  "Plan-Pinned Photos": FileText,
  "Lien Waiver Management": FileText,
  "OSHA / Safety Tracking": FileText,
  "Insurance & COI Tracking": FileText,
  "Certified Payroll (Davis-Bacon)": FileText,
  "Subcontractor Portal": Users,
  "Owner / Client Portal": Users,
};

export default function PlaceholderPage({ title }: { title: string }) {
  const Icon = moduleIcons[title] || Construction;
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
        This module is coming soon. It will provide full functionality for managing {title.toLowerCase()} within your construction projects.
      </p>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Settings className="w-4 h-4" /> Request Access
        </button>
      </div>
    </div>
  );
}
