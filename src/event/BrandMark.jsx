import React from 'react';

export const LOGO_URL = '/assets/event/brand/evolix-logo-transparent.png';

export function BrandMark() {
  return <span className="brand-lockup"><img src={LOGO_URL} width="38" height="44" alt=""/><span className="brand-type">EVOLIX<small>STUDIO</small></span></span>;
}
