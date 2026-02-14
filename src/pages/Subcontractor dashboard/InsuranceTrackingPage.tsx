import { useState } from "react";
import { useProjects } from "@/hooks/Subcontractor dashboard/useProjects";
import {
  useCertificatesOfInsurance,
  useCreateCOI,
  useUpdateCOI,
  useDeleteCOI,
  useInsuranceSummary,
  INSURANCE_TYPE_LABELS,
  COI_STATUS_LABELS,
  type CertificateOfInsurance,
} from "@/hooks/Subcontractor dashboard/useInsuranceTracking";
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
  Shield,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  FileCheck,
  Trash2,
  Edit,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type InsuranceType = Database["public"]["Enums"]["insurance_type"];
type COIStatus = Database["public"]["Enums"]["coi_status"];

export default function InsuranceTrackingPage() {
  const { data: projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCOI, setEditingCOI] = useState<CertificateOfInsurance | null>(null);

  const { data: certificates, isLoading } = useCertificatesOfInsurance(selectedProjectId || undefined);
  const { data: summary } = useInsuranceSummary(selectedProjectId || undefined);
  const createCOI = useCreateCOI();
  const updateCOI = useUpdateCOI();
  const deleteCOI = useDeleteCOI();

  const [formData, setFormData] = useState({
    insurance_type: "general_liability" as InsuranceType,
    carrier_name: "",
    policy_number: "",
    coverage_amount: "",
    effective_date: "",
    expiration_date: "",
    is_additional_insured: false,
    is_waiver_of_subrogation: false,
    notes: "",
  });

  const handleOpenDialog = (coi?: CertificateOfInsurance) => {
    if (coi) {
      setEditingCOI(coi);
      setFormData({
        insurance_type: coi.insurance_type,
        carrier_name: coi.carrier_name,
        policy_number: coi.policy_number || "",
        coverage_amount: String(coi.coverage_amount),
        effective_date: coi.effective_date,
        expiration_date: coi.expiration_date,
        is_additional_insured: coi.is_additional_insured || false,
        is_waiver_of_subrogation: coi.is_waiver_of_subrogation || false,
        notes: coi.notes || "",
      });
    } else {
      setEditingCOI(null);
      setFormData({
        insurance_type: "general_liability",
        carrier_name: "",
        policy_number: "",
        coverage_amount: "",
        effective_date: "",
        expiration_date: "",
        is_additional_insured: false,
        is_waiver_of_subrogation: false,
        notes: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedProjectId) return;

    const coiData = {
      project_id: selectedProjectId,
      insurance_type: formData.insurance_type,
      carrier_name: formData.carrier_name,
      policy_number: formData.policy_number || null,
      coverage_amount: parseFloat(formData.coverage_amount) || 0,
      effective_date: formData.effective_date,
      expiration_date: formData.expiration_date,
      status: "pending" as COIStatus,
      is_additional_insured: formData.is_additional_insured,
      is_waiver_of_subrogation: formData.is_waiver_of_subrogation,
      notes: formData.notes || null,
      subcontractor_id: null,
      document_path: null,
      document_name: null,
      verified_by: null,
      verified_at: null,
    };

    if (editingCOI) {
      updateCOI.mutate({ id: editingCOI.id, ...coiData });
    } else {
      createCOI.mutate(coiData);
    }
    setIsDialogOpen(false);
  };

  const handleVerify = (coi: CertificateOfInsurance) => {
    updateCOI.mutate({
      id: coi.id,
      status: "active",
      verified_at: new Date().toISOString(),
    });
  };

  const getStatusBadge = (coi: CertificateOfInsurance) => {
    const today = new Date();
    const expDate = new Date(coi.expiration_date);
    const daysUntilExpiry = differenceInDays(expDate, today);

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>;
    }
    if (daysUntilExpiry <= 30) {
      return <Badge className="bg-amber-500"><AlertTriangle className="w-3 h-3 mr-1" />Expiring Soon</Badge>;
    }
    if (coi.status === "active") {
      return <Badge className="bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    }
    return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
  };

  const filteredCertificates = certificates?.filter((coi) => {
    if (activeTab === "all") return true;
    const today = new Date();
    const expDate = new Date(coi.expiration_date);
    const daysUntilExpiry = differenceInDays(expDate, today);

    if (activeTab === "expiring") return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
    if (activeTab === "expired") return daysUntilExpiry < 0;
    if (activeTab === "active") return coi.status === "active" && daysUntilExpiry > 30;
    return true;
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insurance & COI Tracking</h1>
          <p className="text-muted-foreground">Manage certificates of insurance and coverage verification</p>
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
          <Button onClick={() => handleOpenDialog()} disabled={!selectedProjectId}>
            <Plus className="w-4 h-4 mr-2" />
            Add COI
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total COIs</CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.active || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{summary?.expiringSoon || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{summary?.expired || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All COIs</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !selectedProjectId ? (
            <p className="text-muted-foreground">Select a project to view certificates</p>
          ) : filteredCertificates?.length === 0 ? (
            <p className="text-muted-foreground">No certificates found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Policy #</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Effective</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertificates?.map((coi) => (
                  <TableRow key={coi.id}>
                    <TableCell className="font-medium">
                      {INSURANCE_TYPE_LABELS[coi.insurance_type]}
                    </TableCell>
                    <TableCell>{coi.carrier_name}</TableCell>
                    <TableCell>{coi.policy_number || "—"}</TableCell>
                    <TableCell>${Number(coi.coverage_amount).toLocaleString()}</TableCell>
                    <TableCell>{format(new Date(coi.effective_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{format(new Date(coi.expiration_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(coi)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {coi.status === "pending" && (
                          <Button size="sm" variant="outline" onClick={() => handleVerify(coi)}>
                            <FileCheck className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleOpenDialog(coi)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCOI.mutate(coi.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCOI ? "Edit" : "Add"} Certificate of Insurance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Insurance Type</Label>
                <Select
                  value={formData.insurance_type}
                  onValueChange={(v) => setFormData({ ...formData, insurance_type: v as InsuranceType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(INSURANCE_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Coverage Amount</Label>
                <Input
                  type="number"
                  placeholder="1000000"
                  value={formData.coverage_amount}
                  onChange={(e) => setFormData({ ...formData, coverage_amount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Carrier Name</Label>
              <Input
                placeholder="Insurance Carrier"
                value={formData.carrier_name}
                onChange={(e) => setFormData({ ...formData, carrier_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Policy Number</Label>
              <Input
                placeholder="Policy #"
                value={formData.policy_number}
                onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Effective Date</Label>
                <Input
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <Input
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_additional_insured}
                  onChange={(e) => setFormData({ ...formData, is_additional_insured: e.target.checked })}
                />
                <span className="text-sm">Additional Insured</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_waiver_of_subrogation}
                  onChange={(e) => setFormData({ ...formData, is_waiver_of_subrogation: e.target.checked })}
                />
                <span className="text-sm">Waiver of Subrogation</span>
              </label>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.carrier_name || !formData.effective_date || !formData.expiration_date}>
              {editingCOI ? "Update" : "Add"} COI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
