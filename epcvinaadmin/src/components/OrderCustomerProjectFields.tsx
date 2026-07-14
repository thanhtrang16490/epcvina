"use client";

import { useEffect, useMemo, useState } from "react";

type Customer = { id: string; name: string };
type Project = { id: string; name: string; customer_id?: string | null };
type CustomerDetails = Customer & {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  tax_code?: string | null;
  province?: string | null;
};
type ProjectDetails = Project & {
  address?: string | null;
  status?: string | null;
};

type Props = {
  customers: CustomerDetails[];
  projects: ProjectDetails[];
  defaultCustomerId?: string;
  defaultProjectId?: string;
};

export function OrderCustomerProjectFields({ customers, projects, defaultCustomerId = "", defaultProjectId = "" }: Props) {
  const initialProject = useMemo(() => projects.find((project) => project.id === defaultProjectId) ?? null, [defaultProjectId, projects]);
  const [customerId, setCustomerId] = useState(defaultCustomerId || initialProject?.customer_id || "");
  const [projectId, setProjectId] = useState(defaultProjectId);

  const filteredProjects = useMemo(
    () => projects.filter((project) => !customerId || String(project.customer_id ?? "") === customerId),
    [customerId, projects],
  );

  useEffect(() => {
    if (!projectId) return;
    const exists = filteredProjects.some((project) => project.id === projectId);
    if (!exists) setProjectId("");
  }, [filteredProjects, projectId]);

  useEffect(() => {
    if (!projectId) return;
    const selected = projects.find((project) => project.id === projectId) ?? null;
    if (!selected?.customer_id) return;
    if (selected.customer_id !== customerId) {
      setCustomerId(String(selected.customer_id));
    }
  }, [customerId, projectId, projects]);

  const selectedCustomer = useMemo(() => customers.find((customer) => customer.id === customerId) ?? null, [customerId, customers]);
  const selectedProject = useMemo(() => projects.find((project) => project.id === projectId) ?? null, [projectId, projects]);

  return (
    <div className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Khách hàng</span>
        <select
          name="customer_id"
          value={customerId}
          onChange={(event) => {
            setCustomerId(event.target.value);
            setProjectId("");
          }}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40"
        >
          <option value="">Chọn khách hàng</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {customers.length === 0 ? <div className="text-xs text-amber-600">Chưa có dữ liệu khách để chọn.</div> : null}
        {selectedCustomer ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <div className="font-medium text-slate-900">{selectedCustomer.name}</div>
            <div className="mt-1 space-y-0.5">
              <div>{selectedCustomer.phone || "-"}</div>
              <div>{selectedCustomer.email || "-"}</div>
              <div>{selectedCustomer.address || "-"}</div>
              <div>{selectedCustomer.province || "-"}</div>
              <div>{selectedCustomer.tax_code ? `MST ${selectedCustomer.tax_code}` : "-"}</div>
            </div>
          </div>
        ) : null}
      </label>
      <label className="grid gap-2">
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">Dự án</span>
        <select
          name="project_id"
          value={projectId}
          onChange={(event) => {
            const nextProjectId = event.target.value;
            setProjectId(nextProjectId);
            const nextProject = projects.find((project) => project.id === nextProjectId) ?? null;
            if (nextProject?.customer_id) setCustomerId(String(nextProject.customer_id));
          }}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-[color:var(--accent)]/40"
        >
          <option value="">Chọn dự án</option>
          {filteredProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {projects.length === 0 ? <div className="text-xs text-amber-600">Chưa có dữ liệu dự án để chọn.</div> : null}
        {selectedProject ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <div className="font-medium text-slate-900">{selectedProject.name}</div>
            <div className="mt-1 space-y-0.5">
              <div>{selectedProject.address || "-"}</div>
              <div>{selectedProject.status || "-"}</div>
            </div>
          </div>
        ) : null}
      </label>
    </div>
  );
}
