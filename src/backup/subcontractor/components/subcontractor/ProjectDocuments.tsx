/**
 * SC ProjectDocuments Component
 * Document management for Subcontractor projects
 */

import React, { useState, useEffect } from 'react';
import * as scApi from '@/api/sc-apis/backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
    FileText,
    Upload,
    Download,
    Search,
    Trash2,
    File,
    Filter,
    MoreVertical,
    Plus,
    Eye,
    X
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProjectDocumentsProps {
    projectId: number;
}

type DocumentCategory = 'Plans' | 'Drawings' | 'Photos' | 'Contracts' | 'Invoices' | 'Other';

interface Document {
    id: number;
    name: string;
    file_size: number;
    file_type: string;
    category: string;
    created_at: string;
    uploaded_by_name?: string;
}

const CATEGORIES: DocumentCategory[] = ['Plans', 'Drawings', 'Photos', 'Contracts', 'Invoices', 'Other'];

const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ projectId }) => {
    const { toast } = useToast();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('Other');
    const [viewingDoc, setViewingDoc] = useState<{ url: string; name: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

    // Load documents
    const loadDocuments = async () => {
        try {
            setLoading(true);
            const docs = await scApi.getProjectDocuments(projectId);
            setDocuments(docs as unknown as Document[]);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to load documents',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, [projectId]);

    // Handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            await scApi.uploadDocument(projectId, file, selectedCategory);
            toast({
                title: 'Success',
                description: 'Document uploaded successfully',
            });
            loadDocuments();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to upload document',
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    // Handle document delete
    const handleDelete = async () => {
        if (!deleteConfirm) return;

        try {
            await scApi.deleteDocument(projectId, deleteConfirm.id);
            toast({
                title: 'Deleted',
                description: 'Document deleted successfully',
            });
            loadDocuments();
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete document',
                variant: 'destructive',
            });
        } finally {
            setDeleteConfirm(null);
        }
    };

    // Handle document download
    const handleDownload = async (doc: Document) => {
        try {
            const blob = await scApi.downloadDocument(projectId, doc.id);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to download document',
                variant: 'destructive',
            });
        }
    };

    // Handle document view
    const handleView = async (doc: Document) => {
        try {
            const url = await scApi.viewDocument(projectId, doc.id);
            setViewingDoc({ url, name: doc.name });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to view document',
                variant: 'destructive',
            });
        }
    };

    // Close viewer
    const handleCloseView = () => {
        if (viewingDoc) {
            URL.revokeObjectURL(viewingDoc.url);
        }
        setViewingDoc(null);
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get file icon
    const getFileIcon = (fileType: string) => {
        switch (fileType?.toLowerCase()) {
            case 'pdf':
                return <FileText className="w-5 h-5 text-red-500" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <File className="w-5 h-5 text-blue-500" />;
            case 'doc':
            case 'docx':
                return <FileText className="w-5 h-5 text-blue-600" />;
            case 'xls':
            case 'xlsx':
                return <FileText className="w-5 h-5 text-green-500" />;
            default:
                return <File className="w-5 h-5 text-gray-500" />;
        }
    };

    // Filter documents
    const filteredDocuments = documents.filter((doc) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <Card className="bg-white dark:bg-[#1c1e24] border-none shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-white/5 pb-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent" />
                        Documents
                        <Badge variant="secondary" className="ml-2">
                            {documents.length}
                        </Badge>
                    </CardTitle>

                    <div className="flex items-center gap-2">
                        {/* Category selector for upload */}
                        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as DocumentCategory)}>
                            <SelectTrigger className="w-32 h-9">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Upload button */}
                        <label className="cursor-pointer">
                            <Button
                                variant="default"
                                size="sm"
                                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                                disabled={uploading}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                {uploading ? 'Uploading...' : 'Upload'}
                            </Button>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                </div>

                {/* Search and filter row */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search documents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-full sm:w-40 h-9">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {searchTerm || filterCategory !== 'all'
                                ? 'No documents match your search'
                                : 'No documents uploaded yet'}
                        </p>
                        {!searchTerm && filterCategory === 'all' && (
                            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                Upload documents using the button above
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    {getFileIcon(doc.file_type)}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {doc.name}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <span>{formatFileSize(doc.file_size)}</span>
                                            <span>•</span>
                                            <Badge variant="outline" className="text-[10px] py-0">
                                                {doc.category}
                                            </Badge>
                                            <span>•</span>
                                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleView(doc)}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDownload(doc)}>
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setDeleteConfirm({ id: doc.id, name: doc.name })}
                                            className="text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Document Viewer Dialog */}
            <Dialog open={!!viewingDoc} onOpenChange={() => handleCloseView()}>
                <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span className="truncate">{viewingDoc?.name}</span>
                        </DialogTitle>
                    </DialogHeader>
                    {viewingDoc && (
                        <div className="flex-1 overflow-auto">
                            <iframe
                                src={viewingDoc.url}
                                className="w-full h-[70vh] border-0 rounded-lg"
                                title={viewingDoc.name}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deleteConfirm?.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

export default ProjectDocuments;
