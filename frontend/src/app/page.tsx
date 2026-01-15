"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8001";
const SPRINT_LABEL = "Sprint-06";
const SPRINT_TAGLINE =
  "Notification preferences, templates, and audit-ready delivery logs.";

type Member = {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  masked_ssn: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  status: string;
  identity_status: string;
  identity_attempts: number;
  identity_last_checked?: string | null;
  identity_notes?: string | null;
  eligibility_status: string;
  eligibility_code?: string | null;
  eligibility_attempts: number;
  eligibility_last_checked?: string | null;
  eligibility_notes?: string | null;
  email_opt_in: boolean;
  sms_opt_in: boolean;
  created_at: string;
  updated_at: string;
};

type IdentityAudit = {
  id: string;
  member_id: string;
  result: string;
  reason: string;
  created_at: string;
};

type EligibilityAudit = {
  id: string;
  member_id: string;
  result: string;
  code: string;
  reason: string;
  created_at: string;
};

type Plan = {
  id: string;
  name: string;
  tier: string;
  premium: number;
  deductible: number;
  oop_max: number;
  coverage_summary: string;
  network: string;
  active: boolean;
};

type DocumentItem = {
  id: string;
  member_id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
};

type NotificationAudit = {
  id: string;
  member_id: string;
  channel: string;
  template_id: string;
  status: string;
  message: string;
  created_at: string;
};

type MemberForm = {
  first_name: string;
  last_name: string;
  dob: string;
  ssn: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  zip_code: string;
};

