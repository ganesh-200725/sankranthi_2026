import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Download, User, Heart, Upload, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface RangoliEntry {
  id: string;
  participantName: string;
  participantId: string;
  imageUrl: string;
  likes?: number;
  likedBy?: string[];
}

const API_URL = 'http://localhost:5000';

// Helper to get or create a unique client ID
const getClientId = () => {
  let id = localStorage.getItem('sankranthi_client_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('sankranthi_client_id', id);
  }
  return id;
};

export default function Rangoli() {
  const { user, hasRole } = useAuth();
  const [entries, setEntries] = useState<RangoliEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const clientId = getClientId(); // Get unique ID for this user

  // Upload State
  const [newEntry, setNewEntry] = useState({ participantName: '', participantId: '', imageUrl: '' });
  const [uploading, setUploading] = useState(false);

  // Check if current user has permission (Ganesh or Rangoli Manager)
  const canUpload = hasRole(['rangoli_manager']) || user?.username.toLowerCase() === 'ganesh';

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`${API_URL}/rangoli`);
      const data = await res.json();
      setEntries(data);
    } catch {
      toast.error('Failed to load rangoli entries');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        toast.error('File size too large. Please use an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEntry({ ...newEntry, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!newEntry.participantName || !newEntry.participantId || !newEntry.imageUrl) {
      toast.error('Please fill all fields and select an image');
      return;
    }

    setUploading(true);
    try {
      const res = await fetch(`${API_URL}/rangoli`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(newEntry)
      });

      if (!res.ok) throw new Error('Upload failed');

      const addedEntry = await res.json();
      setEntries([addedEntry, ...entries]);
      setNewEntry({ participantName: '', participantId: '', imageUrl: '' });
      setShowUpload(false);
      toast.success('Rangoli uploaded successfully!');
    } catch {
      toast.error('Failed to upload rangoli');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (id: string) => {
    // Optimistic check
    const entry = entries.find(e => e.id === id);
    if (entry?.likedBy?.includes(clientId)) {
      toast.error("You have already liked this rangoli!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/rangoli/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to like');
        return;
      }

      if (data.success) {
        setEntries(entries.map(e => e.id === id ? { ...e, likes: data.likes, likedBy: data.likedBy } : e));
        toast.success("Vote recorded!");
      }
    } catch {
      toast.error('Failed to like');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rangoli entry?')) return;

    try {
      const res = await fetch(`${API_URL}/rangoli/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!res.ok) throw new Error('Delete failed');

      setEntries(entries.filter(e => e.id !== id));
      toast.success('Rangoli deleted successfully!');
    } catch {
      toast.error('Failed to delete rangoli');
    }
  };

  const handleDownload = (imageUrl: string, participantName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `Rangoli-${participantName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <section className="section-festival min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl animate-float">🎨</span>
              <h1 className="text-2xl md:text-3xl font-semibold text-white text-shadow-md">
                Rangoli Gallery
              </h1>
              <span className="text-4xl animate-float" style={{ animationDelay: '0.5s' }}>🌸</span>
            </div>
            <p className="text-white/90 font-medium max-w-xl mx-auto text-shadow-sm">
              Beautiful rangoli designs from our talented village artists.
              Click on any image to download!
            </p>
          </div>

          {/* Upload Section (Only for Committee) */}
          {canUpload && (
            <div className="mb-10">
              {!showUpload ? (
                <div className="text-center">
                  <Button onClick={() => setShowUpload(true)} className="btn-festival">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Participant Rangoli
                  </Button>
                </div>
              ) : (
                <div className="glass-card p-6 max-w-xl mx-auto border-white/20">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Upload className="w-5 h-5" /> Upload Entry
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-white">Participant Name</Label>
                      <Input
                        placeholder="Enter name"
                        value={newEntry.participantName}
                        onChange={(e) => setNewEntry({ ...newEntry, participantName: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Participant ID</Label>
                      <Input
                        placeholder="e.g. R001"
                        value={newEntry.participantId}
                        onChange={(e) => setNewEntry({ ...newEntry, participantId: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Rangoli Image</Label>
                      <div className="mt-1 flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="bg-white/10 border-white/20 text-white file:text-white file:bg-white/10 file:border-0 file:rounded-md cursor-pointer"
                        />
                      </div>
                      {newEntry.imageUrl && (
                        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-white/30">
                          <img src={newEntry.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button onClick={handleUpload} disabled={uploading} className="btn-festival flex-1">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload'}
                      </Button>
                      <Button variant="outline" onClick={() => setShowUpload(false)} className="bg-transparent border-white/30 text-white hover:bg-white/10">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Gallery Grid */}
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 text-festival-gold animate-spin mx-auto" />
              <p className="text-white mt-4">Loading gallery...</p>
            </div>
          ) : entries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="glass-card-hover overflow-hidden group flex flex-col h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    <img
                      src={entry.imageUrl}
                      alt={`Rangoli by ${entry.participantName}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-6">
                      <Button
                        onClick={() => handleDownload(entry.imageUrl, entry.participantName)}
                        className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleLike(entry.id)}
                        className="bg-festival-deep-orange hover:bg-festival-sunset text-white border-none shadow-lg"
                        size="icon"
                      >
                        <Heart className={`w-5 h-5 ${entry.likes ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-festival-gold" />
                          <h3 className="font-bold text-white text-lg text-shadow-sm">
                            {entry.participantName}
                          </h3>
                        </div>
                        <p className="text-sm text-white/60 font-medium">
                          ID: <span className="text-white/80">{entry.participantId}</span>
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-auto">
                      <Button
                        onClick={() => handleLike(entry.id)}
                        className="flex-1 bg-festival-deep-orange hover:bg-festival-sunset text-white border-none shadow-lg"
                        size="sm"
                      >
                        <Heart className={`w-4 h-4 mr-2 ${entry.likes ? 'fill-current' : ''}`} />
                        {entry.likes || 0} Likes
                      </Button>

                      {canUpload && (
                        <Button
                          onClick={() => handleDelete(entry.id)}
                          variant="outline"
                          size="icon"
                          className="bg-transparent border-white/30 text-white hover:bg-red-500/20 hover:border-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center max-w-md mx-auto">
              <span className="text-6xl mb-4 block animate-bounce">🎨</span>
              <h3 className="text-xl font-bold text-white mb-2 text-shadow-sm">
                No Rangoli Photos Yet
              </h3>
              <p className="text-white/70">
                Photos will be uploaded soon. Stay tuned!
              </p>
            </div>
          )}

          {/* Info Note */}
          <div className="mt-16 text-center">
            <div className="glass-card inline-block px-6 py-4">
              <p className="text-sm text-white/80 font-medium">
                📷 Only authorized committee members can upload entries.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
