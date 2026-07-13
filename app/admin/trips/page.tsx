"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockTrips } from "@/lib/mock-data";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { TripStatus } from "@/lib/types";

const PAGE_SIZE = 10;

const statusFilters: Array<{ label: string; value: TripStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function TripsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TripStatus | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockTrips.filter((t) => {
      const matchSearch =
        t.fromCity.toLowerCase().includes(search.toLowerCase()) ||
        t.toCity.toLowerCase().includes(search.toLowerCase()) ||
        t.vendorName.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusCounts = useMemo(() => ({
    all: mockTrips.length,
    open: mockTrips.filter((t) => t.status === "open").length,
    closed: mockTrips.filter((t) => t.status === "closed").length,
    completed: mockTrips.filter((t) => t.status === "completed").length,
    cancelled: mockTrips.filter((t) => t.status === "cancelled").length,
  }), []);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">Trips</h1>
        <p className="text-sm text-[#8B949E] mt-0.5">{mockTrips.length} total trips</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by route, vendor, trip ID..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          leftIcon={<Search className="w-4 h-4" />}
          className="sm:max-w-sm"
        />
        <div className="flex gap-1.5 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                statusFilter === f.value
                  ? "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/30"
                  : "bg-[#21262D] text-[#8B949E] border-[#30363D] hover:border-[#8B949E]/40 hover:text-[#F0F6FC]"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-[#8B949E]">
                ({statusCounts[f.value]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#30363D] bg-[#1C2128]/50">
                {["Trip ID", "Route", "Vendor", "Vehicle", "Fare", "Status", "Contacts", "Date", "Premium"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-[#8B949E]">
                    No trips found.
                  </td>
                </tr>
              ) : (
                paginated.map((trip) => (
                  <tr
                    key={trip.id}
                    className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-[#8B949E] font-mono">{trip.id.toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#F0F6FC] whitespace-nowrap">
                        {trip.fromCity} → {trip.toCity}
                      </p>
                      <p className="text-xs text-[#8B949E]">{trip.fromState}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[#F0F6FC] whitespace-nowrap">{trip.vendorName}</p>
                      <p className="text-xs text-[#8B949E]">{trip.vendorCity}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{trip.vehicleType}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#F0F6FC]">
                      {formatCurrency(trip.estimatedFare)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={trip.status as "open" | "closed" | "cancelled" | "completed"}
                        dot
                      >
                        {trip.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm text-[#F0F6FC]">
                        <Phone className="w-3.5 h-3.5 text-[#8B949E]" />
                        {trip.contactsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">
                      {formatDate(trip.departureDate)}
                    </td>
                    <td className="px-4 py-3">
                      {trip.isPremiumRequired ? (
                        <Badge variant="premium">Premium</Badge>
                      ) : (
                        <span className="text-xs text-[#8B949E]">Free</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#30363D]">
            <p className="text-xs text-[#8B949E]">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1.5">
              <Button variant="secondary" size="xs" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    p === page ? "bg-[#F5A623] text-[#0D1117]" : "bg-[#21262D] text-[#8B949E] hover:text-[#F0F6FC]"
                  }`}
                >
                  {p}
                </button>
              ))}
              <Button variant="secondary" size="xs" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
