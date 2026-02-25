import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Mail, X } from 'lucide-react';

const CONTACT_EMAIL = 'hello@frontierfinance.org';

export default function HubSpotForm() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  const modalMarkup = open ? (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
      onClick={() => setOpen(false)}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: '#fff',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            background: 'linear-gradient(to right, #2563eb, #9333ea)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
            <Mail size={20} />
            <h2 id="contact-modal-title" style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
              Get In Touch
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.5rem 1.5rem 1.75rem', textAlign: 'center' }}>
          <p style={{ color: '#374151', marginBottom: '1.25rem', lineHeight: 1.6 }}>
            Reach out to the Collaborative for Frontier Finance. We’d love to hear from you.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(to right, #2563eb, #9333ea)',
              color: '#fff',
              borderRadius: '9999px',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.875rem',
            }}
          >
            <Mail size={18} />
            Email {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full
                   border-2 border-blue-600 text-blue-700 font-semibold text-sm
                   bg-white/80 backdrop-blur-sm
                   shadow-md hover:shadow-xl hover:shadow-blue-500/15
                   transition-all duration-300 transform hover:-translate-y-1 hover:scale-105
                   hover:bg-blue-600 hover:text-white"
      >
        <Mail className="w-4 h-4 group-hover:rotate-6 transition-transform duration-300" />
        <span>Get In Touch</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:bg-white animate-pulse" />
      </button>
      {createPortal(modalMarkup, document.body)}
    </>
  );
}
