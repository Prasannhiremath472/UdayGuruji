/**
 * Groups a flat planets array (as returned by the API: [{planet, house, ...}])
 * into a { [house]: [planetName, ...] } map for chart rendering.
 */
export function groupPlanetsByHouse(planets) {
  const houses = {};
  for (const p of planets || []) {
    const house = String(p.house);
    if (!houses[house]) houses[house] = [];
    houses[house].push(p.planet);
  }
  return houses;
}

/**
 * Converts a stored divisional chart's chart_json ([{house, planets}]) into
 * the same { [house]: [planetName,...] } shape used by the chart component.
 */
export function chartJsonToHouseMap(chartJson) {
  const houses = {};
  for (const entry of chartJson || []) {
    houses[String(entry.house)] = entry.planets || [];
  }
  return houses;
}

/**
 * Builds a nested Mahadasha -> Antardasha tree from the flat dashas array
 * returned by the API (rows with dasha_level, parent_dasha_id).
 */
export function buildDashaTree(dashas) {
  const byId = {};
  const roots = [];
  for (const d of dashas || []) {
    byId[d.id] = { ...d, children: [] };
  }
  for (const d of dashas || []) {
    const node = byId[d.id];
    if (d.parent_dasha_id && byId[d.parent_dasha_id]) {
      byId[d.parent_dasha_id].children.push(node);
    } else if (d.dasha_level === 1) {
      roots.push(node);
    }
  }
  return roots;
}
