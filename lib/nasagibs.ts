// NASA GIBS (Global Imagery Browse Services)
// WMTS Endpoint: https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi

export const NASA_LAYERS = {
  MODIS_TrueColor: "MODIS_Terra_SurfaceReflectance_Bands143",
  SST: "MODIS_Terra_Sea_Surface_Temp_Day",
  Chlorophyll: "MODIS_Terra_Chlorophyll_A",
};

export function getNASATileUrl(layer: keyof typeof NASA_LAYERS, date: string) {
  const layerName = NASA_LAYERS[layer];
  // Standard Z/X/Y will be handled by Leaflet, we just provide the template with date
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerName}/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;
}
