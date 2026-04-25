// NASA GIBS Production access for Daily Satellite Snapshots
export const DAILY_SATELLITE_LAYER = {
  id: "MODIS_Terra_CorrectedReflectance_TrueColor",
  ext: "jpg",
  matrix: "GoogleMapsCompatible_Level9"
};

export function getNASATileUrl(date: string) {
  // NASA REST Pattern: {Layer}/default/{Time}/{MatrixSet}/{Z}/{Y}/{X}.{ext}
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${DAILY_SATELLITE_LAYER.id}/default/${date}/${DAILY_SATELLITE_LAYER.matrix}/{z}/{y}/{x}.${DAILY_SATELLITE_LAYER.ext}`;
}
