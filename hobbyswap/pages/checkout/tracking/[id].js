import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Badge } from "react-bootstrap";
import Link from "next/link";

const STEPS = [
  { key: "placed",      label: "Order Placed",      desc: "We have received your order." },
  { key: "processing",  label: "Processing",         desc: "Your order is being prepared." },
  { key: "shipped",     label: "Shipped",            desc: "Your package is on its way." },
  { key: "out",         label: "Out for Delivery",   desc: "Your package is out for delivery today." },
  { key: "delivered",   label: "Delivered",          desc: "Your package has been delivered." },
];

export default function ShippingTracking() {
  const router = useRouter();
  const { id } = router.query;
  const [stepIndex, setStepIndex] = useState(0);
  const [listing, setListing] = useState(null);
  const [timestamps, setTimestamps] = useState([]);

  // Load persisted state
  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`tracking_${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setStepIndex(parsed.stepIndex ?? 0);
      setTimestamps(parsed.timestamps ?? [new Date().toISOString()]);
    } else {
      const initial = { stepIndex: 0, timestamps: [new Date().toISOString()] };
      localStorage.setItem(`tracking_${id}`, JSON.stringify(initial));
      setTimestamps(initial.timestamps);
    }
  }, [id]);

  // Load listing info
  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((d) => setListing(d.listing))
      .catch(() => {});
  }, [id]);

  const advanceStep = () => {
    if (stepIndex >= STEPS.length - 1) return;
    const next = stepIndex + 1;
    const newTs = [...timestamps, new Date().toISOString()];
    setStepIndex(next);
    setTimestamps(newTs);
    localStorage.setItem(`tracking_${id}`, JSON.stringify({ stepIndex: next, timestamps: newTs }));
  };

  const isDelivered = stepIndex === STEPS.length - 1;

  return (
    <div className="container my-5" style={{ maxWidth: 680 }}>
      {/* Header */}
      <div className="mb-4">
        <Link href="/" className="text-muted text-decoration-none small">
          ← Back to Home
        </Link>
        <h2 className="text-primary fw-bold mt-2">Shipment Tracking</h2>
        {listing && (
          <p className="text-muted mb-0">
            Order: <span className="fw-semibold text-dark">{listing.itemName}</span>
          </p>
        )}
        <p className="text-muted small">Order ID: {id}</p>
      </div>

      {/* Status banner */}
      <div
        className={`alert ${isDelivered ? "alert-success" : "alert-primary"} d-flex justify-content-between align-items-center`}
      >
        <div>
          <strong>{STEPS[stepIndex].label}</strong>
          <p className="mb-0 small">{STEPS[stepIndex].desc}</p>
        </div>
        <Badge bg={isDelivered ? "success" : "primary"} className="fs-6 px-3 py-2">
          {isDelivered ? "Delivered" : "In Transit"}
        </Badge>
      </div>

      {/* Progress timeline */}
      <div className="border rounded-4 p-4 shadow-sm mb-4">
        {STEPS.map((s, i) => {
          const done = i <= stepIndex;
          const active = i === stepIndex;
          return (
            <div key={s.key} className="d-flex gap-3 mb-3">
              {/* Circle indicator */}
              <div className="d-flex flex-column align-items-center" style={{ minWidth: 32 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: done ? "#0d6efd" : "#dee2e6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    border: active ? "3px solid #0a58ca" : "none",
                    boxShadow: active ? "0 0 0 4px rgba(13,110,253,0.15)" : "none",
                  }}
                >
                  {done && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      flexGrow: 1,
                      minHeight: 20,
                      backgroundColor: i < stepIndex ? "#0d6efd" : "#dee2e6",
                      marginTop: 4,
                    }}
                  />
                )}
              </div>

              {/* Label + timestamp */}
              <div className="pb-3">
                <p
                  className={`mb-0 fw-semibold ${done ? "text-primary" : "text-muted"}`}
                  style={{ fontSize: active ? "1rem" : "0.9rem" }}
                >
                  {s.label}
                </p>
                <p className="mb-0 small text-muted">{s.desc}</p>
                {timestamps[i] && (
                  <p className="mb-0 text-muted" style={{ fontSize: "0.75rem" }}>
                    {new Date(timestamps[i]).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual update button */}
      {!isDelivered ? (
        <Button variant="primary" className="rounded-pill px-4" onClick={advanceStep}>
          Update Progress →
        </Button>
      ) : (
        <div className="alert alert-success">
          Your package has been delivered. Enjoy your item!
        </div>
      )}
    </div>
  );
}
