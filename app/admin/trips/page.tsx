"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, AlertCircle, RefreshCw, MapPin, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminService from "@/lib/services/admin.service";
import { formatDate, formatCurrency } from "@/lib/utils";

interface ApiTrip {
  id: string;
  from_city: string;
  to_city: string;
  from_state: string;
  to_state: string;
  vehicle_type: string;
  status: string;
  vendor_name: string;
  departure_date?: string;
  expected_fare?: number;
  created_at: string;
}

const STATUS_FILTERS = ['all', 'active', 'closed', 'cancelled'];

export default function TripsPage() {
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState('');
  const [confirm, setConfirm] = useState<{ id: string; action: 'cancel' | 'close'; route: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  const fetchTrips = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await AdminService.getTrips({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        page,
      });
      const r = res as unknown as { data?: ApiTrip[]; pagination?: { total: number; total_pages: number } };
      setTrips(r.data ?? []);
      setTotal(r.pagination?.total ?? 0);
      setTotalPages(r.pagination?.total_pages ?? 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trips');
    } finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  async function confirmAction() {
    if (!confirm) return;
    setActionLoading(true);
    try {
      if (confirm.action === 'close') {
        await AdminService.closeTrip(confirm.id);
        showToast('Trip marked as closed');
      } else {
        await AdminService.cancelTrip(confirm.id);
        showToast('Trip cancelled');
      }
      setConfirm(null);
      fetchTrips();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0D1117] bg-[#22C55E] shadow-lg">{toast}</div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${confirm.action === 'close' ? 'bg-[#F5A623]/10' : 'bg-[#EF4444]/10'}`}>
                {confirm.action === 'close'
                  ? <AlertTriangle className="w-5 h-5 text-[#F5A623]" />
                  : <XCircle className="w-5 h-5 text-[#EF4444]" />}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#F0F6FC]">
                  {confirm.action === 'close' ? 'Mark Trip as Closed' : 'Cancel Trip'}
                </h3>
                <p className="text-xs text-[#8B949E]">{confirm.route}</p>
              </div>
            </div>
            <p className="text-xs text-[#8B949E] mb-4">
              {confirm.action === 'close'
                ? 'This will mark the trip as closed. The vendor will no longer receive driver contacts for this trip.'
                : 'This will cancel the trip permanently. This action cannot be undone.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${confirm.action === 'close' ? 'bg-[#F5A623] text-[#0D1117]' : 'bg-[#EF4444] text-white'}`}>
                {actionLoading ? 'Processing…' : confirm.action === 'close' ? 'Mark Closed' : 'Cancel Trip'}
              </button>
              <button onClick={() => setConfirm(null)} disabled={actionLoading}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#21262D] text-[#8B949E] hover:text-[#F0F6FC]">
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Trips</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">All platform trips ({total} total)</p>
        </div>
        <button onClick={fetchTrips} className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D]">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {(() => {
        const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
        const staleTrips = trips.filter(
          (t) => t.status === 'active' && (Date.now() - new Date(t.created_at).getTime()) > THREE_DAYS_MS
        );
        if (staleTrips.length === 0) return null;
        return (
          <div className="bg-[#F5A623]/10 border border-[#F5A623]/40 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F5A623] shrink-0" />
              <p className="text-sm font-medium text-[#F5A623]">
                {staleTrips.length} trip{staleTrips.length > 1 ? 's' : ''} have been open for 3+ days — consider reminding the Trip Provider to close them
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              {staleTrips.map((t) => {
                const daysOpen = Math.floor((Date.now() - new Date(t.created_at).getTime()) / (24 * 60 * 60 * 1000));
                return (
                  <div key={t.id} className="flex items-center justify-between bg-[#0D1117]/40 rounded-lg px-3 py-2 gap-3 flex-wrap">
                    <span className="text-xs font-medium text-[#F0F6FC]">{t.from_city} → {t.to_city}</span>
                    <span className="text-xs text-[#8B949E]">{t.vendor_name}</span>
                    <span className="text-xs text-[#F5A623]">{daysOpen}d open</span>
                    <button
                      onClick={() => setConfirm({ id: t.id, action: 'close', route: `${t.from_city} → ${t.to_city}` })}
                      className="text-xs px-2.5 py-1 rounded-lg bg-[#F5A623]/20 text-[#F5A623] hover:bg-[#F5A623]/30 font-medium transition-colors"
                    >
                      Mark Closed
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input placeholder="Search route, vendor…" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<Search className="w-4 h-4" />} />
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
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          <p className="text-sm text-[#EF4444]">{error}</p>
          <button onClick={fetchTrips} className="text-xs text-[#F5A623] underline">Retry</button>
        </div>
      ) : trips.length === 0 ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-16 text-center">
          <MapPin className="w-10 h-10 text-[#8B949E] mx-auto mb-3" />
          <p className="text-[#8B949E] text-sm">No trips found</p>
        </div>
      ) : (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#30363D]/50">
            {trips.map((t) => (
              <div key={t.id} className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#F0F6FC]">{t.from_city} → {t.to_city}</p>
                  <Badge variant={t.status as 'open' | 'closed' | 'cancelled' | 'completed'} dot>{t.status}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#8B949E]">
                  <span>{t.vehicle_type}</span>
                  <span>· {t.vendor_name}</span>
                  <span>· {formatDate(t.departure_date || t.created_at)}</span>
                  {t.expected_fare && <span>· {formatCurrency(t.expected_fare)}</span>}
                </div>
                {t.status === 'active' && (
                  <div className="pt-1">
                    <Button variant="danger" size="xs" onClick={() => setConfirm({ id: t.id, action: 'cancel', route: `${t.from_city} → ${t.to_city}` })}>
                      <XCircle className="w-3 h-3" /> Cancel Trip
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#0D1117', borderBottom: '1px solid #30363D' }}>
                  {["Route", "Vehicle", "Trip Provider", "Fare", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#6B7280] font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trips.map((t, i) => (
                  <tr key={t.id} className="border-b border-[#30363D]/40 hover:bg-[#1C2128]/60 transition-colors"
                    style={{ backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td className="px-4 py-3 text-sm text-[#F0F6FC] whitespace-nowrap font-medium">
                      {t.from_city} → {t.to_city}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E]">{t.vehicle_type}</td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{t.vendor_name}</td>
                    <td className="px-4 py-3 text-xs text-[#8B949E]">
                      {t.expected_fare ? formatCurrency(t.expected_fare) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={t.status as 'open' | 'closed' | 'cancelled' | 'completed'} dot>{t.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">
                      {formatDate(t.departure_date || t.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      {t.status === 'active' && (
                        <Button variant="danger" size="xs" onClick={() => setConfirm({ id: t.id, action: 'cancel', route: `${t.from_city} → ${t.to_city}` })}>
                          <XCircle className="w-3 h-3" /> Cancel Trip
                        </Button>
                      )}
                    </td>
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
