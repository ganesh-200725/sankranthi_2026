import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Send, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';

interface Suggestion {
  id: string;
  name: string;
  message: string;
  date: string;
}

import { API_URL } from '@/config/api';


export function SuggestionsTab() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const loadSuggestions = async () => {
    try {
      const res = await fetch(`${API_URL}/suggestions`);
      const data = await res.json();
      setSuggestions(data);
    } catch {
      toast.error('Failed to load suggestions');
      console.error('Failed to load suggestions');
    }
  };

  useEffect(() => {
    if (user) {
      loadSuggestions();
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!newMessage.trim()) {
      toast.error('Please enter your suggestion');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.username || 'Anonymous',
          message: newMessage.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to submit');

      const added = await res.json();
      setSuggestions([added, ...suggestions]);
      setNewMessage('');
      toast.success('Suggestion submitted! Thank you for your feedback.');
    } catch (e) {
      toast.error('Failed to submit suggestion');
    }
  };

  return (
    <div className="space-y-6">
      {/* Submit Form */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Share Your Suggestion
        </h3>
        <div className="space-y-4">
          <Textarea
            placeholder="Share your ideas to make Sankranthi 2026 even better..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <Button onClick={handleSubmit} className="btn-festival">
            <Send className="w-4 h-4 mr-2" />
            Submit Suggestion
          </Button>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg mb-4">All Suggestions</h3>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-4 rounded-xl bg-muted/50 border-l-4 border-primary"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">{suggestion.name}</h4>
                  <p className="text-xs text-muted-foreground">{suggestion.date}</p>
                </div>
              </div>
              <p className="text-foreground pl-10">{suggestion.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          💬 All suggestions are visible only to committee members
        </p>
      </div>
    </div>
  );
}
