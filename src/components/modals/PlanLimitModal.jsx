export function PlanLimitModal({ onClose, onNewChat }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🪙</div>
        <h2>Usage limit reached</h2>
        <p>
          You've used all 3 messages on the <strong>Broke Boi Plan</strong>.
          Upgrade to keep the chort going.
        </p>
        <div className="plan-compare">
          <div className="plan-row">
            <span>Broke Boi Plan</span>
            <span>3 messages</span>
          </div>
          <div className="plan-row">
            <span>Chort Plus ✦</span>
            <span className="green">Unlimited*</span>
          </div>
        </div>
        <button className="btn-primary">Upgrade to Chort Plus</button>
        <button className="btn-secondary" onClick={() => { onClose(); onNewChat(); }}>
          Start a new chat instead
        </button>
        <p className="fine-print">*Subject to Bovine Neural Architecture™ capacity</p>
      </div>
    </div>
  );
}