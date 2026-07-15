"use client";

import { useState, useEffect, useCallback } from "react";
import { CreditCard, AlertCircle, RefreshCw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AdminService from "@/lib/services/admin.service";
import { formatDate, formatCurrency } from "@/lib/utils";

interface ApiPayment {
  id: string;
  user_name: string;
  user_role: string;
  amount_paise: number;
  status: string;
  razorpay_payment_id?: string;
  plan_name?: string;
  created_at: string;
}

const STATUS_FILTERS = ['all', 'captured', 'pending', 'failed', 'refunded'];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPayments = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await AdminService.getPayments({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
      });
      const r = res as { data?: ApiPayment[]; pagination?: { total: number; total_pages: number } };
      setPayments(r.data ?? []);
      setTotal(r.pagination?.total ?? 0);
      setTotalPages(r.pagination?.total_pages ?? 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load payments');
    } finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Payments</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">Payment transactions ({total} total)</p>
        </div>
        <button onClick={fetchPayments} className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {STATUS_FILTERS.map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              statusFilter === s ? 'bg-[#F5A623] text-[#0D1117]' : 'bg-[#21262D] text-[#8B949E] hover:text-[#F0F6FC]'
            }`}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          <p className="text-sm text-[#EF4444]">{error}</p>
          <button onClick={fetchPayments} className="text-xs text-[#F5A623] underline">Retry</button>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-16 text-center">
          <CreditCard className="w-10 h-10 text-[#8B949E] mx-auto mb-3" />
          <p className="text-[#8B949E] text-sm">No payments found</p>
        </div>
      ) : (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#30363D]">
                  {["User", "Role", "Plan", "Amount", "Status", "Razorpay ID", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/50">
                    <td className="px-4 py-3 text-xs font-medium text-[#F0F6FC] whitespace-nowrap">{p.user_name}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.user_role as 'vendor' | 'driver'}>{p.user_role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E]">{p.plan_name || '—'}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-[#F0F6FC]">
                      {formatCurrency(p.amount_paise / 100)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status as 'paid' | 'pending' | 'failed' | 'refunded'} dot>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] font-mono">
                      {p.razorpay_payment_id || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#30363D]">
              <span className="text-xs text-[#8B949E]">Page {page} of {totalPages}</span>
              <div className="flex gap-1">
                <Button variant="secondary" size="xs" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                <Button variant="secondary" size="xs" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
