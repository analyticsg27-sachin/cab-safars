"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Car, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPendingApprovals } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Driver, Vendor } from "@/lib/types";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState(mockPendingApprovals);
  const [confirming, setConfirming] = useState<{ id: string; action: "approve" | "reject" } | null>(null);

  const handleAction = (id: string, action: "approve" | "reject") => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    setConfirming(null);
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Pending Approvals</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">
            Review and approve new vendor and driver registrations
          </p>
        </div>
        <span className="text-sm font-semibold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full px-3 py-1">
          {approvals.length} pending
        </span>
      </div>

      {/* Confirmation dialog */}
      {confirming && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-semibold text-[#F0F6FC] mb-2">
              Confirm {confirming.action === "approve" ? "Approval" : "Rejection"}
            </h3>
            <p className="text-sm text-[#8B949E] mb-6">
              Are you sure you want to {confirming.action} this registration?
              {confirming.action === "reject" && " The user will be notified."}
            </p>
            <div className="flex gap-2">
              <Button
                variant={confirming.action === "approve" ? "success" : "danger"}
                size="sm"
                className="flex-1"
                onClick={() => handleAction(confirming.id, confirming.action)}
              >
                {confirming.action === "approve" ? "Yes, Approve" : "Yes, Reject"}
              </Button>
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => setConfirming(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {approvals.length === 0 ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[#22C55E]" />
          </div>
          <h3 className="text-base font-semibold text-[#F0F6FC] mb-1">All caught up!</h3>
          <p className="text-sm text-[#8B949E]">No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {approvals.map((user) => {
            const isDriver = user.role === "driver";
            const driver = isDriver ? (user as Driver) : null;
            const vendor = !isDriver ? (user as Vendor) : null;

            return (
              <div
                key={user.id}
                className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 hover:border-[#30363D]/60 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Avatar + basic info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#21262D] flex items-center justify-center text-[#8B949E] font-bold text-lg shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-[#F0F6FC]">{user.name}</h3>
                        <Badge variant={isDriver ? "driver" : "vendor"}>
                          {isDriver ? (
                            <><Car className="w-3 h-3" /> Driver</>
                          ) : (
                            <><Users className="w-3 h-3" /> Vendor</>
                          )}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-1.5 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <Mail className="w-3.5 h-3.5 shrink-0" /> {user.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <Phone className="w-3.5 h-3.5 shrink-0" /> {user.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <MapPin className="w-3.5 h-3.5 shrink-0" /> {user.city}, {user.state}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-[#8B949E]">
                          <Clock className="w-3.5 h-3.5 shrink-0" /> Registered {formatDate(user.createdAt)}
                        </span>
                      </div>

                      {/* Role-specific details */}
                      {driver && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                            Vehicle: {driver.vehicleType}
                          </span>
                          <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                            Reg: {driver.vehicleNumber}
                          </span>
                          <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                            License: {driver.licenseNumber}
                          </span>
                        </div>
                      )}
                      {vendor && vendor.companyName && (
                        <div className="mt-3">
                          <span className="text-xs bg-[#21262D] border border-[#30363D] rounded-lg px-2.5 py-1 text-[#8B949E]">
                            Company: {vendor.companyName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 sm:flex-col shrink-0">
                    <Button
                      variant="success"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => setConfirming({ id: user.id, action: "approve" })}
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1 sm:flex-none"
                      onClick={() => setConfirming({ id: user.id, action: "reject" })}
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
