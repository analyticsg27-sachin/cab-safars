"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, AlertCircle, RefreshCw, MapPin, XCircle } from "lucide-react";
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

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  const fetchTrips = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await AdminService.getTrips({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        page,
      });
      const r = res as { data?: ApiTrip[]; pagination?: { total: number; total_pages: number } };
      setTrips(r.data ?? []);
      setTotal(r.pagination?.total ?? 0);
      setTotalPages(r.pagination?.total_pages ?? 1);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load trips');
    } finally { setLoading(false); }
  }, [statusFilter, search, page]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  async function cancelTrip(id: string) {
    try {
      await AdminService.cancelTrip(id);
      showToast('Trip cancelled');
      fetchTrips();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed to cancel trip');
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0D1117] bg-[#22C55E] shadow-lg">{toast}</div>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#30363D]">
                  {["Route", "Vehicle", "Trip Provider", "Fare", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t.id} className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/50">
                    <td className="px-4 py-3 text-xs text-[#F0F6FC] whitespace-nowrap font-medium">
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
                        <Button variant="danger" size="xs" onClick={() => cancelTrip(t.id)}>
                          <XCircle className="w-3 h-3" />
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
