import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import { 
  Send, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Bell, 
  Eye, 
  RefreshCw,
  FileText,
  Loader2,
  User,
  Mail,
  Calendar
} from "lucide-react";
import { useSignatureAuditLog, AuditActionType } from "@/hooks/Subcontractor dashboard/useSignatureAuditLog";
import { format, formatDistanceToNow } from "date-fns";

interface SignatureAuditLogProps {
  projectId: string;
}

const ACTION_CONFIG: Record<AuditActionType, { 
  icon: React.ElementType; 
  label: string; 
  color: string;
  bgColor: string;
}> = {
  request_created: { 
    icon: Send, 
    label: "Request Created", 
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  request_cancelled: { 
    icon: XCircle, 
    label: "Request Cancelled", 
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  },
  reminder_sent: { 
    icon: Bell, 
    label: "Reminder Sent", 
    color: "text-warning",
    bgColor: "bg-warning/10"
  },
  signature_completed: { 
    icon: CheckCircle2, 
    label: "Signature Completed", 
    color: "text-success",
    bgColor: "bg-success/10"
  },
  signature_rejected: { 
    icon: XCircle, 
    label: "Signature Rejected", 
    color: "text-destructive",
    bgColor: "bg-destructive/10"
  },
  request_expired: { 
    icon: Clock, 
    label: "Request Expired", 
    color: "text-muted-foreground",
    bgColor: "bg-muted"
  },
  document_viewed: { 
    icon: Eye, 
    label: "Document Viewed", 
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  request_resent: { 
    icon: RefreshCw, 
    label: "Request Resent", 
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
};

export default function SignatureAuditLog({ projectId }: SignatureAuditLogProps) {
  const { data: logs, isLoading } = useSignatureAuditLog(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No audit events yet</p>
            <p className="text-sm">Signature-related actions will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group logs by date
  const groupedLogs = logs.reduce((groups, log) => {
    const date = format(new Date(log.created_at), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, typeof logs>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Signature Audit Log
        </CardTitle>
        <CardDescription>
          Complete history of signature-related actions and events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedLogs).map(([date, dateLogs]) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {format(new Date(date), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="space-y-3 ml-2 border-l-2 border-muted pl-4">
                  {dateLogs.map((log) => {
                    const config = ACTION_CONFIG[log.action_type as AuditActionType] || {
                      icon: FileText,
                      label: log.action_type,
                      color: "text-muted-foreground",
                      bgColor: "bg-muted"
                    };
                    const Icon = config.icon;

                    return (
                      <div 
                        key={log.id} 
                        className="relative flex gap-4 pb-4"
                      >
                        {/* Timeline dot */}
                        <div className={`absolute -left-[25px] w-4 h-4 rounded-full ${config.bgColor} flex items-center justify-center`}>
                          <div className={`w-2 h-2 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
                                <Icon className={`w-4 h-4 ${config.color}`} />
                              </div>
                              <div>
                                <Badge variant="outline" className="text-xs">
                                  {config.label}
                                </Badge>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {format(new Date(log.created_at), "h:mm a")}
                            </span>
                          </div>

                          <p className="mt-2 text-sm">{log.description}</p>

                          {/* Actor info */}
                          {(log.actor_name || log.actor_email) && (
                            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                              {log.actor_name && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {log.actor_name}
                                </span>
                              )}
                              {log.actor_email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {log.actor_email}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Metadata */}
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div className="mt-2 p-2 rounded-md bg-muted/50 text-xs">
                              {log.metadata.document_title && (
                                <span className="text-muted-foreground">
                                  Document: {String(log.metadata.document_title)}
                                </span>
                              )}
                              {log.metadata.recipient_email && (
                                <span className="text-muted-foreground block">
                                  Recipient: {String(log.metadata.recipient_email)}
                                </span>
                              )}
                            </div>
                          )}

                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
