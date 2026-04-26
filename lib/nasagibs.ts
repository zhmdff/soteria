export type GIBSLayer = {
  id: string;
  name: string;
  category: "Satellite" | "Marine" | "Atmosphere" | "Land" | "Events";
  ext: "jpg" | "png";
  matrix: string;
  description?: string;
};

export const GIBS_LAYERS: GIBSLayer[] = [
  // --- SATELLITE / TRUE COLOR ---
  {
    id: "MODIS_Terra_CorrectedReflectance_TrueColor",
    name: "Təbii Rəng (Terra)",
    category: "Satellite",
    ext: "jpg",
    matrix: "GoogleMapsCompatible_Level9",
    description: "Yerin təbii rəngli peyk görüntüsü (250m)."
  },
  {
    id: "MODIS_Aqua_CorrectedReflectance_TrueColor",
    name: "Təbii Rəng (Aqua)",
    category: "Satellite",
    ext: "jpg",
    matrix: "GoogleMapsCompatible_Level9",
    description: "Yerin təbii rəngli peyk görüntüsü (250m)."
  },
  {
    id: "VIIRS_SNPP_CorrectedReflectance_TrueColor",
    name: "Təbii Rəng (VIIRS)",
    category: "Satellite",
    ext: "jpg",
    matrix: "GoogleMapsCompatible_Level9"
  },
  {
    id: "MODIS_Terra_CorrectedReflectance_Bands721",
    name: "Saxta Rəng (7-2-1)",
    category: "Satellite",
    ext: "jpg",
    matrix: "GoogleMapsCompatible_Level9",
    description: "Yanğın və subasmanı görmək üçün optimallaşdırılmış."
  },

  // --- MARINE / WATER ---
  {
    id: "GHRSST_L4_MUR_Sea_Surface_Temperature",
    name: "Dəniz Səthi Temperaturu",
    category: "Marine",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level7",
    description: "Qlobal dəniz səthi temperatur analizi (1km)."
  },
  {
    id: "MODIS_Terra_Chlorophyll_A",
    name: "Xlorofil-A (Terra)",
    category: "Marine",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level7",
    description: "Fitoplankton miqdarı (1km)."
  },
  {
    id: "MODIS_Aqua_Chlorophyll_A",
    name: "Xlorofil-A (Aqua)",
    category: "Marine",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level7"
  },
  {
    id: "MODIS_Aqua_Sea_Ice",
    name: "Dəniz Buz Örtüyü",
    category: "Marine",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level7"
  },

  // --- ATMOSPHERE / AIR QUALITY ---
  {
    id: "VIIRS_SNPP_Aerosol_Optical_Thickness_550nm",
    name: "Aerozol Optik Qalınlığı",
    category: "Atmosphere",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level6",
    description: "Toz və tüstü miqdarı (2km)."
  },
  {
    id: "AIRS_L2_Carbon_Monoxide_500hPa_Volume_Mixing_Ratio_Day",
    name: "Dəm Qazı (CO)",
    category: "Atmosphere",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level6"
  },
  {
    id: "AIRS_CO_Total_Column_Day",
    name: "CO Ümumi Sütun",
    category: "Atmosphere",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level6"
  },
  {
    id: "OMPS_NPP_Nadir_NM_Sulfur_Dioxide_Total_Column_5km",
    name: "Kükürd Dioksid (SO2)",
    category: "Atmosphere",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level6"
  },
  {
    id: "AIRS_Dust_Score_Ocean_Day",
    name: "Toz İndeksi (Okean)",
    category: "Atmosphere",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level6"
  },
  {
    id: "AIRS_Precipitation_Day",
    name: "Yağıntı Miqdarı",
    category: "Atmosphere",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level6"
  },

  // --- LAND / EVENTS ---
  {
    id: "MODIS_Terra_Land_Surface_Temp_Day",
    name: "Quru Səthi Temperaturu",
    category: "Land",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level7"
  },
  {
    id: "MODIS_Terra_Snow_Cover",
    name: "Qar Örtüyü",
    category: "Land",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level8"
  },
  {
    id: "VIIRS_SNPP_Thermal_Anomalies_375m_All",
    name: "Termal Anomaliyalar (Yanğınlar)",
    category: "Events",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level9"
  },
  {
    id: "MODIS_Terra_Cloud_Fraction_Day",
    name: "Bulud Örtüyü",
    category: "Atmosphere",
    ext: "png",
    matrix: "GoogleMapsCompatible_Level6"
  }
];

export const DAILY_SATELLITE_LAYER = GIBS_LAYERS[0];

export const REFERENCE_LABELS_LAYER = {
  id: "Reference_Labels_15m",
  ext: "png",
  matrix: "GoogleMapsCompatible_Level13"
};

export const REFERENCE_FEATURES_LAYER = {
  id: "Reference_Features_15m",
  ext: "png",
  matrix: "GoogleMapsCompatible_Level13"
};

export function getNASATileUrl(layerId: string, date: string, matrix: string, ext: string) {
  // NASA REST Pattern: {Layer}/default/{Time}/{MatrixSet}/{Z}/{Y}/{X}.{ext}
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrix}/{z}/{y}/{x}.${ext}`;
}
