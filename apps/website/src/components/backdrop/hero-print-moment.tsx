export function HeroPrintMoment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* anchor: engineering grid cropped by the bottom-right corner */}
      <div className="bd-grid-full absolute right-0 bottom-0 h-[42%] w-[58%] lg:h-[64%] lg:w-[46%]" />
      {/* texture: dots emerge above the anchor on the right rail */}
      <div className="bd-dots absolute top-[90px] right-[110px] hidden h-[400px] w-[320px] lg:block" />
      {/* connector: dimension line on the anchor's top edge */}
      <svg
        className="absolute right-[80px] bottom-[calc(64%+6px)] hidden h-10 w-[400px] lg:block"
        viewBox="0 0 400 40"
        fill="none"
      >
        <path className="bd-stroke-mid" d="M10 28 H390 M10 20 V36 M390 20 V36" />
        <text x="185" y="14" className="bd-dim-label">
          1440
        </text>
      </svg>
      {/* counterweight: registration mark */}
      <svg
        className="absolute top-9 right-[180px] hidden h-[100px] w-[100px] lg:block"
        viewBox="0 0 100 100"
        fill="none"
      >
        <g className="bd-stroke-faint" transform="translate(50 50)">
          <circle r="13" />
          <path d="M-21 0H21 M0 -21V21" />
        </g>
      </svg>
      {/* crop marks, bottom-left */}
      <svg
        className="absolute bottom-6 left-6 hidden h-[70px] w-[70px] lg:block"
        viewBox="0 0 70 70"
        fill="none"
      >
        <path className="bd-stroke-faint" d="M10 60 H60 M10 10 V60" />
      </svg>
      {/* accent: the --v8-asterisk brand mark — the page's single strong accent */}
      <span className="absolute right-9 bottom-[calc(64%+44px)] hidden font-mono text-[26px] text-[var(--v8-accent)] opacity-90 lg:block">
        *
      </span>
    </div>
  );
}
