import { useState } from "react";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import {
  useCertifiedPayrollReports,
  usePayrollEmployees,
  useCreatePayrollReport,
  useUpdatePayrollReport,
  useDeletePayrollReport,
  useCreatePayrollEmployee,
  useDeletePayrollEmployee,
  usePayrollSummary,
  PAYROLL_STATUS_LABELS,
  type CertifiedPayrollReport,
  type PayrollEmployee,
} from "@/hooks/Subcontractor dashboard/useCertifiedPayroll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import { Textarea } from "@/components/Subcontractor dashboard/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Subcontractor dashboard/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Subcontractor dashboard/ui/accordion";
import {
  Landmark,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Trash2,
  Users,
  UserPlus,
} from "lucide-react";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type PayrollStatus = Database["public"]["Enums"]["payroll_status"];

export default function CertifiedPayrollPage() {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const { data: reports, isLoading } = useCertifiedPayrollReports(selectedProjectId || undefined);
  const { data: summary } = usePayrollSummary(selectedProjectId || undefined);
  const { data: employees } = usePayrollEmployees(selectedReportId || "");
  const createReport = useCreatePayrollReport();
  const updateReport = useUpdatePayrollReport();
  const deleteReport = useDeletePayrollReport();
  const createEmployee = useCreatePayrollEmployee();
  const deleteEmployee = useDeletePayrollEmployee();

  const [reportForm, setReportForm] = useState({
    week_ending: "",
    contractor_name: "",
    contractor_address: "",
    project_name: "",
    project_location: "",
    notes: "",
  });

  const [employeeForm, setEmployeeForm] = useState({
    employee_name: "",
    employee_id: "",
    work_classification: "",
    prevailing_wage_rate: "",
    fringe_rate: "",
    hours_worked_day1: "",
    hours_worked_day2: "",
    hours_worked_day3: "",
    hours_worked_day4: "",
    hours_worked_day5: "",
    hours_worked_day6: "",
    hours_worked_day7: "",
    overtime_hours: "",
    gross_wages: "",
    deductions: "",
    net_wages: "",
  });

  const handleCreateReport = () => {
    if (!selectedProjectId) return;

    // Get next report number
    const nextNumber = (reports?.length || 0) + 1;

    createReport.mutate({
      project_id: selectedProjectId,
      report_number: nextNumber,
      week_ending: reportForm.week_ending,
      status: "draft",
      contractor_name: reportForm.contractor_name || null,
      contractor_address: reportForm.contractor_address || null,
      project_name: reportForm.project_name || null,
      project_location: reportForm.project_location || null,
      notes: reportForm.notes || null,
      subcontractor_id: null,
      submitted_by: null,
      submitted_at: null,
      approved_by: null,
      approved_at: null,
      certification_statement: null,
      signature_data: null,
      signer_name: null,
      signer_title: null,
      signed_at: null,
    });
    setIsReportDialogOpen(false);
    setReportForm({
      week_ending: "",
      contractor_name: "",
      contractor_address: "",
      project_name: "",
      project_location: "",
      notes: "",
    });
  };

  const handleAddEmployee = () => {
    if (!selectedReportId || !selectedProjectId) return;

    createEmployee.mutate({
      payroll_report_id: selectedReportId,
      project_id: selectedProjectId,
      employee_name: employeeForm.employee_name,
      employee_id: employeeForm.employee_id || null,
      work_classification: employeeForm.work_classification,
      prevailing_wage_rate: parseFloat(employeeForm.prevailing_wage_rate) || 0,
      fringe_rate: parseFloat(employeeForm.fringe_rate) || 0,
      hours_worked_day1: parseFloat(employeeForm.hours_worked_day1) || 0,
      hours_worked_day2: parseFloat(employeeForm.hours_worked_day2) || 0,
      hours_worked_day3: parseFloat(employeeForm.hours_worked_day3) || 0,
      hours_worked_day4: parseFloat(employeeForm.hours_worked_day4) || 0,
      hours_worked_day5: parseFloat(employeeForm.hours_worked_day5) || 0,
      hours_worked_day6: parseFloat(employeeForm.hours_worked_day6) || 0,
      hours_worked_day7: parseFloat(employeeForm.hours_worked_day7) || 0,
      overtime_hours: parseFloat(employeeForm.overtime_hours) || 0,
      gross_wages: parseFloat(employeeForm.gross_wages) || 0,
      deductions: parseFloat(employeeForm.deductions) || 0,
      net_wages: parseFloat(employeeForm.net_wages) || 0,
    });
    setIsEmployeeDialogOpen(false);
    setEmployeeForm({
      employee_name: "",
      employee_id: "",
      work_classification: "",
      prevailing_wage_rate: "",
      fringe_rate: "",
      hours_worked_day1: "",
      hours_worked_day2: "",
      hours_worked_day3: "",
      hours_worked_day4: "",
      hours_worked_day5: "",
      hours_worked_day6: "",
      hours_worked_day7: "",
      overtime_hours: "",
      gross_wages: "",
      deductions: "",
      net_wages: "",
    });
  };

  const handleSubmitReport = (report: CertifiedPayrollReport) => {
    updateReport.mutate({
      id: report.id,
      status: "submitted",
      submitted_at: new Date().toISOString(),
    });
  };

  const handleApproveReport = (report: CertifiedPayrollReport) => {
    updateReport.mutate({
      id: report.id,
      status: "approved",
      approved_at: new Date().toISOString(),
    });
  };

  const getStatusBadge = (status: PayrollStatus) => {
    const variants: Record<PayrollStatus, { icon: React.ReactNode; className: string }> = {
      draft: { icon: <Clock className="w-3 h-3 mr-1" />, className: "bg-muted text-muted-foreground" },
      submitted: { icon: <Send className="w-3 h-3 mr-1" />, className: "bg-blue-500" },
      approved: { icon: <CheckCircle className="w-3 h-3 mr-1" />, className: "bg-green-600" },
      rejected: { icon: <XCircle className="w-3 h-3 mr-1" />, className: "bg-destructive" },
    };
    const { icon, className } = variants[status];
    return <Badge className={className}>{icon}{PAYROLL_STATUS_LABELS[status]}</Badge>;
  };

  const filteredReports = reports?.filter((report) => {
    if (activeTab === "all") return true;
    return report.status === activeTab;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Certified Payroll</h1>
          <p className="text-muted-foreground">Davis-Bacon prevailing wage compliance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsReportDialogOpen(true)} disabled={!selectedProjectId}>
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Landmark className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.draft || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <Send className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{summary?.submitted || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.approved || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !selectedProjectId ? (
            <p className="text-muted-foreground">Select a project to view payroll reports</p>
          ) : filteredReports?.length === 0 ? (
            <p className="text-muted-foreground">No payroll reports found</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {filteredReports?.map((report) => (
                <AccordionItem key={report.id} value={report.id} className="border rounded-lg px-4">
                  <AccordionTrigger
                    className="hover:no-underline"
                    onClick={() => setSelectedReportId(report.id)}
                  >
                    <div className="flex items-center justify-between w-full mr-4">
                      <div className="flex items-center gap-4">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div className="text-left">
                          <p className="font-medium">Report #{report.report_number}</p>
                          <p className="text-sm text-muted-foreground">
                            Week ending: {format(new Date(report.week_ending), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Employees</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setIsEmployeeDialogOpen(true);
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Add Employee
                        </Button>
                      </div>

                      {employees && employees.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Classification</TableHead>
                              <TableHead>Rate</TableHead>
                              <TableHead>Hours</TableHead>
                              <TableHead>OT</TableHead>
                              <TableHead>Gross</TableHead>
                              <TableHead>Net</TableHead>
                              <TableHead></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {employees.map((emp) => (
                              <TableRow key={emp.id}>
                                <TableCell className="font-medium">{emp.employee_name}</TableCell>
                                <TableCell>{emp.work_classification}</TableCell>
                                <TableCell>${Number(emp.prevailing_wage_rate).toFixed(2)}/hr</TableCell>
                                <TableCell>{emp.total_hours}</TableCell>
                                <TableCell>{emp.overtime_hours || 0}</TableCell>
                                <TableCell>${Number(emp.gross_wages || 0).toLocaleString()}</TableCell>
                                <TableCell>${Number(emp.net_wages || 0).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteEmployee.mutate({ id: emp.id, reportId: report.id })}
                                  >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-sm text-muted-foreground">No employees added yet</p>
                      )}

                      <div className="flex justify-end gap-2 pt-4 border-t">
                        {report.status === "draft" && (
                          <Button onClick={() => handleSubmitReport(report)}>
                            <Send className="w-4 h-4 mr-1" />
                            Submit for Review
                          </Button>
                        )}
                        {report.status === "submitted" && (
                          <Button onClick={() => handleApproveReport(report)} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteReport.mutate(report.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* New Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Payroll Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Week Ending Date</Label>
              <Input
                type="date"
                value={reportForm.week_ending}
                onChange={(e) => setReportForm({ ...reportForm, week_ending: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Contractor Name</Label>
              <Input
                placeholder="Company Name"
                value={reportForm.contractor_name}
                onChange={(e) => setReportForm({ ...reportForm, contractor_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Contractor Address</Label>
              <Input
                placeholder="Address"
                value={reportForm.contractor_address}
                onChange={(e) => setReportForm({ ...reportForm, contractor_address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  placeholder="Project Name"
                  value={reportForm.project_name}
                  onChange={(e) => setReportForm({ ...reportForm, project_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Project Location</Label>
                <Input
                  placeholder="Location"
                  value={reportForm.project_location}
                  onChange={(e) => setReportForm({ ...reportForm, project_location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={reportForm.notes}
                onChange={(e) => setReportForm({ ...reportForm, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateReport} disabled={!reportForm.week_ending}>
              Create Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Employee to Payroll</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee Name</Label>
                <Input
                  placeholder="Full Name"
                  value={employeeForm.employee_name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, employee_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input
                  placeholder="ID #"
                  value={employeeForm.employee_id}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, employee_id: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Work Classification</Label>
                <Input
                  placeholder="e.g., Electrician"
                  value={employeeForm.work_classification}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, work_classification: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prevailing Wage Rate</Label>
                <Input
                  type="number"
                  placeholder="$/hr"
                  value={employeeForm.prevailing_wage_rate}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, prevailing_wage_rate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fringe Rate</Label>
                <Input
                  type="number"
                  placeholder="$/hr"
                  value={employeeForm.fringe_rate}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, fringe_rate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Daily Hours (Mon-Sun)</Label>
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={day} className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">{day}</p>
                    <Input
                      type="number"
                      className="text-center"
                      placeholder="0"
                      value={employeeForm[`hours_worked_day${i + 1}` as keyof typeof employeeForm]}
                      onChange={(e) =>
                        setEmployeeForm({ ...employeeForm, [`hours_worked_day${i + 1}`]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Overtime Hours</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={employeeForm.overtime_hours}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, overtime_hours: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Gross Wages</Label>
                <Input
                  type="number"
                  placeholder="$"
                  value={employeeForm.gross_wages}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, gross_wages: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Deductions</Label>
                <Input
                  type="number"
                  placeholder="$"
                  value={employeeForm.deductions}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, deductions: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Net Wages</Label>
                <Input
                  type="number"
                  placeholder="$"
                  value={employeeForm.net_wages}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, net_wages: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddEmployee}
              disabled={!employeeForm.employee_name || !employeeForm.work_classification}
            >
              Add Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
