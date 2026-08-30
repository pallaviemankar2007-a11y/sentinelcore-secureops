export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger }) {
  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, color: '#E2E8F0' }}>{title}</h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#8B98B0', lineHeight: 1.5 }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} style={secondaryBtnStyle}>Cancel</button>
          <button
            onClick={onConfirm}
            style={{ ...primaryBtnStyle, background: danger ? '#F0455D' : '#6C8CFF', color: danger ? '#fff' : '#0B1220' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
};
const boxStyle = {
  width: 360, maxWidth: '90vw', background: '#0F1830',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20,
};
const primaryBtnStyle = {
  border: 'none', borderRadius: 6, padding: '8px 16px', fontSize: 13, fontWeight: 600,
};
const secondaryBtnStyle = {
  background: 'transparent', color: '#8B98B0', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6, padding: '8px 16px', fontSize: 13,
};
