import React, { useEffect, useMemo, useState } from "react";
import { Send, MessageCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import messageApi from "../../api/messageApi";
import {
  getSocket,
  joinConversation,
  listenNewMessage,
} from "../../lib/socket";

type UserMini = {
  id: string;
  name: string;
  avatar?: string | null;
  role: "CLIENT" | "FREELANCER" | "ADMIN";
};

type Conversation = {
  id: string;
  participant1Id: string;
  participant2Id: string;
  participant1: UserMini;
  participant2: UserMini;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  project?: { id: string; title: string } | null;
};

type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead?: boolean;
  createdAt?: string;
  sender?: UserMini;
};

const unwrap = (res: any) => res?.data || res;

export default function MessagesPage() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const otherUser = useMemo(() => {
    if (!user || !selectedConversation) return null;

    return selectedConversation.participant1Id === user.id
      ? selectedConversation.participant2
      : selectedConversation.participant1;
  }, [user, selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);

      const res = await messageApi.getConversations();
      const list = unwrap(res) || [];

      setConversations(list);

      if (!selectedConversation && list.length > 0) {
        setSelectedConversation(list[0]);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);

      const res = await messageApi.getMessages(conversationId);
      const list = unwrap(res) || [];

      setMessages(list);
      joinConversation(conversationId);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    loadConversations();

    listenNewMessage((msg: ChatMessage) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id && m.id === msg.id);
        if (exists) return prev;

        if (selectedConversation?.id === msg.conversationId) {
          return [...prev, msg];
        }

        return prev;
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? {
                ...c,
                lastMessage: msg.content,
                lastMessageAt: msg.createdAt || new Date().toISOString(),
              }
            : c
        )
      );
    });
  }, [user, selectedConversation?.id]);

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation?.id]);

  const handleSend = async () => {
    if (!user || !selectedConversation || !text.trim()) return;

    try {
      setSending(true);

      const res = await messageApi.sendMessage(selectedConversation.id, {
        content: text.trim(),
      });

      const savedMessage = unwrap(res);

      setMessages((prev) => {
        const exists = prev.some((m) => m.id && m.id === savedMessage.id);
        if (exists) return prev;
        return [...prev, savedMessage];
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? {
                ...c,
                lastMessage: text.trim(),
                lastMessageAt: new Date().toISOString(),
              }
            : c
        )
      );

      setText("");
    } catch (error) {
      console.error("Message send failed:", error);
      alert("Message send failed. Please check backend/API.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-[320px_1fr] min-h-[620px]">
        <aside className="border-r border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-orange-500" />
              Messages
            </h2>

            <button
              onClick={loadConversations}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {loadingConversations ? (
              <p className="text-sm text-slate-400">Loading conversations...</p>
            ) : conversations.length === 0 ? (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-sm text-slate-600">
                No conversation yet. Start chat from project/bid/contract page.
              </div>
            ) : (
              conversations.map((conversation) => {
                const participant =
                  conversation.participant1Id === user?.id
                    ? conversation.participant2
                    : conversation.participant1;

                const active = selectedConversation?.id === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full text-left p-4 rounded-2xl border transition ${
                      active
                        ? "bg-orange-50 border-orange-300"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <p className="font-bold text-slate-900 dark:text-white">
                      {participant?.name || "Unknown User"}
                    </p>

                    <p className="text-xs text-orange-600 font-semibold">
                      {participant?.role}
                    </p>

                    <p className="text-xs text-slate-500 truncate mt-1">
                      {conversation.lastMessage || "No messages yet"}
                    </p>

                    {conversation.project?.title && (
                      <p className="text-[11px] text-slate-400 truncate mt-1">
                        Project: {conversation.project.title}
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="flex flex-col">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">
              {otherUser?.name || "Select a conversation"}
            </h3>
            <p className="text-xs text-slate-500">
              Your Role: {user?.role}
              {otherUser?.role ? ` • Chat with: ${otherUser.role}` : ""}
            </p>
          </div>

          <div className="flex-1 p-5 space-y-3 overflow-y-auto">
            {!selectedConversation ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Select a conversation to start messaging.
              </div>
            ) : loadingMessages ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No messages yet. Start conversation.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === user?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                      msg.senderId === user?.id
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] opacity-70 mt-1">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString()
                        : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex gap-3">
            <input
              value={text}
              disabled={!selectedConversation || sending}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                selectedConversation
                  ? "Type your message..."
                  : "Select conversation first..."
              }
              className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 outline-none text-sm disabled:opacity-60"
            />

            <button
              onClick={handleSend}
              disabled={!selectedConversation || sending}
              className="px-5 rounded-2xl bg-orange-500 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}