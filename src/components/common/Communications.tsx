import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Plus,
  Send,
  MessageSquare,
  ArrowLeft,
  Users,
  Users2,
  FolderPlus,
  Paperclip,
  Trash2,
  X,
  FileIcon,
  Settings
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useSocket } from '@/context/SocketContext';
import { chatService } from '@/api/chatService';
import { useAppSelector } from '@/store/hooks';
import { getProjects, Project } from '@/api/gc-apis/backend';
import { uploadService } from '@/api/uploadService';

interface ChatUser {
  id: number;
  first_name: string;
  last_name: string;
  company_name?: string;
  email: string;
}

interface Chat {
  id: string; // UUID
  name: string;
  type: string;
  avatar: string;
  image?: string;
  status: 'online' | 'offline';
  lastMessage: string;
  time: string; // Display time
  timestamp: string; // ISO for sorting
  unread: number;
  project: string;
  relatedProjectId?: number;
  isGroup: boolean;
  participants: ChatUser[];
  phone?: string;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  senderName: string;
  companyName: string;
  content: string;
  time: string;
  date: string;
  status: 'sent' | 'read';
  attachment?: { name: string; size: string; type: string; url: string };
  isDeleted?: boolean;
  rawCreatedAt: string;
}

const Communications = () => {
  const { toast } = useToast();
  const { socket, isConnected } = useSocket();
  const currentUser = useAppSelector(state => state.auth.user);

  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [groupTitle, setGroupTitle] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<number[]>([]);
  const [projectIdInput, setProjectIdInput] = useState('');

  const [attachments, setAttachments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [participantSearch, setParticipantSearch] = useState('');
  const [contactSearch, setContactSearch] = useState('');

  const [chats, setChats] = useState<Chat[]>([]);
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  const [contacts, setContacts] = useState<any[]>([]); // For New Chat (Users)
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'all' | 'private' | 'groups' | 'projects'>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';
  };

  const fetchConversations = async () => {
    if (!currentUser) return;
    try {
      setIsLoadingChats(true);
      const res = await chatService.getConversations();
      if (res.success) {
        if (window && typeof window !== 'undefined') {
          (window as any).__conversations = res.data;
        }

        const mappedChats: Chat[] = res.data.map((c: any) => {
          let name = c.title;
          let avatar = 'GR';
          let image = '';
          let isGroup = c.type !== 'direct';
          let otherPart: ChatUser | undefined;

          const participants: ChatUser[] = c.participants || [];
          if (c.type === 'direct') {
            otherPart = participants.find(p => p.id !== currentUser.id);
            if (otherPart) {
              name = `${otherPart.first_name} ${otherPart.last_name}`;
              avatar = getInitials(name);
            }
          } else if (!name) {
            name = 'Group Chat';
          }

          const projectLink = c.related_gc_project_id ?? c.related_project_id;

          return {
            id: c.id,
            name,
            type: c.type === 'direct' ? (otherPart?.company_name || 'Direct') : 'Group',
            avatar,
            image,
            status: 'offline',
            lastMessage: c.last_message_content || 'No messages yet',
            time: formatTime(c.last_message_created_at || c.updated_at),
            timestamp: c.last_message_created_at || c.updated_at,
            unread: c.unread_count ?? 0,
            project: projectLink ? 'Project' : 'General',
            relatedProjectId: projectLink ? Number(projectLink) : undefined,
            isGroup,
            participants,
            phone: otherPart ? '' : ''
          };
        });
        setChats(mappedChats);
      }
    } catch (error) {
      console.error('Failed to load chats', error);
      toast({ title: 'Error', description: 'Failed to load conversations.', variant: 'destructive' });
    } finally {
      setIsLoadingChats(false);
    }
  };

  const fetchContacts = async () => {
    try {
      setIsLoadingContacts(true);
      // Fetch all registered users (limited to 50 on backend by default)
      const res = await chatService.searchUsers(contactSearch);
      if (res.data) {
        const platformUsers = res.data.map((u: any) => ({
          id: u.id,
          user_id: u.id,
          name: `${u.first_name} ${u.last_name}`,
          email: u.email,
          professional_category: 'Platform User'
        }));
        setContacts(platformUsers);
      }
    } catch (error) {
      console.error('Failed contacts', error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    if (isDirectModalOpen || isGroupModalOpen) {
      fetchContacts();
    }
  }, [isDirectModalOpen, isGroupModalOpen, contactSearch]);

  useEffect(() => {
    if (!isDirectModalOpen && !isGroupModalOpen) {
      setContactSearch('');
    }
  }, [isDirectModalOpen, isGroupModalOpen]);

  const fetchAvailableProjects = async () => {
    try {
      setIsLoadingProjects(true);
      const data = await getProjects({ limit: 100 });
      setAvailableProjects(data || []);
    } catch (error) {
      console.error('Failed projects', error);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (isProjectModalOpen) {
      fetchAvailableProjects();
    }
  }, [isProjectModalOpen]);

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message:new', (msg: any) => {
      if (String(activeChat) === String(msg.conversation_id)) {
        const newMsg: Message = {
          id: msg.id,
          sender: msg.sender_id === currentUser?.id ? 'me' : 'them',
          senderName: `${msg.sender?.first_name ?? ''} ${msg.sender?.last_name ?? ''}`.trim(),
          companyName: 'Company',
          content: msg.content,
          time: formatTime(msg.created_at),
          date: formatDate(msg.created_at),
          status: 'read',
          attachment: msg.attachments && Array.isArray(msg.attachments) ? msg.attachments[0] : undefined,
          isDeleted: msg.is_deleted,
          rawCreatedAt: msg.created_at
        };
        setMessagesList((prev) => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        scrollToBottom();
      }

      setChats((prev) => {
        const updated = prev.map(c => {
          if (String(c.id) === String(msg.conversation_id)) {
            return {
              ...c,
              lastMessage: msg.content,
              time: formatTime(msg.created_at),
              timestamp: msg.created_at,
              unread: String(activeChat) === String(c.id) ? 0 : (c.unread + 1)
            };
          }
          return c;
        });

        if (!updated.some(c => c.id === msg.conversation_id)) {
          fetchConversations();
          return prev;
        }

        return updated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      });
    });

    socket.on('conversation:updated', () => {
      fetchConversations();
    });

    socket.on('message:deleted', (payload: any) => {
      setMessagesList(prev => prev.map(m => m.id === payload.id ? { ...m, isDeleted: true, content: 'This message was deleted', attachment: undefined } : m));
    });

    socket.on('conversation:new', (data: any) => {
      console.log('Added to new conversation:', data);
      fetchConversations();
      toast({
        title: "New Project Chat",
        description: `You've been added to "${data.project_name}" group chat.`,
      });
    });

    return () => {
      socket.off('message:new');
      socket.off('conversation:updated');
      socket.off('message:deleted');
      socket.off('conversation:new');
    };
  }, [socket, activeChat, currentUser]);

  useEffect(() => {
    if (!activeChat || !currentUser) return;

    const loadMessages = async () => {
      try {
        const res = await chatService.getMessages(activeChat);
        if (res.success) {
          const mapped: Message[] = res.data.map((m: any) => ({
            id: m.id,
            sender: m.sender_id === currentUser.id ? 'me' : 'them',
            senderName: `${m.first_name ?? ''} ${m.last_name ?? ''}`.trim(),
            companyName: 'Company',
            content: m.content,
            time: formatTime(m.created_at),
            date: formatDate(m.created_at),
            status: 'read',
            attachment: Array.isArray(m.attachments) ? m.attachments[0] : undefined,
            isDeleted: m.is_deleted,
            rawCreatedAt: m.created_at
          }));
          setMessagesList(mapped);

          if (socket) {
            socket.emit('conversation:join', activeChat);
          }

          await chatService.markRead(activeChat);
        }
      } catch (error) {
        console.error('Failed to load messages', error);
      }
    };

    loadMessages();
  }, [activeChat, currentUser, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      setSidebarWidth((prevWidth) => {
        const newWidth = prevWidth + e.movementX;
        if (newWidth < 250) return 250;
        if (newWidth > 600) return 600;
        return newWidth;
      });
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;

    try {
      const res = await chatService.sendMessage(activeChat, {
        content: messageInput,
        messageType: attachments.length > 0 ? 'file' : 'text',
        attachments: attachments
      });

      setAttachments([]);

      // Optimistic update using API response
      if (res.success && res.data) {
        const m = res.data;
        const newMsg: Message = {
          id: m.id,
          sender: 'me',
          senderName: currentUser?.name || 'Me',
          companyName: 'Company',
          content: m.content,
          time: formatTime(m.created_at),
          date: formatDate(m.created_at),
          status: 'read',
          attachment: m.attachments && Array.isArray(m.attachments) ? m.attachments[0] : undefined,
          isDeleted: m.is_deleted,
          rawCreatedAt: m.created_at
        };
        setMessagesList((prev) => {
          if (prev.some(msg => msg.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        scrollToBottom();
      }
    } catch (error) {
      console.error('Failed to send message', error);
      toast({ title: 'Error', description: 'Failed to send message.', variant: 'destructive' });
    }

    setMessageInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'Error', description: 'File size must be less than 10MB', variant: 'destructive' });
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadService.uploadFile(file);
      if (res.success) {
        setAttachments([
          ...attachments,
          {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            type: file.type,
            url: res.url
          }
        ]);
      }
    } catch (error) {
      console.error('Upload failed', error);
      toast({ title: 'Error', description: 'Failed to upload file.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    // Optimistic delete
    setMessagesList(prev => prev.map(m => m.id === messageId ? { ...m, isDeleted: true, content: 'This message was deleted', attachment: undefined } : m));

    try {
      await chatService.deleteMessage(messageId);
    } catch (error) {
      // Revert if failed (optional, but good UX)
      toast({ title: 'Error', description: 'Failed to delete message.', variant: 'destructive' });
      // In a real app, I'd trigger a reload here
    }
  };

  const handleAddParticipant = async (userId: number) => {
    if (!activeChat) return;
    try {
      await chatService.addParticipants(activeChat, [userId]);
      toast({ title: 'Success', description: 'Participant added.' });
      setParticipantSearch('');
      await fetchConversations();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add participant.', variant: 'destructive' });
    }
  };

  const handleRemoveParticipant = async (userId: number) => {
    if (!activeChat) return;
    try {
      await chatService.removeParticipant(activeChat, userId);
      toast({ title: 'Success', description: 'Participant removed.' });
      await fetchConversations();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove participant.', variant: 'destructive' });
    }
  };

  const handleStartDirectChat = async (partnerId: number) => {
    try {
      const res = await chatService.startDirect(partnerId);
      if (res.success) {
        await fetchConversations();
        setActiveChat(res.data.id);
        setIsDirectModalOpen(false);
        toast({ title: 'Success', description: 'Conversation started.' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to start chat.', variant: 'destructive' });
    }
  };

  const handleCreateGroup = async () => {
    try {
      if (!groupTitle.trim() || selectedGroupMembers.length === 0) {
        toast({ title: 'Missing info', description: 'Add a group name and at least one member.' });
        return;
      }
      const res = await chatService.createGroup(groupTitle.trim(), selectedGroupMembers);
      if (res.success) {
        await fetchConversations();
        setActiveChat(res.data.id);
        setIsGroupModalOpen(false);
        setGroupTitle('');
        setSelectedGroupMembers([]);
        toast({ title: 'Group created', description: 'You can start chatting now.' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to create group.', variant: 'destructive' });
    }
  };

  const handleEnsureProjectChat = async () => {
    if (!projectIdInput.trim()) return;
    try {
      const res = await chatService.ensureProjectConversation(projectIdInput.trim());
      if (res.success && res.data?.id) {
        await fetchConversations();
        setActiveChat(res.data.id);
        toast({ title: 'Project chat ready', description: 'Project conversation created or re-used.' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.response?.data?.message || 'Failed to create project chat.', variant: 'destructive' });
    } finally {
      setIsProjectModalOpen(false);
      setProjectIdInput('');
    }
  };

  const projectChats = useMemo(() => {
    const search = sidebarSearch.toLowerCase();
    return chats.filter(c => c.project === 'Project' && c.name.toLowerCase().includes(search));
  }, [chats, sidebarSearch]);

  const privateChats = useMemo(() => chats.filter(c => !c.isGroup), [chats]);
  const groupChats = useMemo(() => chats.filter(c => c.isGroup), [chats]);

  const filteredChats = useMemo(() => {
    const search = sidebarSearch.toLowerCase();
    let list = chats;
    if (sidebarTab === 'private') list = privateChats;
    if (sidebarTab === 'groups') list = groupChats;
    if (sidebarTab === 'projects') list = projectChats;

    // In 'all' tab, project chats are shown in a separate section at the top.
    // So we remove them from the main list here to avoid duplicates.
    if (sidebarTab === 'all') {
      list = list.filter(c => c.project !== 'Project');
    }

    return list.filter(c => c.name.toLowerCase().includes(search));
  }, [chats, privateChats, groupChats, projectChats, sidebarTab, sidebarSearch]);

  const activeContact = chats.find(c => c.id === activeChat);

  return (
    <div className="flex h-full w-full bg-gray-50 dark:bg-[#0f1115] overflow-hidden text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <div className="flex w-full max-w-7xl mx-auto h-full relative z-10">

        {/* SIDEBAR */}
        <div
          className={cn(
            'flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#14161b] shrink-0 sticky left-0 z-20',
            activeChat ? 'hidden md:flex' : 'flex'
          )}
          style={{ width: `${sidebarWidth}px`, maxWidth: '100%' }}
        >
          <div className="p-4 border-b border-gray-200 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">Messages {isConnected ? <span className="text-green-500 text-xs">●</span> : <span className="text-red-500 text-xs">●</span>}</h1>
                <p className="text-xs text-gray-500">Direct, group, and project chats</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="secondary" onClick={() => setIsDirectModalOpen(true)} title="New Direct Chat">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={() => setIsGroupModalOpen(true)} title="New Group Chat">
                  <Users className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" onClick={() => setIsProjectModalOpen(true)} title="Project Chat">
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="pl-9 h-10 bg-gray-100 dark:bg-[#1c1e24] border-none rounded-xl"
              />
            </div>

            <div className="flex gap-1 bg-gray-100 dark:bg-black/20 p-1 rounded-xl text-[10px] font-black uppercase tracking-wider">
              <button onClick={() => setSidebarTab('all')} className={cn('flex-1 py-1.5 rounded-lg transition-all', sidebarTab === 'all' ? 'bg-white dark:bg-[#2a2d35] text-yellow-600 shadow-sm' : 'text-gray-500')}>All</button>
              <button onClick={() => setSidebarTab('private')} className={cn('flex-1 py-1.5 rounded-lg transition-all', sidebarTab === 'private' ? 'bg-white dark:bg-[#2a2d35] text-yellow-600 shadow-sm' : 'text-gray-500')}>Direct</button>
              <button onClick={() => setSidebarTab('groups')} className={cn('flex-1 py-1.5 rounded-lg transition-all', sidebarTab === 'groups' ? 'bg-white dark:bg-[#2a2d35] text-yellow-600 shadow-sm' : 'text-gray-500')}>Groups</button>
              <button onClick={() => setSidebarTab('projects')} className={cn('flex-1 py-1.5 rounded-lg transition-all', sidebarTab === 'projects' ? 'bg-white dark:bg-[#2a2d35] text-yellow-600 shadow-sm' : 'text-gray-500')}>Projects</button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-4">
              {(sidebarTab === 'all' && projectChats.length > 0) && (
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs font-semibold text-gray-500 uppercase">
                    <span>Proposals & Projects</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full">{projectChats.length}</span>
                  </div>
                  <div className="space-y-2">
                    {projectChats.map(chat => (
                      <div
                        key={`project-${chat.id}`}
                        onClick={() => setActiveChat(chat.id)}
                        className={cn(
                          'p-3 rounded-xl cursor-pointer transition-all border border-transparent',
                          activeChat === chat.id ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200' : 'hover:bg-gray-100 dark:hover:bg-white/5'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative shrink-0">
                            <Avatar className="w-10 h-10 border border-gray-200">
                              <AvatarFallback>{chat.avatar}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-sm truncate">{chat.name}</p>
                              <span className="text-[10px] text-gray-500">{chat.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mb-1">{chat.lastMessage}</p>
                            <div className="text-[10px] text-yellow-700 font-bold uppercase">Project</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {filteredChats.length === 0 && !isLoadingChats ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No conversations found. Start one!
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChat(chat.id)}
                      className={cn(
                        'p-3 rounded-xl cursor-pointer transition-all border border-transparent mb-1',
                        activeChat === chat.id ? 'bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200' : 'hover:bg-gray-100 dark:hover:bg-white/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0">
                          <Avatar className="w-10 h-10 border border-gray-200">
                            <AvatarImage src={chat.image} className="object-cover" />
                            <AvatarFallback>{chat.avatar}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-sm truncate">{chat.name}</p>
                            <span className="text-[10px] text-gray-500">{chat.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mb-1">{chat.lastMessage}</p>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase">
                            <span>{chat.project === 'Project' ? 'Project' : chat.isGroup ? 'Group' : 'Direct'}</span>
                            {chat.unread > 0 && <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{chat.unread}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* CHAT AREA */}
        <div className={cn('flex-1 flex flex-col min-w-0 relative', !activeChat && 'hidden md:flex')}>
          {activeContact ? (
            <>
              <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-white/50 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveChat(null)}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="w-10 h-10 border border-yellow-500/20 shadow-lg">
                    <AvatarFallback>{activeContact.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="font-bold truncate">{activeContact.name}</h2>
                    <p className="text-xs text-gray-500 truncate">{activeContact.project === 'Project' ? 'Project group' : activeContact.isGroup ? 'Group' : 'Direct chat'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mr-2">
                    <Users2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{activeContact.participants?.length || 0} participants</span>
                  </div>
                  {(activeContact.isGroup || activeContact.project === 'Project') && (
                    <Button variant="ghost" size="icon" onClick={() => setIsParticipantsModalOpen(true)} title="Manage Participants">
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {messagesList.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">No messages here yet. Say hello!</div>
                  ) : (
                    messagesList.map((m) => (
                      <div key={m.id} className={cn('flex', m.sender === 'me' ? 'justify-end' : 'justify-start')}>
                        <div className={cn('max-w-[80%] rounded-2xl p-4 shadow-sm relative group',
                          m.sender === 'me' ? 'bg-yellow-400 text-black rounded-tr-sm' : 'bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-sm',
                          m.isDeleted && 'opacity-50 italic'
                        )}>
                          {!m.isDeleted && m.attachment && (
                            <div className="mb-2 p-2 bg-black/5 dark:bg-white/10 rounded-lg flex items-center gap-3">
                              <FileIcon className="w-8 h-8 opacity-70" />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold truncate">{m.attachment.name}</p>
                                <p className="text-[10px] opacity-70">{m.attachment.size}</p>
                              </div>
                              <a href={m.attachment.url} download target="_blank" rel="noreferrer" className="text-xs underline opacity-70 hover:opacity-100">
                                Download
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase opacity-70">{m.senderName}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{m.content}</p>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 text-[8px] font-bold uppercase opacity-50">
                            <span>{m.time}</span>
                            {m.sender === 'me' && !m.isDeleted && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteMessage(m.id); }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-600"
                                title="Delete Message"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#14161b]">
                {attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white dark:bg-black/20 p-1.5 rounded-md border text-xs">
                        <FileIcon className="w-3 h-3 text-yellow-600" />
                        <span className="max-w-[100px] truncate">{file.name}</span>
                        <button onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="text-gray-500 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                  />
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </Button>
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 dark:bg-[#1c1e24] border-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className={cn('h-10 w-10 p-0 rounded-xl transition-all', messageInput.trim() ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-400')}
                    disabled={!messageInput.trim() || !isConnected}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div className="max-w-md space-y-3">
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-500/10 rounded-3xl flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="text-yellow-600" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Select or start a conversation</h3>
                <p className="text-gray-500">Use Direct, Group, or Project to begin chatting.</p>
                <div className="flex justify-center gap-2">
                  <Button size="sm" onClick={() => setIsDirectModalOpen(true)}>New Direct</Button>
                  <Button size="sm" variant="secondary" onClick={() => setIsGroupModalOpen(true)}>New Group</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsProjectModalOpen(true)}>Project Chat</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Direct Chat Modal */}
      <Dialog open={isDirectModalOpen} onOpenChange={setIsDirectModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader><DialogTitle>Start Direct Conversation</DialogTitle></DialogHeader>

          <div className="px-4 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by name or company..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="pl-9 bg-gray-100 border-none h-9 mt-2"
              />
            </div>
          </div>

          <div className="py-2 flex-1 overflow-y-auto min-h-[300px]">
            {isLoadingContacts ? (
              <div className="text-center p-12 text-gray-400">Loading platform users...</div>
            ) : (
              <div className="space-y-1 p-4">
                {contacts
                  .filter(c => c.user_id !== currentUser?.id)
                  .map((c) => (
                    <div key={c.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl cursor-pointer transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10 group"
                      onClick={() => handleStartDirectChat(c.user_id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform">
                          <AvatarFallback className="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-500 font-bold">
                            {getInitials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">{c.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                            {c.email}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="rounded-lg h-8 opacity-0 group-hover:opacity-100 transition-opacity">Message</Button>
                    </div>
                  ))}
                {contacts.length === 0 && !isLoadingContacts && (
                  <div className="text-center p-12 space-y-3">
                    <Users className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-gray-500 text-sm">No other users found on the platform yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDirectModalOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Group Chat Modal */}
      <Dialog open={isGroupModalOpen} onOpenChange={setIsGroupModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader><DialogTitle>Create Group</DialogTitle></DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Group name"
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
            />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <Input
                placeholder="Search users to add..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-gray-50 border-none"
              />
            </div>
            <div className="text-xs text-gray-500">Select members to add</div>
            <div className="flex-1 overflow-y-auto max-h-72 space-y-2">
              {isLoadingContacts ? (
                <div className="text-center p-4 text-xs">Loading...</div>
              ) : (
                <>
                  {contacts
                    .filter(c => c.user_id !== currentUser?.id)
                    .map(c => (
                      <label key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
                        <Checkbox
                          checked={selectedGroupMembers.includes(c.user_id)}
                          onCheckedChange={(checked) => {
                            setSelectedGroupMembers(prev => checked ? [...prev, c.user_id] : prev.filter(id => id !== c.user_id));
                          }}
                        />
                        <Avatar className="w-8 h-8 border shadow-sm">
                          <AvatarFallback className="text-[10px]">{getInitials(c.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{c.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{c.email}</p>
                        </div>
                      </label>
                    ))}

                  {contacts.length === 0 && !isLoadingContacts && (
                    <div className="text-center p-4 text-xs text-gray-400">No users found on the platform.</div>
                  )}
                </>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsGroupModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Project Chat Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Open Project Chat</DialogTitle></DialogHeader>
          <div className="space-y-3">
            {isLoadingProjects ? (
              <div className="text-center p-4 text-xs text-gray-500">Loading projects...</div>
            ) : availableProjects.length === 0 ? (
              <div className="text-center p-4 text-xs text-gray-500">No projects found. Create one first!</div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-1 border rounded-md p-2">
                {availableProjects.map((p) => (
                  <div
                    key={p.id}
                    className={cn(
                      'p-2 rounded cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-white/5 flex justify-between items-center',
                      projectIdInput === String(p.id) ? 'bg-yellow-50 border border-yellow-200' : ''
                    )}
                    onClick={() => setProjectIdInput(String(p.id))}
                  >
                    <span className="truncate flex-1">{p.name}</span>
                    <span className="text-[10px] text-gray-400 ml-2">#{p.id}</span>
                  </div>
                ))}
              </div>
            )}
            <Input
              placeholder="Or enter Project ID manually"
              value={projectIdInput}
              onChange={(e) => setProjectIdInput(e.target.value)}
              className="mt-2"
            />
            <p className="text-xs text-gray-500">Select a project to open its chat room.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEnsureProjectChat} disabled={!projectIdInput.trim()}>Open Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Participants Management Modal */}
      <Dialog open={isParticipantsModalOpen} onOpenChange={setIsParticipantsModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
          <DialogHeader><DialogTitle>Manage Participants</DialogTitle></DialogHeader>

          <div className="space-y-4 flex-1 overflow-auto p-1">
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Add member by name/company..."
                value={participantSearch}
                onChange={(e) => setParticipantSearch(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            {/* Search Results for adding */}
            {participantSearch && (
              <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-lg mb-4 space-y-1">
                <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">Search Results</p>
                {contacts.filter(c =>
                  !activeContact?.participants.some((p: any) => p.id === c.user_id) &&
                  (c.company_name?.toLowerCase().includes(participantSearch.toLowerCase()) || c.name?.toLowerCase().includes(participantSearch.toLowerCase()))
                ).map(c => (
                  <div key={c.id} className="flex justify-between items-center bg-white dark:bg-black/20 p-2 rounded border">
                    <span className="text-xs truncate max-w-[150px]">{c.company_name || c.name}</span>
                    <Button size="sm" className="h-6 text-[10px]" onClick={() => handleAddParticipant(c.user_id)}>Add</Button>
                  </div>
                ))}
                {contacts.filter(c =>
                  !activeContact?.participants.some((p: any) => p.id === c.user_id) &&
                  (c.company_name?.toLowerCase().includes(participantSearch.toLowerCase()) || c.name?.toLowerCase().includes(participantSearch.toLowerCase()))
                ).length === 0 && <p className="text-xs text-gray-400">No matches found.</p>}
              </div>
            )}

            <p className="text-[10px] font-bold uppercase text-gray-500">Current Participants</p>
            <div className="space-y-2">
              {activeContact?.participants?.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{getInitials(`${p.first_name} ${p.last_name}`)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-sm">{p.first_name} {p.last_name}</p>
                      <p className="text-xs text-gray-500">{p.email}</p>
                    </div>
                  </div>
                  {p.id !== currentUser?.id && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleRemoveParticipant(p.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsParticipantsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Communications;
