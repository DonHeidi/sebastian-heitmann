import type { CSSProperties } from 'react';
import type { Strings } from '@/i18n/types';

export interface LogoAsset {
  name: string;
  src: string;
  width: number;
  height: number;
  /** Vertical margin (px) applied only in the mobile stacked layout, to compensate
   * for varying whitespace baked into each source image. */
  spacing?: number;
  /** Logos that should keep their original colors instead of the inverted-to-white treatment. */
  noInvert?: boolean;
}

export interface LogoSectionProps {
  logos: Strings['logos'];
  logoAssets: LogoAsset[];
}

function LogoGroup({ names, assetsByName }: { names: string[]; assetsByName: Map<string, LogoAsset> }) {
  return (
    <div className="flex flex-col items-center gap-0 min-[1081px]:flex-row min-[1081px]:gap-6 min-[1281px]:gap-9">
      {names.map((name) => {
        const asset = assetsByName.get(name);
        return (
          <span
            key={name}
            title={name}
            className="flex shrink-0 cursor-default items-center my-[var(--logo-spacing,0px)] min-[1081px]:my-0"
            style={{ '--logo-spacing': `${asset?.spacing ?? 0}px` } as CSSProperties}
          >
            {asset ? (
              <img
                src={asset.src}
                alt={name}
                width={asset.width}
                height={asset.height}
                style={{ height: asset.height, width: 'auto' }}
                className={
                  asset.noInvert
                    ? 'mix-blend-lighten'
                    : 'invert saturate-0 brightness-200 contrast-[0.8]'
                }
              />
            ) : (
              <span className="font-display text-lg whitespace-nowrap text-text-secondary">{name}</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

export function LogoSection({ logos, logoAssets }: LogoSectionProps) {
  const assetsByName = new Map(logoAssets.map((asset) => [asset.name, asset]));
  const hasWorkingWith = logos.workingWith.length > 0;

  return (
    <section className="dark max-w-none bg-background text-foreground px-6 min-[1081px]:px-12 min-[1281px]:px-20">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-7 py-8 min-[1081px]:flex-row min-[1081px]:justify-center min-[1081px]:gap-8 min-[1281px]:gap-12">
        {hasWorkingWith && (
          <>
            <div className="flex flex-col items-center gap-4 min-[1081px]:flex-row min-[1081px]:gap-6">
              <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-muted-foreground uppercase">
                {logos.workingWithLabel}
              </span>
              <LogoGroup names={logos.workingWith} assetsByName={assetsByName} />
            </div>

            <div className="h-px w-10 shrink-0 bg-[var(--v8-glass-border)] min-[1081px]:h-7 min-[1081px]:w-px" />
          </>
        )}

        <div className="flex flex-col items-center gap-4 min-[1081px]:flex-row min-[1081px]:gap-6">
          <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-muted-foreground uppercase">
            {logos.previouslyAtLabel}
          </span>
          <LogoGroup names={logos.previouslyAt} assetsByName={assetsByName} />
        </div>
      </div>
    </section>
  );
}