const emptyForm: MemberForm = {
  first_name: "",
  last_name: "",
  dob: "",
  ssn: "",
  email: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  zip_code: "",
};

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberForm>(emptyForm);
  const [maskedSSN, setMaskedSSN] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingIdentity, setIsCheckingIdentity] = useState(false);
  const [identityAudits, setIdentityAudits] = useState<IdentityAudit[]>([]);
  const [identityMessage, setIdentityMessage] = useState<string | null>(null);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [eligibilityAudits, setEligibilityAudits] = useState<EligibilityAudit[]>([]);
  const [eligibilityMessage, setEligibilityMessage] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planFilter, setPlanFilter] = useState<string>("All");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [comparePlanIds, setComparePlanIds] = useState<string[]>([]);
  const [planMessage, setPlanMessage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationAudit[]>([]);
  const [isSendingNotice, setIsSendingNotice] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedMember = useMemo(
    () => members.find((m) => m.id === selectedId) || null,
    [members, selectedId]
  );

  const planTiers = useMemo(() => {
    const tiers = Array.from(new Set(plans.map((plan) => plan.tier)));
    return ["All", ...tiers];
  }, [plans]);

  const filteredPlans = useMemo(() => {
    if (planFilter === "All") return plans;
    return plans.filter((plan) => plan.tier === planFilter);
  }, [plans, planFilter]);

  const comparePlans = useMemo(() => {
    return comparePlanIds
      .map((id) => plans.find((plan) => plan.id === id))
      .filter(Boolean) as Plan[];
  }, [comparePlanIds, plans]);

  const loadMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/members`);
      if (!res.ok) throw new Error("Failed to load members");
      const data = (await res.json()) as Member[];
      setMembers(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadIdentityAudit = async (memberId: string) => {
    try {
      const res = await fetch(`${API_BASE}/members/${memberId}/identity-audit`);
      if (!res.ok) throw new Error("Failed to load identity audit");
      const data = (await res.json()) as IdentityAudit[];
      setIdentityAudits(data);
    } catch (err) {
      setIdentityAudits([]);
      setError(String(err));
    }
  };

  const loadEligibilityAudit = async (memberId: string) => {
    try {
      const res = await fetch(`${API_BASE}/members/${memberId}/eligibility-audit`);
      if (!res.ok) throw new Error("Failed to load eligibility audit");
      const data = (await res.json()) as EligibilityAudit[];
      setEligibilityAudits(data);
    } catch (err) {
      setEligibilityAudits([]);
      setError(String(err));
    }
  };

  const loadPlans = async () => {
    try {
      const res = await fetch(`${API_BASE}/plans`);
      if (!res.ok) throw new Error("Failed to load plans");
      const data = (await res.json()) as Plan[];
      setPlans(data);
    } catch (err) {
      setError(String(err));
    }
  };

  const loadMemberPlan = async (memberId: string) => {
    try {
      const res = await fetch(`${API_BASE}/members/${memberId}/plan`);
      if (!res.ok) throw new Error("Failed to load member plan");
      const data = (await res.json()) as { plan_id: string } | null;
      setSelectedPlanId(data?.plan_id || null);
    } catch (err) {
      setSelectedPlanId(null);
      setError(String(err));
    }
  };

  const loadDocuments = async (memberId: string) => {
    try {
      const res = await fetch(`${API_BASE}/members/${memberId}/documents`);
      if (!res.ok) throw new Error("Failed to load documents");
      const data = (await res.json()) as DocumentItem[];
      setDocuments(data);
    } catch (err) {
      setDocuments([]);
      setError(String(err));
    }
  };

  const loadNotifications = async (memberId: string) => {
    try {
      const res = await fetch(`${API_BASE}/members/${memberId}/notifications`);
      if (!res.ok) throw new Error("Failed to load notifications");
      const data = (await res.json()) as NotificationAudit[];
      setNotifications(data);
    } catch (err) {
      setNotifications([]);
      setError(String(err));
    }
  };

  useEffect(() => {
    loadMembers();
    loadPlans();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadIdentityAudit(selectedId);
      loadEligibilityAudit(selectedId);
      loadMemberPlan(selectedId);
      loadDocuments(selectedId);
      loadNotifications(selectedId);
    } else {
      setIdentityAudits([]);
      setEligibilityAudits([]);
      setSelectedPlanId(null);
      setDocuments([]);
      setNotifications([]);
    }
  }, [selectedId]);

  const handleSelect = (member: Member) => {
    setSelectedId(member.id);
    setForm({
      first_name: member.first_name,
      last_name: member.last_name,
      dob: member.dob,
      ssn: "",
      email: member.email,
      phone: member.phone,
      address_line1: member.address_line1,
      address_line2: member.address_line2 || "",
      city: member.city,
      state: member.state,
      zip_code: member.zip_code,
    });
    setMaskedSSN(member.masked_ssn);
    setIdentityMessage(null);
    setEligibilityMessage(null);
    setPlanMessage(null);
    setComparePlanIds([]);
    setDocuments([]);
    setNotifications([]);
    setNoticeMessage(null);
  };

  const handleChange = (key: keyof MemberForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTogglePreference = async (field: "email_opt_in" | "sms_opt_in", value: boolean) => {
    if (!selectedMember) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/members/${selectedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to update preferences");
      await loadMembers();
    } catch (err) {
      setError(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleNew = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setMaskedSSN("");
    setIdentityMessage(null);
    setEligibilityMessage(null);
    setPlanMessage(null);
    setComparePlanIds([]);
    setDocuments([]);
    setNotifications([]);
    setNoticeMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      if (selectedMember) {
        const payload: Partial<MemberForm> & { status?: string } = {
          ...form,
          status: "DRAFT",
        };
        if (!payload.ssn) {
          delete payload.ssn;
        }
        const res = await fetch(`${API_BASE}/members/${selectedMember.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update member");
      } else {
        const res = await fetch(`${API_BASE}/members`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to create member");
      }
      await loadMembers();
      handleNew();
    } catch (err) {
      setError(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/members/${selectedMember.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete member");
      await loadMembers();
      handleNew();
    } catch (err) {
      setError(String(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleIdentityCheck = async () => {
    if (!selectedMember) return;
    const memberId = selectedMember.id;
    setIsCheckingIdentity(true);
    setError(null);
    setIdentityMessage(null);
    try {
      const res = await fetch(`${API_BASE}/members/${memberId}/identity-check`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Identity check failed");
      const data = (await res.json()) as { status: string; attempts: number; reason: string };
      setIdentityMessage(`${data.status}: ${data.reason} (attempts: ${data.attempts})`);
      await loadMembers();
      await loadIdentityAudit(memberId);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsCheckingIdentity(false);
    }
  };

  const handleEligibilityCheck = async () => {
    if (!selectedMember) return;
    const memberId = selectedMember.id;
    setIsCheckingEligibility(true);
    setError(null);
    setEligibilityMessage(null);
    try {
      const res = await fetch(`${API_BASE}/members/${memberId}/eligibility-check`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Eligibility check failed");
      const data = (await res.json()) as { status: string; code: string; attempts: number; reason: string };
      setEligibilityMessage(`${data.status} ${data.code}: ${data.reason} (attempts: ${data.attempts})`);
      await loadMembers();
      await loadEligibilityAudit(memberId);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handlePlanSelect = async (planId: string) => {
    if (!selectedMember) return;
    setError(null);
    setPlanMessage(null);
    try {
      const res = await fetch(`${API_BASE}/members/${selectedMember.id}/plan?plan_id=${planId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Plan selection failed");
      setSelectedPlanId(planId);
      setPlanMessage("Plan selection saved.");
    } catch (err) {
      setError(String(err));
    }
  };

  const toggleCompare = (planId: string) => {
    setComparePlanIds((prev) => {
      if (prev.includes(planId)) {
        return prev.filter((id) => id !== planId);
      }
      if (prev.length >= 2) {
        return prev;
      }
      return [...prev, planId];
    });
  };

  const handleDocumentUpload = async (file: File) => {
    if (!selectedMember) return;
    setIsUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/members/${selectedMember.id}/documents`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Document upload failed");
      await loadDocuments(selectedMember.id);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleNoticeSend = async (templateId: string, channel: "email" | "sms") => {
    if (!selectedMember) return;
    setIsSendingNotice(true);
    setError(null);
    setNoticeMessage(null);
    try {
      const planName = plans.find((plan) => plan.id === selectedPlanId)?.name || "Selected Plan";
      const payload = {
        channel,
        template_id: templateId,
        variables: {
          first_name: selectedMember.first_name,
          plan_name: planName,
          filename: documents[0]?.filename || "uploaded file",
        },
      };
      const res = await fetch(`${API_BASE}/members/${selectedMember.id}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Notification send failed");
      setNoticeMessage("Notification sent.");
      await loadNotifications(selectedMember.id);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsSendingNotice(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 lg:px-14">
      <header className="mb-10 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          Member Enrollment Platform
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--foreground)] lg:text-4xl">
              {SPRINT_LABEL} Intake Studio
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">
              {SPRINT_TAGLINE}
            </p>
          </div>
          <div className="rounded-full border border-black/10 bg-[var(--surface)] px-4 py-2 text-xs text-[var(--ink-muted)] shadow-sm">
            API: {API_BASE}
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl bg-[var(--surface)] p-5 shadow-[0_20px_60px_rgba(15,118,110,0.08)]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Member Drafts</h2>
            <button
              onClick={handleNew}
              className="rounded-full border border-[var(--accent)]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]"
            >
              New
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {isLoading && <p className="text-xs text-[var(--ink-muted)]">Loading members...</p>}
            {!isLoading && members.length === 0 && (
              <p className="text-xs text-[var(--ink-muted)]">No drafts yet. Create the first profile.</p>
            )}
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => handleSelect(member)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedId === member.id
                    ? "border-[var(--accent)] bg-[var(--surface-muted)]"
                    : "border-transparent bg-white/70 hover:border-[var(--accent)]/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    {member.first_name} {member.last_name}
                  </span>
                  <span className="rounded-full bg-[var(--accent)]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                    {member.status}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[var(--ink-muted)]">{member.masked_ssn}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                  Updated {new Date(member.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-3xl bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-2 border-b border-black/5 pb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Applicant Profile</h2>
            <p className="text-xs text-[var(--ink-muted)]">
              {selectedMember ? "Editing draft profile." : "Create a new draft profile."}
            </p>
            {maskedSSN && (
              <div className="text-xs text-[var(--accent)]">Masked SSN on file: {maskedSSN}</div>
            )}
          </div>

          {selectedMember && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-[var(--surface-muted)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                      Identity Status
                    </p>
                    <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                      {selectedMember.identity_status}
                    </div>
                    <div className="text-xs text-[var(--ink-muted)]">
                      Attempts: {selectedMember.identity_attempts}
                    </div>
                    {selectedMember.identity_last_checked && (
                      <div className="text-xs text-[var(--ink-muted)]">
                        Last checked: {new Date(selectedMember.identity_last_checked).toLocaleString()}
                      </div>
                    )}
                    {selectedMember.identity_notes && (
                      <div className="text-xs text-[var(--ink-muted)]">
                        Notes: {selectedMember.identity_notes}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleIdentityCheck}
                    disabled={isCheckingIdentity}
                    className="rounded-full border border-[var(--accent)]/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] disabled:opacity-60"
                  >
                    {isCheckingIdentity ? "Checking..." : "Run Identity Check"}
                  </button>
                </div>
                {identityMessage && (
                  <div className="mt-3 text-xs text-[var(--accent-2)]">{identityMessage}</div>
                )}
                <div className="mt-4 rounded-xl border border-black/10 bg-white/70 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    Identity Audit
                  </p>
                  {identityAudits.length === 0 ? (
                    <p className="mt-2 text-xs text-[var(--ink-muted)]">No checks logged yet.</p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-xs text-[var(--foreground)]">
                      {identityAudits.slice(0, 4).map((audit) => (
                        <li key={audit.id} className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-semibold">{audit.result}</span>
                            <span className="text-[var(--ink-muted)]"> — {audit.reason}</span>
                          </div>
                          <span className="text-[10px] text-[var(--ink-muted)]">
                            {new Date(audit.created_at).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-black/5 bg-[var(--surface-muted)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                      Eligibility Status
                    </p>
                    <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                      {selectedMember.eligibility_status}
                    </div>
                    <div className="text-xs text-[var(--ink-muted)]">
                      Code: {selectedMember.eligibility_code || "—"}
                    </div>
                    <div className="text-xs text-[var(--ink-muted)]">
                      Attempts: {selectedMember.eligibility_attempts}
                    </div>
                    {selectedMember.eligibility_last_checked && (
                      <div className="text-xs text-[var(--ink-muted)]">
                        Last checked: {new Date(selectedMember.eligibility_last_checked).toLocaleString()}
                      </div>
                    )}
                    {selectedMember.eligibility_notes && (
                      <div className="text-xs text-[var(--ink-muted)]">
                        Notes: {selectedMember.eligibility_notes}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEligibilityCheck}
                    disabled={isCheckingEligibility}
                    className="rounded-full border border-[var(--accent)]/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)] disabled:opacity-60"
                  >
                    {isCheckingEligibility ? "Checking..." : "Run Eligibility Check"}
                  </button>
                </div>
                {eligibilityMessage && (
                  <div className="mt-3 text-xs text-[var(--accent-2)]">{eligibilityMessage}</div>
                )}
                <div className="mt-4 rounded-xl border border-black/10 bg-white/70 p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    Eligibility Audit
                  </p>
                  {eligibilityAudits.length === 0 ? (
                    <p className="mt-2 text-xs text-[var(--ink-muted)]">No checks logged yet.</p>
                  ) : (
                    <ul className="mt-2 space-y-2 text-xs text-[var(--foreground)]">
                      {eligibilityAudits.slice(0, 4).map((audit) => (
                        <li key={audit.id} className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-semibold">{audit.result}</span>
                            <span className="text-[var(--ink-muted)]"> — {audit.code}</span>
                            <span className="text-[var(--ink-muted)]"> — {audit.reason}</span>
                          </div>
                          <span className="text-[10px] text-[var(--ink-muted)]">
                            {new Date(audit.created_at).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-3xl border border-black/5 bg-white/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Plan Catalog
                </p>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Plan Selection</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {planTiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setPlanFilter(tier)}
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      planFilter === tier
                        ? "bg-[var(--accent)] text-white"
                        : "border border-black/10 text-[var(--ink-muted)]"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {planMessage && (
              <div className="mt-3 text-xs text-[var(--accent-2)]">{planMessage}</div>
            )}

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-4 transition ${
                    selectedPlanId === plan.id
                      ? "border-[var(--accent)] bg-[var(--surface-muted)]"
                      : "border-black/10 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">{plan.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                        {plan.tier} • {plan.network}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--accent)]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                      ${plan.premium.toFixed(0)}/mo
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-[var(--ink-muted)]">{plan.coverage_summary}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--foreground)]">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">Deductible</p>
                      <p>${plan.deductible.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">OOP Max</p>
                      <p>${plan.oop_max.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handlePlanSelect(plan.id)}
                      disabled={!selectedMember}
                      className="rounded-full bg-[var(--accent)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-60"
                    >
                      Select Plan
                    </button>
                    <button
                      onClick={() => toggleCompare(plan.id)}
                      className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        comparePlanIds.includes(plan.id)
                          ? "border-[var(--accent)] text-[var(--accent)]"
                          : "border-black/10 text-[var(--ink-muted)]"
                      }`}
                    >
                      {comparePlanIds.includes(plan.id) ? "Selected" : "Compare"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {comparePlans.length === 2 && (
              <div className="mt-6 rounded-2xl border border-black/10 bg-[var(--surface-muted)] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Plan Comparison
                </p>
                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  {comparePlans.map((plan) => (
                    <div key={plan.id} className="rounded-xl border border-black/10 bg-white/70 p-4">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{plan.name}</p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                        {plan.tier} • {plan.network}
                      </p>
                      <ul className="mt-3 space-y-2 text-xs text-[var(--foreground)]">
                        <li>Premium: ${plan.premium.toFixed(0)}/mo</li>
                        <li>Deductible: ${plan.deductible.toFixed(0)}</li>
                        <li>OOP Max: ${plan.oop_max.toFixed(0)}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-black/5 bg-white/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Document Uploads
                </p>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Member Documents</h3>
              </div>
              <label className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                <input
                  type="file"
                  className="hidden"
                  disabled={!selectedMember || isUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      handleDocumentUpload(file);
                      event.currentTarget.value = "";
                    }
                  }}
                />
                {isUploading ? "Uploading..." : "Upload Document"}
              </label>
            </div>
            {!selectedMember && (
              <p className="mt-3 text-xs text-[var(--ink-muted)]">
                Select a member to upload documents.
              </p>
            )}
            {selectedMember && (
              <div className="mt-4 space-y-2">
                {documents.length === 0 ? (
                  <p className="text-xs text-[var(--ink-muted)]">No documents uploaded yet.</p>
                ) : (
                  documents.slice(0, 5).map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{doc.filename}</p>
                        <p className="text-[var(--ink-muted)]">
                          {doc.content_type} • {(doc.size_bytes / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <span className="text-[10px] text-[var(--ink-muted)]">
                        {new Date(doc.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {selectedMember && (
            <div className="mt-6 rounded-3xl border border-black/5 bg-white/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    Notification Preferences
                  </p>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Email and SMS</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                    Auto-save enabled
                  </span>
                </div>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    checked={selectedMember.email_opt_in}
                    onChange={(event) => handleTogglePreference("email_opt_in", event.target.checked)}
                    className="h-4 w-4 rounded border-gray-400 text-[var(--accent)]"
                  />
                  Email opt-in for confirmations
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-xs text-[var(--foreground)]">
                  <input
                    type="checkbox"
                    checked={selectedMember.sms_opt_in}
                    onChange={(event) => handleTogglePreference("sms_opt_in", event.target.checked)}
                    className="h-4 w-4 rounded border-gray-400 text-[var(--accent)]"
                  />
                  SMS opt-in for alerts
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => handleNoticeSend("ENROLL_CONFIRM", "email")}
                  disabled={isSendingNotice}
                  className="rounded-full bg-[var(--accent)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-60"
                >
                  Send Email
                </button>
                <button
                  onClick={() => handleNoticeSend("DOC_RECEIVED", "sms")}
                  disabled={isSendingNotice}
                  className="rounded-full border border-black/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)] disabled:opacity-60"
                >
                  Send SMS
                </button>
                {noticeMessage && (
                  <span className="text-xs text-[var(--accent-2)]">{noticeMessage}</span>
                )}
              </div>
              <div className="mt-4 rounded-2xl border border-black/10 bg-[var(--surface-muted)] p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)]">
                  Notification Audit
                </p>
                {notifications.length === 0 ? (
                  <p className="mt-2 text-xs text-[var(--ink-muted)]">No notifications sent yet.</p>
                ) : (
                  <ul className="mt-2 space-y-2 text-xs text-[var(--foreground)]">
                    {notifications.slice(0, 4).map((notice) => (
                      <li key={notice.id} className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-semibold">{notice.channel.toUpperCase()}</span>
                          <span className="text-[var(--ink-muted)]"> — {notice.template_id}</span>
                          <span className="text-[var(--ink-muted)]"> — {notice.status}</span>
                        </div>
                        <span className="text-[10px] text-[var(--ink-muted)]">
                          {new Date(notice.created_at).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Input label="First Name" value={form.first_name} onChange={(v) => handleChange("first_name", v)} />
            <Input label="Last Name" value={form.last_name} onChange={(v) => handleChange("last_name", v)} />
            <Input label="Date of Birth" value={form.dob} onChange={(v) => handleChange("dob", v)} placeholder="YYYY-MM-DD" />
            <Input label="SSN (full to set/update)" value={form.ssn} onChange={(v) => handleChange("ssn", v)} />
            <Input label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />
            <Input label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} />
            <Input label="Address Line 1" value={form.address_line1} onChange={(v) => handleChange("address_line1", v)} />
            <Input label="Address Line 2" value={form.address_line2} onChange={(v) => handleChange("address_line2", v)} />
            <Input label="City" value={form.city} onChange={(v) => handleChange("city", v)} />
            <Input label="State" value={form.state} onChange={(v) => handleChange("state", v)} />
            <Input label="ZIP Code" value={form.zip_code} onChange={(v) => handleChange("zip_code", v)} />
          </div>

          {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600">{error}</div>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-[rgba(15,118,110,0.3)] disabled:opacity-60"
            >
              {selectedMember ? "Update Draft" : "Save Draft"}
            </button>
            {selectedMember && (
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="rounded-full border border-red-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 disabled:opacity-60"
              >
                Delete Member
              </button>
            )}
            <button
              onClick={handleNew}
              className="rounded-full border border-black/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]"
            >
              Clear Form
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-xs text-[var(--ink-muted)]">
      <span className="uppercase tracking-[0.2em] text-[10px]">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--ring)]"
      />
    </label>
  );
}
