"use client";

import { useEffect, useState } from "react";
import { Phone, AlertCircle, RefreshCw, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminService from "@/lib/services/admin.service";
import { formatDate } from "@/lib/utils";

interface ApiUser {
  id: string;
  name: string;
  role: string;
  phone: string;
  city: string;
  is_premium: boolean;
  created_at: string;
}

export default function ContactsPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchContacts() {
    setLoading(true); setError('');
    try {
      // Contact activity tracked through approved premium users
      const res = await AdminService.getUsers({ status: 'approved' });
      const r = res as { data?: ApiUser[] };
      setUsers((r.data ?? []).filter((u) => u.is_premium));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load contact data');
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchContacts(); }, []);

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Contacts</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">
            Premium users eligible to view vendor contact information
          </p>
        </div>
        <button onClick={fetchContacts} className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-[#161B22] border border-[#F5A623]/20 rounded-xl p-4">
        <p className="text-xs text-[#8B949E]">
          <span className="text-[#F5A623] font-semibold">Security Note:</span> Vendor phone/WhatsApp contact details are
          enforced server-side. Only users with an active premium subscription receive contact data from the API.
          Free drivers see null contact fields regardless of frontend state.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          <p className="text-sm text-[#EF4444]">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-16 text-center">
          <Users className="w-10 h-10 text-[#8B949E] mx-auto mb-3" />
          <p className="text-[#8B949E] text-sm">No premium users yet — contact access is available once users subscribe</p>
        </div>
      ) : (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#30363D]">
                  {["Name", "Role", "Phone", "City", "Premium", "Member Since"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/50">
                    <td className="px-4 py-3 text-xs font-medium text-[#F0F6FC]">{u.name}</td>
                    <td className="px-4 py-3"><Badge variant={u.role as 'vendor' | 'driver'}>{u.role}</Badge></td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {u.phone}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E]">{u.city}</td>
                    <td className="px-4 py-3">
                      {u.is_premium
                        ? <span className="text-xs text-[#F5A623] font-semibold">★ Premium</span>
                        : <span className="text-xs text-[#8B949E]">Free</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
