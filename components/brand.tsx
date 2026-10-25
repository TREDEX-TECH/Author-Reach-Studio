// Real brand assets from your Google Drive.
// Two copies are rendered; CSS shows the right one for light/dark surfaces.
export function ArsLogo({ height = 44, className = '' }: { height?: number; className?: string }) {
  return (
    <span className={className} style={{display:'inline-flex',alignItems:'center'}} aria-hidden="false">
      <img className="logo-on-light" src="/logo-ars.png" alt="Author Reach Studio" style={{height}} />
      <img className="logo-on-dark" src="/logo-ars-white.png" alt="Author Reach Studio" style={{height}} />
    </span>
  );
}

export function TredexLogo({ size = 44, className = '' }: { size?: number; className?: string }) {
  return <img className={className} src="/logo-tredex.png" alt="Tredex" style={{height:size,width:size,objectFit:'contain'}} />;
}

/** Kept for backwards compatibility with existing imports. */
export function BrandMark({ size = 34 }: { size?: number }) {
  return <ArsLogo height={size} />;
}
