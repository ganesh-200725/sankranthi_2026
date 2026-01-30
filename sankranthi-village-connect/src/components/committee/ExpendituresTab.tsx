import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000';

interface Expenditure {
  id: string;
  item: string;
  amount: number;
  date: string;
  addedBy: string;
}

interface ExpendituresTabProps {
  canManage: boolean;
}

export function ExpendituresTab({ canManage }: ExpendituresTabProps) {
  const { user } = useAuth();
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const loadExpenditures = async () => {
    try {
      const res = await fetch(`${API_URL}/expenditures`);
      const data = await res.json();
      setExpenditures(data);
    } catch {
      toast.error('Failed to load expenditures');
    }
  };

  useEffect(() => {
    if (user) {
      loadExpenditures();
    }
  }, [user]);

  const totalAmount = expenditures.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpenditure = async () => {
    if (!newItem.trim() || !newAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    console.log('Sending expenditure for user:', user?.username);

    try {
      const res = await fetch(`${API_URL}/expenditures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          item: newItem.trim(),
          amount: parseFloat(newAmount),
          date: new Date().toISOString().split('T')[0]
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Add Expenditure Error Response:', errData);
        throw new Error(errData.error || `Server error: ${res.status}`);
      }

      const added = await res.json();
      setExpenditures([added, ...expenditures]);
      setNewItem('');
      setNewAmount('');
      toast.success('Expenditure added successfully');
    } catch (e) {
      toast.error(`Error: ${(e as Error).message}`);
      console.error('Add expenditure component failed:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      const res = await fetch(`${API_URL}/expenditures/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete');
      }
      setExpenditures(expenditures.filter(exp => exp.id !== id));
      toast.success('Expenditure deleted');
    } catch (e) {
      toast.error(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Total Summary */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-muted-foreground">Total Expenditure</h3>
            <p className="text-3xl font-bold text-foreground flex items-center gap-1">
              <IndianRupee className="w-7 h-7" />
              {totalAmount.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-sunset flex items-center justify-center shadow-festival">
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Add New (Finance Manager Only) */}
      {canManage && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Expenditure
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="item">Item Name</Label>
              <Input
                id="item"
                placeholder="e.g., Decorations"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="w-full sm:w-40">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="5000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddExpenditure} className="btn-festival w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Expenditure List */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg mb-4">All Expenditures</h3>
        <div className="space-y-3">
          {expenditures.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
            >
              <div>
                <h4 className="font-medium text-foreground">{exp.item}</h4>
                <p className="text-sm text-muted-foreground">
                  {exp.date} • Added by {exp.addedBy}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-foreground flex items-center">
                  <IndianRupee className="w-4 h-4" />
                  {exp.amount.toLocaleString('en-IN')}
                </span>
                {canManage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(exp.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!canManage && (
        <div className="glass-card p-6 text-center">
          <p className="text-muted-foreground">
            🔒 Only Financial Managers can add or delete expenditures
          </p>
        </div>
      )}
    </div>
  );
}
