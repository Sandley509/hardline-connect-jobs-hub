
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, chat-messages } from "lucide-react";

interface CustomerChatProps {
  orderId: string;
}

const CustomerChat = ({ orderId }: CustomerChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ['customer-chat', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!orderId
  });

  // Real-time updates
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`customer-chat-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `order_id=eq.${orderId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['customer-chat', orderId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, queryClient]);

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          order_id: orderId,
          sender_id: user?.id,
          message
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['customer-chat', orderId] });
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage.mutate(newMessage);
  };

  if (!isExpanded) {
    return (
      <Card className="fixed bottom-4 right-4 p-4 w-80 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <chat-messages className="h-5 w-5 text-orange-600" />
            <span className="font-medium">Chat with Admin</span>
          </div>
          <Button
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Open
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <chat-messages className="h-5 w-5 text-orange-600" />
          <span className="font-medium">Chat with Admin</span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(false)}
        >
          ×
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message: any) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender_id === user?.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim() || sendMessage.isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
};

export default CustomerChat;
