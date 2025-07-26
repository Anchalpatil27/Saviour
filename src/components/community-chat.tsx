"use client"

import React, { useEffect, useRef, useState } from "react";
import { Send, Users, Image, Video, File, Mic, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { db, storage } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface MessageInterface {
  id: string;
  content: string;
  userId: string;
  userName?: string;
  userImage?: string;
  city: string;
  createdAt: Date | string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document' | 'audio';
  fileName?: string;
}

interface CommunityProps {
  userId: string;
  userCity: string | undefined;
  userName?: string;
  userImage?: string;
}

export function CommunityChat({ userId, userCity, userName = "User", userImage }: CommunityProps) {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isMediaMenuOpen, setIsMediaMenuOpen] = useState(false);
  const [preview, setPreview] = useState<{ url: string; type: string; file: File } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Fetch messages
  useEffect(() => {
    if (!userCity) return;

    const messagesRef = collection(db, "chats_users", userCity, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: MessageInterface[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content,
          userId: data.userId,
          userName: data.userName,
          userImage: data.userImage,
          city: userCity,
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          fileName: data.fileName,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
        };
      });
      setMessages(msgs);
      setActiveUsers(Math.max(3, new Set(msgs.map(m => m.userId)).size));
    });

    return () => unsubscribe();
  }, [userCity]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !preview) || loading || !userCity) return;
    setLoading(true);

    try {
      const messagesRef = collection(db, "chats_users", userCity, "messages");
      
      if (preview) {
        // Upload media file
        const storageRef = ref(storage, `community_chats/${userCity}/${Date.now()}_${preview.file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, preview.file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload failed:", error);
            setLoading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const fileType = preview.file.type.split('/')[0];
            const mediaType = fileType === 'application' ? 'document' : fileType as 'image' | 'video' | 'audio';
            
            await addDoc(messagesRef, {
              content: newMessage || `Sent ${preview.file.name}`,
              userId,
              userName,
              userImage: userImage || "",
              city: userCity,
              mediaUrl: downloadURL,
              mediaType,
              fileName: preview.file.name,
              createdAt: Timestamp.now(),
            });

            setPreview(null);
            setNewMessage("");
            setUploadProgress(0);
            setLoading(false);
          }
        );
      } else {
        // Text message
        await addDoc(messagesRef, {
          content: newMessage,
          userId,
          userName,
          userImage: userImage || "",
          city: userCity,
          createdAt: Timestamp.now(),
        });
        setNewMessage("");
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userCity) return;

    setIsMediaMenuOpen(false);
    
    // Create preview
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreview({ url, type: file.type, file });
    } else {
      // For documents
      setPreview({
        url: '',
        type: file.type,
        file,
      });
    }
  };

  const formatMessageDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = formatMessageDate(new Date(message.createdAt));
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
      return groups;
    },
    {} as Record<string, MessageInterface[]>
  );

  if (!userCity) {
    return (
      <Card className="w-full h-[600px] flex items-center justify-center">
        <p className="text-muted-foreground">You need to set your city to join the community chat.</p>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[600px] flex flex-col border shadow-md rounded-xl overflow-hidden">
      <CardHeader className="px-4 py-2 border-b bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                {activeUsers}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-sm flex items-center gap-2">
                {userCity} Community
                <Badge variant="outline" className="ml-1 text-[10px] font-normal py-0 px-1.5 h-4">
                  Local
                </Badge>
              </h3>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-[500px]" ref={scrollAreaRef}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium mb-1">No messages yet</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Be the first to start a conversation with people in {userCity}!
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border"></div>
                    <span className="text-[10px] font-medium text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                      {date}
                    </span>
                    <div className="h-px flex-1 bg-border"></div>
                  </div>
                  {dateMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.userId === userId ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-1.5 max-w-[80%] ${message.userId === userId ? "flex-row-reverse" : ""}`}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Avatar className="h-6 w-6 shrink-0">
                                <AvatarImage src={message.userImage} />
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                  {message.userName?.charAt(0) || "U"}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p>{message.userName}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div>
                          {message.mediaUrl ? (
                            <div className={`rounded-2xl overflow-hidden ${
                              message.userId === userId ? "border border-primary" : "border"
                            }`}>
                              {message.mediaType === 'image' ? (
                                <img 
                                  src={message.mediaUrl} 
                                  alt={message.content} 
                                  className="max-w-[250px] max-h-[250px] object-cover"
                                />
                              ) : message.mediaType === 'video' ? (
                                <video 
                                  src={message.mediaUrl} 
                                  controls 
                                  className="max-w-[250px] max-h-[250px]"
                                />
                              ) : (
                                <a 
                                  href={message.mediaUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-3 py-2 text-xs"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span className="truncate max-w-[180px]">{message.fileName || message.content}</span>
                                </a>
                              )}
                            </div>
                          ) : (
                            <div
                              className={`rounded-2xl px-3 py-1.5 text-xs ${
                                message.userId === userId ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              {message.content}
                            </div>
                          )}
                          <p className="text-[9px] text-muted-foreground mt-0.5">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {preview && (
        <div className="relative border-t p-2 bg-muted/50">
          <div className="relative">
            {preview.type.startsWith('image') ? (
              <img 
                src={preview.url} 
                alt="Preview" 
                className="max-h-[100px] rounded-md object-contain"
              />
            ) : preview.type.startsWith('video') ? (
              <video 
                src={preview.url} 
                controls 
                className="max-h-[100px] rounded-md"
              />
            ) : (
              <div className="flex items-center gap-2 p-2 bg-background rounded-md">
                <FileText className="h-5 w-5" />
                <span className="text-sm truncate">{preview.file.name}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={() => setPreview(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="px-2 pb-2">
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <CardFooter className="p-2 border-t bg-card">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            type="file"
            ref={videoInputRef}
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            type="file"
            ref={docInputRef}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <Popover open={isMediaMenuOpen} onOpenChange={setIsMediaMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-plus"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto p-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-4 w-4" />
                  <span className="text-xs">Photo</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto p-2"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Video className="h-4 w-4" />
                  <span className="text-xs">Video</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto p-2"
                  onClick={() => docInputRef.current?.click()}
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Document</span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Input
            ref={inputRef}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-muted border-0 focus-visible:ring-1 h-8 text-xs"
            disabled={loading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={loading || (!newMessage.trim() && !preview)}
            className="h-8 text-xs"
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}