import { useState, useRef, useEffect } from 'react';
import { mockUsers } from '../data/mockData';

export default function PeoplePicker({ selected, onChange, excludeIds = [], placeholder = 'Search for a person…' }) {
  const [query, setQuery]   = useState('');
  const [open, setOpen]     = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapRef  = useRef(null);

  const filtered = mockUsers.filter(u =>
    !excludeIds.includes(u.id) &&
    (u.name.toLowerCase().includes(query.toLowerCase()) ||
     u.email.toLowerCase().includes(query.toLowerCase()) ||
     u.title.toLowerCase().includes(query.toLowerCase()))
  );

  function select(user) {
    onChange(user);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="people-picker" ref={wrapRef}>
      <div
        className={`people-picker-input-wrapper ${focused ? 'focused' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {selected && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bsp-green-light)',
            border: '1px solid var(--bsp-border-strong)',
            borderRadius: 6,
            padding: '2px 8px 2px 4px',
          }}>
            <div className="avatar" style={{ width: 22, height: 22, fontSize: '0.6rem' }}>{selected.initials}</div>
            <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{selected.name}</span>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--bsp-text-muted)', padding: 0, lineHeight: 1, fontSize: '0.9rem' }}
              onClick={e => { e.stopPropagation(); onChange(null); }}
              tabIndex={-1}
            >×</button>
          </div>
        )}
        {!selected && (
          <input
            ref={inputRef}
            value={query}
            placeholder={placeholder}
            onChange={e => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => { setFocused(true); setOpen(true); }}
            onBlur={() => setFocused(false)}
          />
        )}
      </div>

      {open && !selected && filtered.length > 0 && (
        <div className="people-picker-dropdown">
          {filtered.map(u => (
            <div key={u.id} className="people-picker-option" onMouseDown={() => select(u)}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.7rem' }}>{u.initials}</div>
              <div>
                <div className="people-picker-option-name">{u.name}</div>
                <div className="people-picker-option-meta">{u.title} · {u.dept}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {open && !selected && query && filtered.length === 0 && (
        <div className="people-picker-dropdown">
          <div style={{ padding: '14px 16px', color: 'var(--bsp-text-muted)', fontSize: '0.875rem', textAlign: 'center' }}>
            No users found matching "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
