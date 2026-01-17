export default function StatLabel({ label, stat, ...props }) {
  return (
    <div {...props}>
      <p className="text-uppercase mb-1 caption">{label}</p>
      <strong className="h4">{stat}</strong>
    </div>
  );
}
