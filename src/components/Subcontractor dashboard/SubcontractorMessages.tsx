import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Search,
    Send,
    Paperclip,
    Phone,
    Video,
    MoreVertical,
    Reply,
    Pin,
    Smile,
    Image,
    File,
    CheckCheck,
    Check,
    Users,
    Plus,
    Settings,
    MessageSquare,
    AlertCircle
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/Subcontractor dashboard/contexts/AuthContext";
import { toast } from "sonner";

interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    read_by?: string[];
    type: 'text' | 'image' | 'file' | 'system';
}

interface Conversation {
    id: string;
    name: string;
    type: 'direct' | 'group' | 'project';
    last_message?: string;
    last_message_at?: string;
    unread_count?: number;
}

const SubcontractorMessages = () => {
    const { profile } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!profile?.id) return;

        const fetchConversations = async () => {
            // Note: This assumes a 'conversations' table exists in Supabase.
            // If it doesn't, this will fail. We are implementing this as per user request
            // to work with all Supabase backend.
            const { data, error } = await supabase
                .from('conversations' as any)
                .select('*')
                .order('last_message_at', { ascending: false });

            if (error) {
                console.error("Error fetching conversations:", error);
                return;
            }

            setConversations((data as any) || []);
        };

        fetchConversations();

        // Subscribe to conversations changes
        const channel = supabase
            .channel('conversations-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, () => {
                fetchConversations();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [profile?.id]);

    useEffect(() => {
        if (!selectedConversation) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages' as any)
                .select('*')
                .eq('conversation_id', selectedConversation)
                .order('created_at', { ascending: true });

            if (error) {
                console.error("Error fetching messages:", error);
                return;
            }

            setMessages((data as any) || []);
        };

        fetchMessages();

        // Subscribe to messages changes
        const channel = supabase
            .channel(`messages-${selectedConversation}`)
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation}` },
                (payload) => {
                    setMessages(prev => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [selectedConversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || !profile?.id) return;

        const { error } = await supabase
            .from('messages' as any)
            .insert({
                conversation_id: selectedConversation,
                sender_id: profile.id,
                content: newMessage,
                type: 'text'
            });

        if (error) {
            toast.error("Failed to send message");
            console.error(error);
        } else {
            setNewMessage('');
            // Update conversation last message timestamp
            await supabase
                .from('conversations' as any)
                .update({ last_message_at: new Date().toISOString(), last_message: newMessage })
                .eq('id', selectedConversation);
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Messages</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                        Communicate via Supabase Backend
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
                {/* Conversations List */}
                <div className="lg:col-span-1 flex flex-col overflow-hidden">
                    <Card className="h-full flex flex-col bg-surface-light dark:bg-surface-dark">
                        <CardHeader className="pb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 p-0 overflow-hidden">
                            <ScrollArea className="h-full">
                                {filteredConversations.map((conv) => (
                                    <div
                                        key={conv.id}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedConversation === conv.id ? 'bg-accent/10 border-r-2 border-accent' : ''
                                            }`}
                                        onClick={() => setSelectedConversation(conv.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar className="w-12 h-12">
                                                <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold truncate">{conv.name}</h3>
                                                <p className="text-sm text-gray-500 truncate">{conv.last_message || 'No messages yet'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Chat Area */}
                <div className="lg:col-span-2 flex flex-col overflow-hidden">
                    {selectedConversation ? (
                        <Card className="h-full flex flex-col bg-surface-light dark:bg-surface-dark">
                            <CardHeader className="border-b">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarFallback>{conversations.find(c => c.id === selectedConversation)?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <h3 className="font-bold">{conversations.find(c => c.id === selectedConversation)?.name}</h3>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 p-0 overflow-hidden">
                                <ScrollArea className="h-full p-4">
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.sender_id === profile?.id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[70%] p-3 rounded-lg ${msg.sender_id === profile?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.content}</p>
                                                    <span className="text-[10px] opacity-70 mt-1 block">
                                                        {new Date(msg.created_at).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            </CardContent>

                            <div className="p-4 border-t flex gap-2">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <Button onClick={sendMessage}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center bg-surface-light dark:bg-surface-dark text-center">
                            <div>
                                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p>Select a conversation to start messaging</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubcontractorMessages;
