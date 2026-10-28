import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { LogOut, Plus, LoaderCircle } from 'lucide-react';
import { adminApi, apiMessage } from '../services/api';
import { clearApiCache } from '../hooks/useApi';
import { Button, Eyebrow, Pagination } from '../components/common/UI';
const fields = {
  music: [
    ['title', 'Title'],
    ['slug', 'URL slug'],
    ['category', 'Category'],
    ['artistCredit', 'Artist credit'],
    ['thumbnail', 'Thumbnail path or HTTPS URL'],
    ['youtubeUrl', 'YouTube watch URL'],
    ['streamingUrl', 'Streaming URL'],
    ['description', 'Description', 'textarea'],
    ['sourceUrl', 'Verification source URL'],
    ['sortOrder', 'Display order', 'number'],
  ],
  videos: [
    ['title', 'Title'],
    ['slug', 'URL slug'],
    ['category', 'Category'],
    ['thumbnail', 'Thumbnail path or HTTPS URL'],
    ['youtubeUrl', 'YouTube watch URL'],
    ['description', 'Description', 'textarea'],
    ['sourceUrl', 'Verification source URL'],
    ['sortOrder', 'Display order', 'number'],
  ],
  events: [
    ['title', 'Event title'],
    ['slug', 'URL slug'],
    ['date', 'Event date and time (local time)', 'datetime-local'],
    ['city', 'City'],
    ['venue', 'Venue'],
    ['image', 'Image path or HTTPS URL'],
    ['ticketUrl', 'Verified ticket URL'],
    ['description', 'Description', 'textarea'],
    ['sourceUrl', 'Verification source URL'],
    ['status', 'Event status', 'event-status'],
  ],
  gallery: [
    ['title', 'Title'],
    ['imagePath', 'Image path or HTTPS URL'],
    ['altText', 'Descriptive alt text'],
    ['category', 'Category', 'gallery-category'],
    ['sourceUrl', 'Source URL'],
    ['sortOrder', 'Display order', 'number'],
  ],
};
const defaults = (resource) =>
  Object.fromEntries([
    ...fields[resource].map(([key, , type]) => [
      key,
      type === 'number'
        ? 0
        : type === 'event-status'
          ? 'confirmed'
          : type === 'gallery-category'
            ? 'Portraits'
            : '',
    ]),
    ['published', false],
    ...(['music', 'videos'].includes(resource) ? [['featured', false]] : []),
  ]);
