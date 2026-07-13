"use client";

import { useState, useMemo } from "react";
import { Search, CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockDrivers } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Status } from "@/lib/types";

const PAGE_SIZE = 8;

const statusFilters: Array<{ label: string; value: Status | "all" }> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

export default function DriversPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockDrivers.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.email.toLowerCase().includes(search.toLowerCase()) ||
        d.city.toLowerCase().includes(search.toLowerCase()) ||
        d.vehicleNumber.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-[#F0F6FC]">Drivers</h1>
        <p className="text-sm text-[#8B949E] mt-0.5">{mockDrivers.length} registered drivers</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by name, email, city, vehicle no..."
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
                {["ID", "Name", "City", "Vehicle", "Status", "Plan", "Trips Done", "Rating", "Registered", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-[#8B949E] font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-[#8B949E]">
                    No drivers found.
                  </td>
                </tr>
              ) : (
                paginated.map((driver) => (
                  <tr
                    key={driver.id}
                    className="border-b border-[#30363D]/50 hover:bg-[#1C2128]/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-[#8B949E] font-mono">{driver.id.toUpperCase()}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#F0F6FC]">{driver.name}</p>
                        <p className="text-xs text-[#8B949E]">{driver.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B949E] whitespace-nowrap">{driver.city}</td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-[#F0F6FC] whitespace-nowrap">{driver.vehicleType}</p>
                      <p className="text-xs text-[#8B949E]">{driver.vehicleNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={driver.status as "active" | "pending" | "suspended"} dot>
                        {driver.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={driver.subscriptionPlan === "premium" ? "premium" : "free"}>
                        {driver.subscriptionPlan}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#F0F6FC]">{driver.tripsCompleted}</td>
                    <td className="px-4 py-3 text-sm text-[#F0F6FC]">
                      {driver.rating > 0 ? (
                        <span className="flex items-center gap-1">
                          <span className="text-[#F5A623]">★</span>
                          {driver.rating}
                        </span>
                      ) : (
                        <span className="text-[#8B949E]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">
                      {formatDate(driver.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Button variant="ghost" size="xs">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {driver.status === "pending" && (
                          <Button variant="success" size="xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        {driver.status === "active" && (
                          <Button variant="danger" size="xs">
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
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
