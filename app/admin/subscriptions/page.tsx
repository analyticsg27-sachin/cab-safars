"use client";

import { useEffect, useState } from "react";
import { Star, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminService from "@/lib/services/admin.service";
import { apiClient } from "@/lib/services/api-client";
import { formatDate, formatCurrency } from "@/lib/utils";

interface Plan {
  id: number;
  name: string;
  role: string;
  price_paise: number;
  duration_days: number;
  features: string[];
}

interface ActiveSub {
  id: string;
  user_name: string;
  user_role: string;
  plan_name: string;
  status: string;
  started_at: string;
  expires_at: string;
}

export default function SubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subs, setSubs] = useState<ActiveSub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchAll() {
    setLoading(true); setError('');
    try {
      const [plansRes, subsRes] = await Promise.all([
        apiClient.get<Plan[]>('/subscriptions/plans'),
        AdminService.getUsers({ status: 'approved' }),
      ]);
      setPlans((plansRes.data ?? []) as Plan[]);
      // Active subs come from payments/reports — show approved premium users for now
      const usersRes = subsRes as { data?: Array<{ id: string; name: string; role: string; is_premium: boolean; created_at: string }> };
      const premiumUsers = (usersRes.data ?? []).filter((u) => u.is_premium);
      setSubs(premiumUsers.map((u) => ({
        id: u.id,
        user_name: u.name,
        user_role: u.role,
        plan_name: 'Premium',
        status: 'active',
        started_at: u.created_at,
        expires_at: '',
      })));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load subscriptions');
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Subscriptions</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">Plans and active premium users</p>
        </div>
        <button onClick={fetchAll} className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
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
      ) : (
        <>
          {/* Plans */}
          <div>
            <h2 className="text-sm font-semibold text-[#F0F6FC] mb-3">Available Plans</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-[#161B22] border border-[#30363D] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-[#F5A623]" />
                    <span className="text-sm font-semibold text-[#F0F6FC]">{plan.name}</span>
                    <Badge variant={plan.role === 'vendor' ? 'vendor' : 'driver'}>{plan.role}</Badge>
                  </div>
                  <p className="text-xl font-bold text-[#F5A623] mb-1">
                    {formatCurrency(plan.price_paise / 100)}
                  </p>
                  <p className="text-xs text-[#8B949E] mb-3">{plan.duration_days} days</p>
                  {Array.isArray(plan.features) && plan.features.map((f, i) => (
                    <p key={i} className="text-xs text-[#8B949E] flex items-center gap-1">
                      <span className="text-[#22C55E]">✓</span> {f}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Active Premium Users */}
          <div>
            <h2 className="text-sm font-semibold text-[#F0F6FC] mb-3">Premium Users ({subs.length})</h2>
            {subs.length === 0 ? (
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-10 text-center">
                <p className="text-[#8B949E] text-sm">No premium users yet</p>
              </div>
            ) : (
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#30363D]">
                        {["User", "Role", "Plan", "Status", "Since"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {subs.map((s) => (
                        <tr key={s.id} className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/50">
                          <td className="px-4 py-3 text-xs font-medium text-[#F0F6FC]">{s.user_name}</td>
                          <td className="px-4 py-3"><Badge variant={s.user_role as 'vendor' | 'driver'}>{s.user_role}</Badge></td>
                          <td className="px-4 py-3 text-xs text-[#F5A623] font-semibold">★ {s.plan_name}</td>
                          <td className="px-4 py-3"><Badge variant="open" dot>active</Badge></td>
                          <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{formatDate(s.started_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