function Editor({ resource, record, onCancel, onSaved }) {
  const [values, setValues] = useState(() => {
    const result = defaults(resource);
    for (const key of Object.keys(result))
      if (record?.[key] !== undefined) result[key] = record[key];
    if (result.date) {
      const date = new Date(result.date);
      result.date = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
    return result;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const update = (event) =>
    setValues((current) => ({
      ...current,
      [event.target.name]:
        event.target.type === 'checkbox'
          ? event.target.checked
          : event.target.type === 'number'
            ? Number(event.target.value)
            : event.target.value,
    }));
  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...values };
      if (payload.date) payload.date = new Date(payload.date).toISOString();
      const path = `/admin/content/${resource}${record ? '/' + record._id : ''}`;
      await adminApi[record ? 'put' : 'post'](path, payload);
      clearApiCache();
      onSaved();
    } catch (err) {
      const fields = err.response?.data?.error?.fields;
      setError(
        fields
          ? Object.entries(fields)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' · ')
          : apiMessage(err),
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <form className="admin-editor" onSubmit={submit}>
      <h3>{record ? 'Edit entry' : 'New entry'}</h3>
      {fields[resource].map(([key, label, type]) => (
        <label
          className={
            type === 'textarea' ||
            key.toLowerCase().includes('url') ||
            key === 'imagePath' ||
            key === 'thumbnail'
              ? 'wide'
              : ''
          }
          key={key}
        >
          {label}
          {type === 'textarea' ? (
            <textarea rows={3} name={key} value={values[key]} onChange={update} maxLength={2000} />
          ) : type === 'event-status' || type === 'gallery-category' ? (
            <select name={key} value={values[key]} onChange={update}>
              {(type === 'event-status'
                ? ['confirmed', 'cancelled', 'postponed']
                : ['Portraits', 'On stage']
              ).map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          ) : (
            <input
              type={type || 'text'}
              name={key}
              value={values[key]}
              onChange={update}
              required={[
                'title',
                'slug',
                'city',
                'date',
                'venue',
                'altText',
                'imagePath',
                'category',
                'artistCredit',
              ].includes(key)}
              maxLength={type ? undefined : 2048}
              min={type === 'number' ? 0 : undefined}
            />
          )}
        </label>
      ))}
      {['music', 'videos'].includes(resource) && (
        <label className="check-field">
          <input type="checkbox" name="featured" checked={values.featured} onChange={update} />
          Featured on homepage
        </label>
      )}
      <label className="check-field">
        <input type="checkbox" name="published" checked={values.published} onChange={update} />
        Publish this verified entry
      </label>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="editor-actions">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save entry'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      <p className="admin-notice full-width">
        Publish only verified content. Image files belong in client/public/images; this editor
        stores paths and metadata.
      </p>
    </form>
  );
}
export default function Admin() {
  const [session, setSession] = useState(undefined);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [tab, setTab] = useState('bookings');
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState(undefined);
  useEffect(() => {
    adminApi
      .get('/admin/me')
      .then((response) => setSession(response.data.data))
      .catch(() => setSession(null));
  }, []);
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.get(
        tab === 'bookings'
          ? `/admin/bookings?page=${page}&limit=12`
          : `/admin/content/${tab}?page=${page}&limit=12`,
      );
      setData(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      if (err.response?.status === 401) setSession(null);
      setError(apiMessage(err));
    } finally {
      setLoading(false);
    }
  }, [tab, page]);
  useEffect(() => {
    if (session) load();
  }, [session, load]);
  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await adminApi.post('/admin/login', credentials);
      setSession(response.data.data);
      setCredentials({ email: '', password: '' });
    } catch (err) {
      setError(apiMessage(err));
    } finally {
      setLoading(false);
    }
  }
  async function logout() {
    try {
      await adminApi.post('/admin/logout');
      setSession(null);
      setData([]);
      setError('');
    } catch (err) {
      setError(apiMessage(err));
    }
  }
  async function changeStatus(booking, status) {
    setNotice('');
    try {
      await adminApi.patch(`/admin/bookings/${booking._id}`, { status });
      setData((current) =>
        current.map((item) => (item._id === booking._id ? { ...item, status } : item)),
      );
      setNotice('Enquiry status updated.');
    } catch (err) {
      setError(apiMessage(err));
    }
  }
  if (session === undefined)
    return (
      <div className="route-loading" role="status">
        <LoaderCircle className="spin" />
        Opening artist studio…
      </div>
    );
  if (!session)
    return (
      <section className="admin-login">
        <Eyebrow>PRIVATE / ARTIST STUDIO</Eyebrow>
        <h1>Welcome back.</h1>
        <form onSubmit={login}>
          <label>
            Email
            <input
              type="email"
              autoComplete="username"
              required
              value={credentials.email}
              onChange={(event) =>
                setCredentials((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              required
              value={credentials.password}
              onChange={(event) =>
                setCredentials((current) => ({ ...current, password: event.target.value }))
              }
            />
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <p>Administrator accounts are created with the secure setup script.</p>
        <p>
          <Link to="/">← Return to artist website</Link>
        </p>
      </section>
    );
  return (
    <section className="admin-page container">
      <header className="admin-header">
        <div>
          <Eyebrow>AVINASH GUPTA / ARTIST STUDIO</Eyebrow>
          <h1>A home for the music.</h1>
          <p>{session.email}</p>
        </div>
        <div className="admin-actions">
          <Link to="/">View website ↗</Link>
          <Button variant="outline" onClick={logout}>
            Sign out
            <LogOut size={15} />
          </Button>
        </div>
      </header>
      <nav className="admin-tabs" aria-label="Studio sections">
        {['bookings', 'music', 'videos', 'events', 'gallery'].map((item) => (
          <button
            key={item}
            className={tab === item ? 'active' : ''}
            onClick={() => {
              setTab(item);
              setPage(1);
              setEditor(undefined);
              setNotice('');
            }}
            aria-pressed={tab === item}
          >
            {item === 'bookings'
              ? 'Booking enquiries'
              : item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>
      <div className="admin-toolbar">
        <h2>{tab === 'bookings' ? 'The next live moment.' : tab}</h2>
        {tab !== 'bookings' && (
          <Button onClick={() => setEditor(null)}>
            <Plus size={15} />
            Add entry
          </Button>
        )}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
          <button onClick={load}>Try again</button>
        </p>
      )}
      {notice && (
        <p className="admin-status" role="status">
          {notice}
        </p>
      )}
      {loading && (
        <p className="admin-status" role="status">
          Loading studio records…
        </p>
      )}
      <div className={editor !== undefined ? 'admin-layout' : ''}>
        <div className="admin-records">
          {!loading && !error && !data.length && (
            <div className="empty-state">
              <h3>
                {tab === 'bookings' ? 'Your next enquiry starts here.' : 'Room for something new.'}
              </h3>
              <p>
                {tab === 'bookings'
                  ? 'Submitted booking enquiries will appear here.'
                  : 'Add a verified entry and publish when ready.'}
              </p>
            </div>
          )}
          {data.map((item) =>
            tab === 'bookings' ? (
              <article key={item._id} className="enquiry-card">
                <header>
                  <div>
                    <span className="small-label">{item.eventType}</span>
                    <h3>{item.name}</h3>
                  </div>
                  <select
                    aria-label={`Status for ${item.name}`}
                    value={item.status}
                    onChange={(event) => changeStatus(item, event.target.value)}
                  >
                    {['new', 'contacted', 'confirmed', 'closed'].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </header>
                <dl>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </dd>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${item.phone.replace(/[^+\d]/g, '')}`}>{item.phone}</a>
                  </dd>
                  <dt>Event date</dt>
                  <dd>
                    {new Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'long',
                      timeZone: 'Asia/Kolkata',
                    }).format(new Date(item.eventDate))}
                  </dd>
                  <dt>City / venue</dt>
                  <dd>
                    {item.city}
                    {item.venue ? ` / ${item.venue}` : ''}
                  </dd>
                  {item.expectedAudience && (
                    <>
                      <dt>Audience</dt>
                      <dd>{item.expectedAudience}</dd>
                    </>
                  )}
                  <dt>Received</dt>
                  <dd>
                    {new Intl.DateTimeFormat('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                      timeZone: 'Asia/Kolkata',
                    }).format(new Date(item.createdAt))}
                  </dd>
                </dl>
                <p>{item.message}</p>
              </article>
            ) : (
              <article key={item._id} className="admin-record">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.category || item.city || 'Content entry'}</p>
                </div>
                <span>{item.published ? 'PUBLISHED' : 'DRAFT'}</span>
                <button onClick={() => setEditor(item)}>Edit ↗</button>
              </article>
            ),
          )}
        </div>
        {editor !== undefined && (
          <Editor
            key={`${tab}-${editor?._id || 'new'}`}
            resource={tab}
            record={editor}
            onCancel={() => setEditor(undefined)}
            onSaved={() => {
              setEditor(undefined);
              setNotice('Entry saved.');
              load();
            }}
          />
        )}
      </div>
      <Pagination page={page} meta={meta} onChange={setPage} />
    </section>
  );
}
