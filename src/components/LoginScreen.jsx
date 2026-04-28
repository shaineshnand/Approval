import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const { navigate } = useApp();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0=idle, 1=signing-in, 2=verifying

  function handleLogin() {
    setLoading(true);
    setStep(1);
    setTimeout(() => setStep(2), 1200);
    setTimeout(() => navigate('dashboard'), 2600);
  }

  const stepLabels = ['', 'Connecting to Microsoft…', 'Verifying identity…'];

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <svg width="140" height="44" viewBox="0 0 140 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* BSP Life logo text */}
            <rect width="140" height="44" rx="8" fill="#f0faf4"/>
            {/* Green leaf icon */}
            <path d="M14 22 C14 14 22 10 28 14 C24 14 18 18 18 26 C22 26 28 22 30 16 C30 24 26 30 18 30 C14 30 14 26 14 22Z" fill="#3aba6f"/>
            <path d="M18 26 L26 18" stroke="#1e7a45" strokeWidth="1.5" strokeLinecap="round"/>
            {/* BSP text */}
            <text x="38" y="28" fontFamily="Inter,Segoe UI,sans-serif" fontSize="18" fontWeight="800" fill="#12291c">BSP</text>
            <text x="80" y="28" fontFamily="Inter,Segoe UI,sans-serif" fontSize="18" fontWeight="400" fill="#3aba6f">Life</text>
          </svg>
        </div>

        <h1 className="login-title">Approval Portal</h1>
        <p className="login-subtitle">
          Sign in with your BSP Life Microsoft account to continue
        </p>

        {!loading ? (
          <>
            <button className="ms-login-btn" onClick={handleLogin} id="ms-login-btn">
              <MicrosoftIcon />
              Sign in with Microsoft
            </button>

            <div className="login-divider">Secured by Microsoft Entra ID</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <InfoRow icon="🔒" text="Single Sign-On via your Microsoft 365 account" />
              <InfoRow icon="🏢" text="Your identity is verified by BSP Life's Azure Active Directory" />
              <InfoRow icon="📋" text="No separate password required" />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 56, height: 56,
              border: '4px solid var(--bsp-border)',
              borderTopColor: 'var(--bsp-green-bright)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p style={{ fontWeight: 600, color: 'var(--bsp-text-primary)', marginBottom: 4 }}>
              {stepLabels[step]}
            </p>
            <p className="text-muted text-sm">Please wait…</p>
            {step === 2 && (
              <div className="alert alert-success" style={{ marginTop: 20, textAlign: 'left' }}>
                ✅ Identity verified — redirecting to your workspace…
              </div>
            )}
          </div>
        )}

        <p className="login-footer">
          © 2026 BSP Life (PNG) Limited · All rights reserved<br />
          <span style={{ color: 'var(--bsp-green-dark)', fontWeight: 500 }}>
            Microsoft 365 · SharePoint · Teams
          </span>
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '10px 14px',
      background: 'var(--bsp-surface-2)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--bsp-border)',
    }}>
      <span style={{ fontSize: '1rem' }}>{icon}</span>
      <span style={{ fontSize: '0.8rem', color: 'var(--bsp-text-secondary)', lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="ms-icon" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
      <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
    </svg>
  );
}
