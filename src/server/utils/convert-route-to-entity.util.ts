const mapping: Record<string, string> = {
  companies: 'company',
  consumers: 'consumer',
  'meter-readings': 'meter_reading',
  users: 'user',
  'water-bills': 'water_bill',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
