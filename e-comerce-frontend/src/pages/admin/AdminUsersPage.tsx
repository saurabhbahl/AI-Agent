import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { adminApi } from '@/services/endpoints';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await adminApi.getUsers({ search: search || undefined, limit: 50 });
    setUsers(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const updateRole = async (userId: string, role: 'admin' | 'customer') => {
    await adminApi.updateUser(userId, { role });
    load();
  };

  const toggleActive = async (user: User) => {
    await adminApi.updateUser(user.id, { isActive: !user.isActive });
    load();
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this user?')) return;
    await adminApi.deleteUser(userId);
    load();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Users</h1>
        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
      </div>

      {loading ? <Skeleton className="h-64" /> : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Joined</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3 font-medium">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <Select value={user.role} onValueChange={(v) => updateRole(user.id, v as 'admin' | 'customer')}>
                      <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(user)}>
                      <Badge variant={user.isActive ? 'success' : 'destructive'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                    </Button>
                  </td>
                  <td className="p-3">{formatDate(user.createdAt)}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
