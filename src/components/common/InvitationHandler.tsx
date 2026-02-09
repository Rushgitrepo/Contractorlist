import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { getMyPendingInvitations, acceptInvitationAction, declineInvitationAction, verifyInvitation } from '@/api/gc-apis';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLocation, useNavigate } from 'react-router-dom';

const InvitationHandler = () => {
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state: RootState) => state.auth);

    const [invitations, setInvitations] = useState<any[]>([]);
    const [currentInvite, setCurrentInvite] = useState<any | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [urlToken, setUrlToken] = useState<string | null>(null);

    // 1. Handle token from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            setUrlToken(token);
            // If logged in, prioritize this token
            if (user) {
                handleSpecificToken(token);
            } else {
                // If not logged in, we could show a welcome message, but the modal
                // requires auth to accept. So we just keep the token.
                // Optionally verify it to show project context on signup page.
            }
        }
    }, [location.search, user]);

    // 2. Fetch pending invitations for logged in user
    useEffect(() => {
        if (user && !urlToken) {
            checkInvitations();
        }
    }, [user, urlToken]);

    const handleSpecificToken = async (token: string) => {
        try {
            setIsProcessing(true);
            const invitation = await verifyInvitation(token);
            if (invitation) {
                setInvitations([invitation]);
                setCurrentInvite({ ...invitation, token });
                setIsOpen(true);
            }
        } catch (error) {
            console.error("Failed to verify specific token", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const checkInvitations = async () => {
        try {
            const data = await getMyPendingInvitations();
            if (data && data.length > 0) {
                setInvitations(data);
                setCurrentInvite(data[0]);
                setIsOpen(true);
            }
        } catch (error) {
            console.error("Failed to check invitations", error);
        }
    };

    const handleAccept = async () => {
        if (!currentInvite) return;
        try {
            setIsProcessing(true);
            await acceptInvitationAction(currentInvite.token);
            toast({
                title: "Invitation Accepted",
                description: `You have successfully joined the project "${currentInvite.project_name}".`,
            });

            // Clean up URL if token was used
            if (urlToken) {
                const params = new URLSearchParams(location.search);
                params.delete('token');
                const newSearch = params.toString();
                navigate({
                    search: newSearch ? `?${newSearch}` : ''
                }, { replace: true });
                setUrlToken(null);
            }

            // Remove from list and show next if any
            const remaining = invitations.filter(i => (i.id && i.id !== currentInvite.id) || (i.token && i.token !== currentInvite.token));
            setInvitations(remaining);
            if (remaining.length > 0) {
                setCurrentInvite(remaining[0]);
            } else {
                setIsOpen(false);
                setCurrentInvite(null);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to accept invitation. Make sure you are logged in with the invited email.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDecline = async () => {
        if (!currentInvite) return;
        try {
            setIsProcessing(true);
            await declineInvitationAction(currentInvite.token);
            toast({
                title: "Invitation Declined",
                description: `You have declined the invitation to join "${currentInvite.project_name}".`,
            });

            // Clean up URL if token was used
            if (urlToken) {
                const params = new URLSearchParams(location.search);
                params.delete('token');
                navigate({ search: params.toString() }, { replace: true });
                setUrlToken(null);
            }

            const remaining = invitations.filter(i => (i.id && i.id !== currentInvite.id) || (i.token && i.token !== currentInvite.token));
            setInvitations(remaining);
            if (remaining.length > 0) {
                setCurrentInvite(remaining[0]);
            } else {
                setIsOpen(false);
                setCurrentInvite(null);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to decline invitation.",
                variant: "destructive"
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (!currentInvite) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open && !isProcessing) {
                setIsOpen(false);
                setCurrentInvite(null);
                setUrlToken(null);
            }
        }}>
            <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center mb-2">
                        <Mail className="w-6 h-6 text-yellow-500" />
                    </div>
                    <DialogTitle className="text-center text-xl">Project Invitation</DialogTitle>
                    <DialogDescription className="text-center text-gray-500 dark:text-gray-400">
                        <strong>{currentInvite.gc_name}</strong> has invited you to join the project <strong>"{currentInvite.project_name}"</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/5 my-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                            <span>Role</span>
                            <span className="text-gray-900 dark:text-white">{currentInvite.role || 'Team Member'}</span>
                        </div>
                        {currentInvite.project_id && (
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                                <span>Project ID</span>
                                <span className="text-gray-900 dark:text-white">#{currentInvite.project_id}</span>
                            </div>
                        )}
                        {currentInvite.email && !user && (
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                                <span>Invited Email</span>
                                <span className="text-gray-900 dark:text-white">{currentInvite.email}</span>
                            </div>
                        )}
                    </div>
                </div>

                {!user && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-400 text-center">
                        Please <strong>Log In</strong> or <strong>Sign Up</strong> to accept this invitation.
                    </div>
                )}

                <DialogFooter className="grid grid-cols-2 gap-3 sm:justify-center pt-2">
                    <Button
                        variant="outline"
                        onClick={handleDecline}
                        disabled={isProcessing || !user}
                        className="border-gray-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 font-bold h-11 rounded-xl"
                    >
                        <XCircle className="w-4 h-4 mr-2" /> Decline
                    </Button>
                    <Button
                        onClick={handleAccept}
                        disabled={isProcessing || !user}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold h-11 rounded-xl shadow-lg shadow-yellow-500/10"
                    >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Accept
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InvitationHandler;
