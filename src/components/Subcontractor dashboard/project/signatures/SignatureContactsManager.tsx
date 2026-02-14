import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import { Label } from "@/components/Subcontractor dashboard/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Subcontractor dashboard/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/Subcontractor dashboard/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Subcontractor dashboard/ui/select";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
  Building2,
  Mail,
} from "lucide-react";
import {
  useSignatureContacts,
  useCreateSignatureContact,
  useUpdateSignatureContact,
  useDeleteSignatureContact,
  SignatureContact,
} from "@/hooks/Subcontractor dashboard/useSignatureContacts";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";

interface SignatureContactsManagerProps {
  projectId: string;
}

const roleLabels: Record<string, string> = {
  contractor: "Contractor",
  architect: "Architect",
  owner: "Owner",
};

const roleBadgeColors: Record<string, string> = {
  contractor: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  architect: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  owner: "bg-amber-500/10 text-amber-600 border-amber-500/30",
};

export default function SignatureContactsManager({ projectId }: SignatureContactsManagerProps) {
  const { data: contacts = [], isLoading } = useSignatureContacts(projectId);
  const createContact = useCreateSignatureContact();
  const updateContact = useUpdateSignatureContact();
  const deleteContact = useDeleteSignatureContact();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<SignatureContact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<SignatureContact | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState<string>("");

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchQuery === "" ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesSearch;
  });

  const openCreateDialog = () => {
    setEditingContact(null);
    setFormName("");
    setFormEmail("");
    setFormCompany("");
    setFormRole("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: SignatureContact) => {
    setEditingContact(contact);
    setFormName(contact.name);
    setFormEmail(contact.email);
    setFormCompany(contact.company || "");
    setFormRole(contact.default_role || "");
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (contact: SignatureContact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingContact) {
      await updateContact.mutateAsync({
        id: editingContact.id,
        projectId,
        name: formName,
        email: formEmail,
        company: formCompany || null,
        defaultRole: (formRole as "contractor" | "architect" | "owner") || null,
      });
    } else {
      await createContact.mutateAsync({
        projectId,
        name: formName,
        email: formEmail,
        company: formCompany || undefined,
        defaultRole: (formRole as "contractor" | "architect" | "owner") || undefined,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (!contactToDelete) return;

    await deleteContact.mutateAsync({
      id: contactToDelete.id,
      projectId,
    });

    setIsDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Signature Contacts
              </CardTitle>
              <CardDescription>
                Manage frequently used contacts for signature requests
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Contacts Table */}
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No contacts yet</p>
              <p className="text-sm">Add contacts to quickly select them when requesting signatures.</p>
              <Button onClick={openCreateDialog} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Add First Contact
              </Button>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No contacts found matching "{searchQuery}"
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Default Role</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {contact.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contact.company ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          {contact.company}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.default_role ? (
                        <Badge
                          variant="outline"
                          className={roleBadgeColors[contact.default_role] || ""}
                        >
                          {roleLabels[contact.default_role] || contact.default_role}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(contact)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(contact)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Edit Contact" : "Add Contact"}
            </DialogTitle>
            <DialogDescription>
              {editingContact
                ? "Update the contact information below."
                : "Add a new contact for quick selection when requesting signatures."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="ABC Construction"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Default Signature Role</Label>
              <Select value={formRole} onValueChange={setFormRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="architect">Architect</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createContact.isPending || updateContact.isPending}
              >
                {(createContact.isPending || updateContact.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingContact ? "Save Changes" : "Add Contact"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{contactToDelete?.name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteContact.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
