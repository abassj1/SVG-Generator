const fs = require('fs');

const radiusGold = 90;
const radiusSilver = 70;
const radiusBronze = 50;

const cx = 100;
const cy = 100;

function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

// Create an arc path for p%
// If p=100, we won't use arc, we'll draw a full circle instead.
function arcPath(cx, cy, radius, p, strokeColor) {
  if (p === 0) {
    return ''; // no arc
  }
  if (p === 100) {
    // Just draw a full circle
    return `<circle cx="${cx}" cy="${cy}" r="${radius}" stroke="${strokeColor}" stroke-width="20" fill="none" stroke-linecap="round" />`;
  }

  const arcDegrees = 360 * (p / 100);
  const startAngle = -90;
  const endAngle = startAngle + arcDegrees;

  const xStart = cx;
  const yStart = cy - radius;
  const xEnd = cx + radius * Math.cos(degToRad(endAngle));
  const yEnd = cy + radius * Math.sin(degToRad(endAngle));

  const largeArcFlag = arcDegrees > 180 ? 1 : 0;
  const sweepFlag = 1;

  return `
<path d="M ${xStart} ${yStart} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${xEnd} ${yEnd}"
  stroke="${strokeColor}" stroke-width="20" fill="none" stroke-linecap="round" />
`.trim();
}

function createSvg(goldP, silverP, bronzeP) {
  const goldArc = arcPath(cx, cy, radiusGold, goldP, '#FFD700');
  const silverArc = arcPath(cx, cy, radiusSilver, silverP, '#C0C0C0');
  const bronzeArc = arcPath(cx, cy, radiusBronze, bronzeP, '#CD7F32');

  // Background reference circles (optional)
  return `
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${cx}" cy="${cy}" r="${radiusGold}" stroke="#333" stroke-width="20" fill="none"/>
  <circle cx="${cx}" cy="${cy}" r="${radiusSilver}" stroke="#333" stroke-width="20" fill="none"/>
  <circle cx="${cx}" cy="${cy}" r="${radiusBronze}" stroke="#333" stroke-width="20" fill="none"/>
  ${goldArc}
  ${silverArc}
  ${bronzeArc}
</svg>
`.trim();
}

// Generate Bronze increments: 0% to 100% by 10%, gold & silver = 0%
for (let p = 0; p <= 100; p += 10) {
  const svgContent = createSvg(0, 0, p); 
  fs.writeFileSync(`bronze_${p}.svg`, svgContent);
}
console.log("Bronze SVGs generated.");

// After bronze at 100%, silver increments: 0% to 100% by 10%, gold=0%, bronze=100%
for (let p = 0; p <= 100; p += 10) {
  const svgContent = createSvg(0, p, 100); 
  fs.writeFileSync(`silver_${p}.svg`, svgContent);
}
console.log("Silver SVGs generated.");

// After silver at 100%, gold increments: 0% to 100% by 10%, silver=100%, bronze=100%
for (let p = 0; p <= 100; p += 10) {
  const svgContent = createSvg(p, 100, 100); 
  fs.writeFileSync(`gold_${p}.svg`, svgContent);
}
console.log("Gold SVGs generated.");
