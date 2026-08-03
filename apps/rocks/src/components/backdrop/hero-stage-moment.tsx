import { AsteriskMark } from '../asterisk-mark';
import type { Strings } from '../../i18n/types';

export interface HeroStageMomentProps {
  annotations: Strings['annotations'];
}

export function HeroStageMoment({ annotations }: HeroStageMomentProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* anchor: engineering grid cropped by the bottom-right corner */}
      <div className="bd-grid-full absolute right-0 bottom-0 h-[42%] w-[58%] lg:h-[60%] lg:w-[44%]" />
      {/* texture: dot field on the right rail */}
      <div className="bd-dots absolute top-[90px] right-[110px] hidden h-[360px] w-[300px] lg:block" />
      {/* connector: dimension line annotating the layout width */}
      <svg className="absolute right-[80px] bottom-[calc(60%+6px)] hidden h-10 w-[400px] lg:block" viewBox="0 0 400 40" fill="none">
        <path className="bd-stroke-mid" d="M10 28 H390 M10 20 V36 M390 20 V36" />
        <text x="170" y="14" className="bd-dim-label">{annotations.est}</text>
      </svg>
      {/* setlist annotation, stamped sideways on the left rail */}
      <span className="bd-dim-label absolute left-6 top-[38%] hidden origin-left -rotate-90 lg:block">
        {annotations.setlist}
      </span>
      {/* registration mark */}
      <svg className="absolute top-9 right-[180px] hidden h-[100px] w-[100px] lg:block" viewBox="0 0 100 100" fill="none">
        <g className="bd-stroke-faint" transform="translate(50 50)">
          <circle r="13" />
          <path d="M-21 0H21 M0 -21V21" />
        </g>
      </svg>
      {/* the rock element: big misregistered asterisk, bleeding off the right edge */}
      <div className="absolute -right-16 top-16 opacity-90 md:-right-10 md:top-10">
        <div className="md:hidden">
          <AsteriskMark size={280} misregister spin />
        </div>
        <div className="hidden md:block">
          <AsteriskMark size={420} misregister spin />
        </div>
      </div>
    </div>
  );
}
