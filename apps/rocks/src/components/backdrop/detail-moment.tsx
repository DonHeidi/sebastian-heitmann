export function DetailMoment() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* crop marks, top-left */}
      <svg className="absolute top-6 left-6 hidden h-[70px] w-[70px] lg:block" viewBox="0 0 70 70" fill="none">
        <path className="bd-stroke-faint" d="M10 60 V10 H60" />
      </svg>
      {/* faint grid corner, bottom-right */}
      <div className="bd-grid-full absolute right-0 bottom-0 hidden h-[28%] w-[30%] opacity-60 lg:block" />
    </div>
  );
}
