import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, ArrowRight, Music2, RefreshCw, Disc3 } from 'lucide-react';
export function Button({ to, href, children, variant = 'gold', className = '', ...props }) {
  const classes = `button button-${variant} ${className}`;
  if (to)
    return (
      <Link to={to} className={classes} {...props}>
        {children}
        <ArrowUpRight size={16} aria-hidden="true" />
      </Link>
    );
  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    );
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
export function TextLink({ to, children }) {
  return (
    <Link className="text-link" to={to}>
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function Eyebrow({ children, number }) {
  return (
    <div className="eyebrow">
      {number && <span className="section-number">{number} /</span>}
      {children}
    </div>
  );
}
export function SectionHeading({ eyebrow, number, title, children, link, to }) {
  return (
    <div className="section-heading">
      <div>
        <Eyebrow number={number}>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        {children && <p>{children}</p>}
      </div>
      {link && <TextLink to={to}>{link}</TextLink>}
    </div>
  );
}
export function PageIntro({ eyebrow, title, children }) {
  return (
    <header className="page-intro container">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </header>
  );
}
export function Picture({ src, alt, className = '', eager = false, ...props }) {
  const [broken, setBroken] = useState(false);
  return broken || !src ? (
    <div className={`image-fallback ${className}`} role="img" aria-label={alt}>
      <Music2 size={32} />
      <span>{alt}</span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => setBroken(true)}
      {...props}
    />
  );
}
export function DataState({ state, empty = 'New musical moments are on their way.', children }) {
  if (state.loading)
    return (
      <div className="loading-state" role="status">
        <Disc3 className="spin" size={24} />
        <span>Setting the mood…</span>
      </div>
    );
  if (state.error)
    return (
      <div className="empty-state" role="alert">
        <span className="small-label">A LITTLE PAUSE</span>
        <h3>Let’s try that again.</h3>
        <p>{state.error}</p>
        <Button variant="outline" onClick={state.retry}>
          Try again
          <RefreshCw size={15} />
        </Button>
      </div>
    );
  if (!state.data.length)
    return (
      <div className="empty-state">
        <Music2 size={24} />
        <h3>{empty}</h3>
        <p>Until then, there’s always a melody to return to.</p>
      </div>
    );
  return children;
}
export function Pagination({ page, meta, onChange }) {
  return (
    meta.pages > 1 && (
      <nav className="pagination" aria-label="Catalogue pages">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
          ← Previous
        </button>
        <span>
          Page {page} of {meta.pages}
        </span>
        <button disabled={page >= meta.pages} onClick={() => onChange(page + 1)}>
          Next →
        </button>
      </nav>
    )
  );
}
