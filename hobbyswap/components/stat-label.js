export default function StatLabel({ label, stat, ...props }) {
  return (
    <div {...props}>
      <p
        style={{
          fontSize: 12,
          color: "#777070",
          marginBottom: 2,
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <strong className="h4">{stat}</strong>
    </div>
  );
}
