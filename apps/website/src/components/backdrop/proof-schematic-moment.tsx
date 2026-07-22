export function ProofSchematicMoment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* texture: dots trail the traces into the corner */}
      <div className="bd-dots absolute right-0 bottom-0 h-[200px] w-[260px] lg:h-[320px] lg:w-[380px]" />
      <svg
        className="absolute right-0 bottom-0 h-[340px] w-[400px] lg:h-[520px] lg:w-[620px]"
        viewBox="0 0 620 520"
        fill="none"
      >
        <g className="bd-stroke-mid">
          <path d="M620 140 H460 L390 210 V320 L330 380 V520" />
          <path d="M620 230 H510 L450 290 V400 L410 440 V520" />
          <path d="M620 320 H550 L500 370 V520" />
        </g>
        <g className="bd-node">
          <circle cx="460" cy="140" r="5" />
          <circle cx="390" cy="320" r="5" />
          <circle cx="510" cy="230" r="5" />
          <rect x="495" y="365" width="10" height="10" />
        </g>
        <g className="bd-fill-faint">
          <circle cx="360" cy="470" r="2" />
          <circle cx="560" cy="420" r="2" />
          <circle cx="300" cy="500" r="2" />
          <circle cx="580" cy="180" r="2" />
        </g>
        {/* accent on the lower trace bend — below the glass engagement cards */}
        <circle cx="410" cy="440" r="4.5" className="bd-accent-fill" />
      </svg>
    </div>
  );
}
