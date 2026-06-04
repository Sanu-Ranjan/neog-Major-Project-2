import { useState } from "react";
import { useParams } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { post, patch } from "../api/client";
import { Sidebar } from "../components/Sidebar";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
const SOURCES = ["Website", "Referral", "Cold Call", "Advertisement", "Email", "Other"];
const PRIORITIES = ["High", "Medium", "Low"];

export const LeadManagement = () => {
  const { id } = useParams();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState(null);
  const [lead, setLead] = useState(null);

  const { data: fetchedLead, loading: leadLoading, error: leadError } = useGet(API_ROUTES.leads.getById(id));
  const { data: fetchedComments, loading: commentsLoading, error: commentsError } = useGet(API_ROUTES.comments.getByLead(id));
  const { data: agents } = useGet(API_ROUTES.agents.getAll);
  const { data: tags } = useGet(API_ROUTES.tags.getAll);

  const loading = leadLoading || commentsLoading;
  const loadingErr = leadError || commentsError;

  const displayLead = lead ?? fetchedLead;
  const displayComments = comments ?? fetchedComments;

  const handleEdit = () => {
    setSaveError(null);
    setForm({
      name: displayLead.name,
      source: displayLead.source,
      salesAgent: displayLead.salesAgent?._id,
      status: displayLead.status,
      priority: displayLead.priority,
      timeToClose: displayLead.timeToClose,
      tags: displayLead.tags,
    });
    setEditing(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleTagChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm({ ...form, tags: selected });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await patch(API_ROUTES.leads.update(id), form);
      setLead(updated);
      setEditing(false);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setCommentError(null);
    try {
      const newComment = await post(API_ROUTES.comments.add(id), { commentText: comment });
      setComments([...(displayComments ?? []), newComment]);
      setComment("");
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (loadingErr) return <p className="text-danger">Error: {loadingErr}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Lead Management: {displayLead.name}</h5>

      <Sidebar backTo={ROUTES.LEADS} backLabel="Back to Leads">
        <h6 className="mb-3">Lead Details</h6>

        {!editing ? (
          <div className="border-bottom pb-3 mb-3">
            <div className="py-1">Lead Name: <strong>{displayLead.name}</strong></div>
            <div className="py-1">Sales Agent: <strong>{displayLead.salesAgent?.name}</strong></div>
            <div className="py-1">Lead Source: <strong>{displayLead.source}</strong></div>
            <div className="py-1">Lead Status: <strong>{displayLead.status}</strong></div>
            <div className="py-1">Priority: <strong>{displayLead.priority}</strong></div>
            <div className="py-1">Time to Close: <strong>{displayLead.timeToClose} Days</strong></div>
            <div className="py-1">Tags: <strong>{displayLead.tags?.join(", ") || "None"}</strong></div>
            <button className="btn btn-outline-primary btn-sm mt-2" onClick={handleEdit}>
              Edit Lead Details
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="border-bottom pb-3 mb-3" style={{ maxWidth: 500 }}>
            {saveError && <p className="text-danger">{saveError}</p>}
            <div className="mb-2">
              <label className="form-label">Lead Name</label>
              <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Lead Source</label>
              <select name="source" className="form-select" value={form.source} onChange={handleChange}>
                {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Sales Agent</label>
              <select name="salesAgent" className="form-select" value={form.salesAgent} onChange={handleChange}>
                {agents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Lead Status</label>
              <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Priority</label>
              <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Time to Close (days)</label>
              <input type="number" name="timeToClose" className="form-control" value={form.timeToClose} onChange={handleChange} min={1} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Tags <span className="text-muted small">(Ctrl/Cmd to select multiple)</span></label>
              <select multiple className="form-select" value={form.tags} onChange={handleTagChange}>
                {tags.map((t) => <option key={t._id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <h6 className="mb-3">Comments</h6>

        {displayComments.length === 0 ? (
          <p className="text-muted small">No comments yet.</p>
        ) : (
          displayComments.map((c) => (
            <div key={c._id} className="border-bottom py-2">
              <div className="small text-muted">
                {c.author?.name ?? "Unknown"} — {new Date(c.createdAt).toLocaleString()}
              </div>
              <div>{c.commentText}</div>
            </div>
          ))
        )}

        <form onSubmit={handleCommentSubmit} className="mt-3" style={{ maxWidth: 500 }}>
          {commentError && <p className="text-danger">{commentError}</p>}
          <div className="mb-2">
            <textarea
              className="form-control"
              rows={3}
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </Sidebar>
    </div>
  );
};
