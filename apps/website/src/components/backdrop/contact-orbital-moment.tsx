export function ContactOrbitalMoment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* texture: dots below the form */}
      <div className="bd-dots absolute right-[60px] bottom-0 h-[160px] w-[260px] lg:bottom-4 lg:h-[200px]" />
      {/* arcs sweep up behind the form; outer arcs at the faint tier (approved) */}
      <svg
        className="absolute right-0 bottom-0 h-[410px] w-[700px] md:h-[700px] md:w-[1200px]"
        viewBox="0 0 1200 700"
        fill="none"
      >
        <g className="bd-stroke-mid">
          <circle cx="1450" cy="1000" r="430" />
          <circle cx="1450" cy="1000" r="520" />
        </g>
        <g className="bd-stroke-faint">
          <circle cx="1450" cy="1000" r="700" />
          <circle cx="1450" cy="1000" r="850" />
          <path d="M1192 656 l-13 -12 M940 684 l-14 -10" />
        </g>
        {/* satellite accent on an inner arc, below the form */}
        <circle cx="1060" cy="657" r="4.5" className="bd-accent-fill" />
      </svg>
      {/* counterweight: reticle in the gap between headline and form columns */}
      <svg
        className="absolute top-[10%] left-[44%] hidden h-[110px] w-[110px] lg:block"
        viewBox="0 0 110 110"
        fill="none"
      >
        <g className="bd-stroke-faint" transform="translate(55 55)">
          <circle r="24" />
          <path d="M-38 0H-13 M13 0H38 M0 -38V-13 M0 13V38" />
        </g>
      </svg>
    </div>
  );
}
