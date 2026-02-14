import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/Subcontractor dashboard/ui/button';
import { Input } from '@/components/Subcontractor dashboard/ui/input';
import { ScrollArea } from '@/components/Subcontractor dashboard/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Subcontractor dashboard/ui/avatar';
import { Checkbox } from '@/components/Subcontractor dashboard/ui/checkbox';
import {
  Search,
  Plus,
  Send,
  MessageSquare,
  ArrowLeft,
  Users,
  Users2,
  FolderPlus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/Subcontractor dashboard/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useSocket } from '@/context/SocketContext';
import { chatService } from '@/api/chatService';
import { useAppSelector } from '@/store/hooks';

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
  attachment?: { name: string; size: string; type: string };
  rawCreatedAt: string;
}

const CleanCommunications = () => {
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

  const [chats, setChats] = useState<Chat[]>([]);
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);

  const [contacts, setContacts] = useState<any[]>([]); // For New Chat
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

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
      const res = await chatService.getPotentialContacts();
      if (res.data) {
        setContacts(res.data);
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
  }, [isDirectModalOpen, isGroupModalOpen]);

  useEffect(() => {
    fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message:new', (msg: any) => {
      console.log('📨 Real-time message received:', msg);

      const isCurrentChat = String(activeChat).toLowerCase() === String(msg.conversation_id || msg.conversationId).toLowerCase();

      if (isCurrentChat) {
        const newMsg: Message = {
          id: msg.id,
          sender: Number(msg.sender_id) === Number(currentUser?.id) ? 'me' : 'them',
          senderName: msg.sender ? `${msg.sender.first_name ?? ''} ${msg.sender.last_name ?? ''}`.trim() : 'System',
          companyName: 'Company',
          content: msg.content,
          time: formatTime(msg.created_at),
          date: formatDate(msg.created_at),
          status: 'read',
          attachment: msg.attachments?.[0],
          rawCreatedAt: msg.created_at
        };
        console.log('✅ Appending to current chat messages');
        setMessagesList((prev) => [...prev, newMsg]);
        scrollToBottom();
      } else {
        console.log('ℹ️ Message is for hidden chat:', msg.conversation_id);
      }

      setChats((prev) => {
        const updated = prev.map(c => {
          if (String(c.id).toLowerCase() === String(msg.conversation_id || msg.conversationId).toLowerCase()) {
            return {
              ...c,
              lastMessage: msg.content,
              time: formatTime(msg.created_at),
              timestamp: msg.created_at,
              unread: (String(activeChat).toLowerCase() === String(c.id).toLowerCase()) ? 0 : (c.unread + 1)
            };
          }
          return c;
        });

        if (!updated.some(c => String(c.id).toLowerCase() === String(msg.conversation_id || msg.conversationId).toLowerCase())) {
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
      setMessagesList(prev => prev.filter(m => m.id !== payload.id));
    });

    return () => {
      socket.off('message:new');
      socket.off('conversation:updated');
      socket.off('message:deleted');
    };
  }, [socket, activeChat, currentUser]);

  useEffect(() => {
    if (!activeChat || !currentUser) return;

    // Clear list to avoid flickering/old content
    setMessagesList([]);

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

    if (socket) {
      socket.emit('message:send', {
        conversationId: activeChat,
        content: messageInput,
        messageType: 'text',
        attachments: []
      });
    } else {
      await chatService.sendMessage(activeChat, { content: messageInput, messageType: 'text', attachments: [] });
      await fetchConversations();
    }

    setMessageInput('');
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

  const projectChats = useMemo(() => chats.filter(c => c.project === 'Project'), [chats]);
  const privateChats = useMemo(() => chats.filter(c => !c.isGroup), [chats]);
  const groupChats = useMemo(() => chats.filter(c => c.isGroup), [chats]);

  const filteredChats = useMemo(() => {
    const search = sidebarSearch.toLowerCase();
    let list = chats;
    if (sidebarTab === 'private') list = privateChats;
    if (sidebarTab === 'groups') list = groupChats;
    if (sidebarTab === 'projects') list = projectChats;
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
              {projectChats.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs font-semibold text-gray-500 uppercase">
                    <span>Project Groups</span>
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
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Users2 className="w-4 h-4" />
                  <span>{activeContact.participants?.length || 0} participants</span>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {messagesList.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">No messages here yet. Say hello!</div>
                  ) : (
                    messagesList.map((m) => (
                      <div key={m.id} className={cn('flex', m.sender === 'me' ? 'justify-end' : 'justify-start')}>
                        <div className={cn('max-w-[80%] rounded-2xl p-4 shadow-sm', m.sender === 'me' ? 'bg-yellow-400 text-black rounded-tr-sm' : 'bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-sm')}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase opacity-70">{m.senderName}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{m.content}</p>
                          <div className="flex items-center justify-end mt-2 pt-1 border-t border-black/5 text-[8px] font-bold uppercase opacity-50">
                            <span>{m.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#14161b]">
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
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

          <div className="py-2 flex-1 overflow-y-auto min-h-[300px]">
            {isLoadingContacts ? (
              <div className="text-center p-4">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className="text-center p-4">No contacts found</div>
            ) : (
              <div className="space-y-2">
                {contacts.filter(c => c.user_id).map((c) => (
                  <div key={c.id}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => handleStartDirectChat(c.user_id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{getInitials(c.company_name || c.name || 'User')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">{c.company_name || c.name}</p>
                        <p className="text-xs text-gray-500">{c.professional_category || 'Contact'}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Chat</Button>
                  </div>
                ))}
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
            <div className="text-xs text-gray-500">Select members to add</div>
            <div className="flex-1 overflow-y-auto max-h-72 space-y-2">
              {isLoadingContacts ? (
                <div className="text-center p-4">Loading contacts...</div>
              ) : contacts.length === 0 ? (
                <div className="text-center p-4">No contacts found</div>
              ) : (
                contacts.filter(c => c.user_id).map(c => (
                  <label key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <Checkbox
                      checked={selectedGroupMembers.includes(c.user_id)}
                      onCheckedChange={(checked) => {
                        setSelectedGroupMembers(prev => checked ? [...prev, c.user_id] : prev.filter(id => id !== c.user_id));
                      }}
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{getInitials(c.company_name || c.name || 'User')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{c.company_name || c.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{c.professional_category || 'Contact'}</p>
                    </div>
                  </label>
                ))
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
            <Input
              placeholder="Project ID (gc_projects.id)"
              value={projectIdInput}
              onChange={(e) => setProjectIdInput(e.target.value)}
            />
            <p className="text-xs text-gray-500">Enter the project ID to create or jump into its project conversation.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsProjectModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEnsureProjectChat} disabled={!projectIdInput.trim()}>Open Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CleanCommunications;
