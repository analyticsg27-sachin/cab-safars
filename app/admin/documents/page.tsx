"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText, Eye, ThumbsUp, ThumbsDown, RefreshCw, AlertCircle,
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  Users, Car, Search, X, FolderOpen, MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminService from "@/lib/services/admin.service";
import type { UserDocument, PendingRegistration } from "@/lib/services/admin.service";
import { formatDate } from "@/lib/utils";

type DocFilter = "needs_review" | "has_issues" | "all";

function DocStatusBadge({ status }: { status: string }) {
  const cfg = {
    approved: { bg: "rgba(34,197,94,0.12)", color: "#22C55E", label: "Approved" },
    rejected:  { bg: "rgba(239,68,68,0.12)",  color: "#EF4444", label: "Rejected"  },
    pending:   { bg: "rgba(245,166,35,0.12)", color: "#F5A623", label: "Pending"   },
  }[status] ?? { bg: "rgba(139,148,158,0.12)", color: "#8B949E", label: status };
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

function DocSummaryChips({ docs }: { docs: UserDocument[] }) {
  const pending  = docs.filter(d => d.status === "pending").length;
  const approved = docs.filter(d => d.status === "approved").length;
  const rejected = docs.filter(d => d.status === "rejected").length;
  return (
    <div className="flex flex-wrap gap-1.5">
      {pending > 0 && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(245,166,35,0.12)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.25)" }}>
          {pending} pending
        </span>
      )}
      {rejected > 0 && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }}>
          {rejected} rejected
        </span>
      )}
      {approved > 0 && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.25)" }}>
          {approved} approved
        </span>
      )}
      {docs.length === 0 && (
        <span className="text-[10px] text-[#374151]">No documents uploaded</span>
      )}
    </div>
  );
}

interface RejectDocModalProps {
  doc: UserDocument;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}

