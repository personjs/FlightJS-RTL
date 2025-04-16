export function isValidLatLon(lat: unknown, lon: unknown): boolean {
  const latNum = Number(lat);
  const lonNum = Number(lon);
  return (
    !isNaN(latNum) &&
    !isNaN(lonNum) &&
    latNum >= -90 && latNum <= 90 &&
    lonNum >= -180 && lonNum <= 180
  );
}
