const StatCard = ({ label, value, helpText }) => {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
      <p className="text-sm text-base-content/60">{label}</p>
      <h3 className="mt-2 text-4xl font-bold">{value}</h3>
      {helpText ? <p className="mt-2 text-sm text-base-content/50">{helpText}</p> : null}
    </div>
  );
};

export default StatCard;
