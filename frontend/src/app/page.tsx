"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8001";

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
  const [error, setError] = useState<string | null>(null);

  const selectedMember = useMemo(
    () => members.find((m) => m.id === selectedId) || null,
    [members, selectedId]
  );

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

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadIdentityAudit(selectedId);
      loadEligibilityAudit(selectedId);
    } else {
      setIdentityAudits([]);
      setEligibilityAudits([]);
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
  };

  const handleChange = (key: keyof MemberForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNew = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setMaskedSSN("");
    setIdentityMessage(null);
    setEligibilityMessage(null);
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

  return (
    <div className="min-h-screen px-6 py-10 lg:px-14">
      <header className="mb-10 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)]">
          Member Enrollment Platform
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--foreground)] lg:text-4xl">
              Sprint-01 Intake Studio
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--ink-muted)]">
              Capture applicant profiles, save drafts, edit details, and enforce field masking. Built for
              sprint-based demos with clean traceability.
            </p>
          </div>
          <div className="rounded-full border border-black/10 bg-[var(--surface)] px-4 py-2 text-xs text-[var(--ink-muted)] shadow-sm">
            API: {API_BASE}
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl bg-[var(--surface)] p-5 shadow-[0_20px_60px_rgba(15,118,110,0.08)] max-h-[calc(100vh-8rem)] overflow-y-auto">
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