function RejectDocModal({ doc, onConfirm, onCancel, loading }: RejectDocModalProps) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C2128] border border-[#30363D] rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#F0F6FC]">Reject Document</h3>
            <p className="text-xs text-[#8B949E]">{doc.document_type}</p>
          </div>
        </div>
        <p className="text-xs text-[#8B949E] mb-3">
          Provide a reason so the user knows what to fix and re-upload.
        </p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Document is blurry, please re-upload a clearer photo"
          rows={3}
          className="w-full rounded-xl px-3 py-2.5 text-sm text-[#F0F6FC] placeholder-[#374151] resize-none outline-none focus:border-[#EF4444]/50 transition-colors"
          style={{ background: "#0D1117", border: "1px solid #30363D" }}
        />
        <div className="flex gap-2 mt-4">
          <Button variant="danger" size="sm" className="flex-1"
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={loading || !reason.trim()}>
            {loading ? "Rejecting…" : "Reject Document"}
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

interface DocumentsPanelProps {
  user: PendingRegistration;
  onDocsChange?: () => void;
}

function DocumentsPanel({ user, onDocsChange }: DocumentsPanelProps) {
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingDoc, setRejectingDoc] = useState<UserDocument | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [toast, setToast] = useState("");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  useEffect(() => {
    setLoading(true);
    AdminService.getUserDocuments(user.id)
      .then(setDocs)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [user.id]);

  async function handleApprove(docId: string) {
    setApprovingId(docId);
    try {
      await AdminService.approveDocument(docId);
      setDocs(prev => prev.map(d => d.id === docId ? { ...d, status: "approved" as const } : d));
      showToast("Document approved");
      onDocsChange?.();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Action failed");
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject(reason: string) {
    if (!rejectingDoc) return;
    setRejectLoading(true);
    try {
      await AdminService.rejectDocument(rejectingDoc.id, reason);
      setDocs(prev => prev.map(d =>
        d.id === rejectingDoc.id
          ? { ...d, status: "rejected" as const, rejection_reason: reason }
          : d
      ));
      showToast("Document rejected — user will be notified");
      setRejectingDoc(null);
      onDocsChange?.();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Action failed");
    } finally {
      setRejectLoading(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <div className="w-5 h-5 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <p className="text-xs text-[#EF4444] py-4 text-center">{error}</p>
  );

  if (docs.length === 0) return (
    <div className="flex flex-col items-center py-8 gap-2 text-center">
      <FolderOpen className="w-8 h-8 text-[#30363D]" />
      <p className="text-sm text-[#8B949E]">No documents uploaded yet</p>
      <p className="text-xs text-[#374151]">
        {user.name} hasn&apos;t submitted any documents.
        {user.status === "approved" && " They have been notified to upload."}
      </p>
    </div>
  );

  return (
    <>
      {rejectingDoc && (
        <RejectDocModal
          doc={rejectingDoc}
          onConfirm={handleReject}
          onCancel={() => setRejectingDoc(null)}
          loading={rejectLoading}
        />
      )}
      <div className="flex flex-col gap-2">
        {toast && (
          <div className="px-3 py-2 rounded-lg text-xs font-medium text-[#0D1117] bg-[#22C55E]">{toast}</div>
        )}
        {docs.map(doc => (
          <div key={doc.id} className="rounded-xl overflow-hidden"
            style={{ background: "#0D1117", border: "1px solid #30363D" }}>
            <div className="flex items-center gap-3 p-3">
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(245,166,35,0.08)" }}>
                <FileText className="w-4 h-4 text-[#F5A623]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#F0F6FC] truncate">{doc.document_type}</p>
                <p className="text-[10px] text-[#8B949E] truncate">
                  {doc.original_name ?? "Document"}
                  {doc.file_size ? ` · ${Math.round(doc.file_size / 1024)} KB` : ""}
                </p>
                <p className="text-[10px] text-[#374151]">{formatDate(doc.created_at)}</p>
              </div>

              {/* Status badge */}
              <DocStatusBadge status={doc.status} />

              {/* Actions */}
              <div className="flex gap-1 shrink-0">
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-lg"
                    style={{ background: "rgba(45,107,228,0.12)", border: "1px solid rgba(45,107,228,0.3)" }}
                    title="View document">
                    <Eye className="w-3.5 h-3.5 text-[#2D6BE4]" />
                  </a>
                )}
                {doc.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(doc.id)}
                      disabled={approvingId === doc.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-50"
                      style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}
                      title="Approve">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#22C55E]" />
                    </button>
                    <button
                      onClick={() => setRejectingDoc(doc)}
                      disabled={approvingId === doc.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-50"
                      style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
                      title="Reject">
                      <ThumbsDown className="w-3.5 h-3.5 text-[#EF4444]" />
                    </button>
                  </>
                )}
                {/* Re-review rejected doc */}
                {doc.status === "rejected" && (
                  <button
                    onClick={() => handleApprove(doc.id)}
                    disabled={approvingId === doc.id}
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-all disabled:opacity-50"
                    style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)" }}
                    title="Approve now">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#22C55E]" />
                  </button>
                )}
              </div>
            </div>

            {/* Rejection reason shown below */}
            {doc.rejection_reason && (
              <div className="px-3 pb-3">
                <div className="flex items-start gap-2 px-3 py-2 rounded-lg"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
                  <MessageSquare className="w-3.5 h-3.5 text-[#EF4444] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#EF4444]">{doc.rejection_reason}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default function DocumentsPage() {
  const [users, setUsers] = useState<PendingRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<DocFilter>("needs_review");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [docCounts, setDocCounts] = useState<Record<string, { pending: number; rejected: number; approved: number }>>({});
  const [toast, setToast] = useState("");

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Get approved users (registration done) — they can upload docs
      const res = await AdminService.getUsers({ status: "approved" });
      setUsers((res.data as unknown as PendingRegistration[]) ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDocCounts(userId: string, pending: number, rejected: number, approved: number) {
    setDocCounts(prev => ({ ...prev, [userId]: { pending, rejected, approved } }));
  }
  void handleDocCounts; // used via context — suppress lint

  const filtered = users.filter(u => {
    const matchSearch = search.trim() === ""
      || u.name.toLowerCase().includes(search.toLowerCase())
      || u.phone.includes(search);
    const counts = docCounts[u.id];
    if (filter === "needs_review") return matchSearch && (!counts || counts.pending > 0);
    if (filter === "has_issues")   return matchSearch && (counts?.rejected ?? 0) > 0;
    return matchSearch;
  });

  const tabCfg: { key: DocFilter; label: string; icon: React.ReactNode }[] = [
    { key: "needs_review", label: "Needs Review",  icon: <Clock className="w-3.5 h-3.5" /> },
    { key: "has_issues",   label: "Has Issues",    icon: <AlertCircle className="w-3.5 h-3.5" /> },
    { key: "all",          label: "All Users",     icon: <FolderOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-[#0D1117] bg-[#22C55E] shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F0F6FC]">Documents</h1>
          <p className="text-sm text-[#8B949E] mt-0.5">
            Review and verify documents uploaded by registered users
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="p-2 rounded-lg text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] transition-colors"
          title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filter tabs + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "#161B22", border: "1px solid #30363D" }}>
          {tabCfg.map(t => (
            <button key={t.key}
              onClick={() => setFilter(t.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={filter === t.key
                ? { background: "rgba(245,166,35,0.12)", color: "#F5A623", border: "1px solid rgba(245,166,35,0.25)" }
                : { color: "#8B949E", border: "1px solid transparent" }}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 rounded-xl"
          style={{ background: "#161B22", border: "1px solid #30363D" }}>
          <Search className="w-3.5 h-3.5 text-[#374151] shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone…"
            className="flex-1 bg-transparent py-2.5 text-sm text-[#F0F6FC] placeholder-[#374151] outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="w-3.5 h-3.5 text-[#374151] hover:text-[#8B949E]" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#8B949E]">Loading users…</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-[#EF4444]" />
            <p className="text-sm text-[#EF4444]">{error}</p>
            <button onClick={fetchUsers} className="text-xs text-[#F5A623] underline">Retry</button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[#22C55E]" />
          </div>
          <h3 className="text-base font-semibold text-[#F0F6FC] mb-1">
            {filter === "needs_review" ? "All documents reviewed!" : "Nothing here"}
          </h3>
          <p className="text-sm text-[#8B949E]">
            {filter === "needs_review"
              ? "No pending documents waiting for review."
              : "No users match this filter."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(user => (
            <div key={user.id} className="bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden">
              {/* User row */}
              <button
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-[#1C2128] transition-colors"
                onClick={() => toggleExpand(user.id)}>
                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl bg-[#21262D] flex items-center justify-center text-[#8B949E] font-bold text-lg shrink-0">
                  {user.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#F0F6FC]">{user.name}</span>
                    <Badge variant={user.role === "driver" ? "driver" : "vendor"}>
                      {user.role === "driver"
                        ? <><Car className="w-3 h-3" /> Driver</>
                        : <><Users className="w-3 h-3" /> Trip Provider</>}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#8B949E]">{user.phone}{user.city ? ` · ${user.city}` : ""}</p>
                  {/* Doc summary chips - only if we have counts loaded */}
                  {docCounts[user.id] !== undefined ? (
                    <div className="mt-1.5">
                      <DocSummaryChips docs={
                        [
                          ...Array(docCounts[user.id].pending).fill({ status: "pending" }),
                          ...Array(docCounts[user.id].rejected).fill({ status: "rejected" }),
                          ...Array(docCounts[user.id].approved).fill({ status: "approved" }),
                        ] as UserDocument[]
                      } />
                    </div>
                  ) : null}
                </div>

                {expanded.has(user.id)
                  ? <ChevronUp className="w-4 h-4 text-[#8B949E] shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-[#8B949E] shrink-0" />}
              </button>

              {/* Docs panel */}
              {expanded.has(user.id) && (
                <div className="px-5 pb-5 pt-1" style={{ borderTop: "1px solid #30363D" }}>
                  <DocumentsPanel
                    user={user}
                    onDocsChange={() => showToast("Document updated")}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
