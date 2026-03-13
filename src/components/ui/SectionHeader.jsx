const SectionHeader = ({ eyebrow, title, description, align = "center" }) => {
  return (
    <div className={`space-y-3 ${align === "center" ? "text-center" : "text-left"}`}>
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p> : null}
      <h2 className="text-3xl md:text-4xl font-bold text-base-content">{title}</h2>
      {description ? <p className="max-w-2xl text-base-content/70 mx-auto">{description}</p> : null}
    </div>
  );
};

export default SectionHeader;
