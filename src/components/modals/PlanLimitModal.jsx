import { HandCoins, Sparkles } from "lucide-react";

export function PlanLimitModal({ onClose, onNewChat, limit }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-icon"><HandCoins /></div>
        <h2>Usage limit reached</h2>
        <p>You've used all {limit} messages on the <strong>Broke Boi Plan</strong>. Upgrade to keep the chort going.</p>
        <div className="plan-compare">
          <div className="plan-compare-label">Plan comparison</div>
          <div className="plan-row"><span>Broke Boi Plan</span><span>{limit} messages</span></div>
          <div className="plan-row"><span>Chort Plus <Sparkles size={12} style={{ display: "inline", verticalAlign: "middle", color: "#10a37f" }} /></span><span className="green">Unlimited*</span></div>
        </div>
        <button className="btn-primary">Upgrade to Chort Plus</button>
        <button className="btn-secondary" onClick={onNewChat}>Start a new chat instead</button>
        <p className="fine-print">*Subject to Chort™ Data Center capacity</p>
      </div>
    </div>
  );
}