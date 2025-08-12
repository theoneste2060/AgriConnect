export interface Province {
  id: string;
  name: string;
  nameKinyarwanda: string;
}

export interface District {
  id: string;
  name: string;
  nameKinyarwanda: string;
  provinceId: string;
}

export interface Sector {
  id: string;
  name: string;
  nameKinyarwanda: string;
  districtId: string;
}

export const RWANDA_PROVINCES: Province[] = [
  {
    id: "kigali",
    name: "Kigali City",
    nameKinyarwanda: "Umujyi wa Kigali"
  },
  {
    id: "northern",
    name: "Northern Province",
    nameKinyarwanda: "Intara y'Amajyaruguru"
  },
  {
    id: "southern",
    name: "Southern Province", 
    nameKinyarwanda: "Intara y'Amajyepfo"
  },
  {
    id: "eastern",
    name: "Eastern Province",
    nameKinyarwanda: "Intara y'Iburasirazuba"
  },
  {
    id: "western",
    name: "Western Province",
    nameKinyarwanda: "Intara y'Iburengerazuba"
  }
];

export const RWANDA_DISTRICTS: District[] = [
  // Kigali City
  {
    id: "gasabo",
    name: "Gasabo",
    nameKinyarwanda: "Gasabo",
    provinceId: "kigali"
  },
  {
    id: "kicukiro",
    name: "Kicukiro", 
    nameKinyarwanda: "Kicukiro",
    provinceId: "kigali"
  },
  {
    id: "nyarugenge",
    name: "Nyarugenge",
    nameKinyarwanda: "Nyarugenge", 
    provinceId: "kigali"
  },
  
  // Northern Province
  {
    id: "burera",
    name: "Burera",
    nameKinyarwanda: "Burera",
    provinceId: "northern"
  },
  {
    id: "gakenke",
    name: "Gakenke",
    nameKinyarwanda: "Gakenke",
    provinceId: "northern"
  },
  {
    id: "gicumbi",
    name: "Gicumbi",
    nameKinyarwanda: "Gicumbi",
    provinceId: "northern"
  },
  {
    id: "musanze",
    name: "Musanze",
    nameKinyarwanda: "Musanze",
    provinceId: "northern"
  },
  {
    id: "rulindo",
    name: "Rulindo",
    nameKinyarwanda: "Rulindo",
    provinceId: "northern"
  },
  
  // Southern Province
  {
    id: "gisagara",
    name: "Gisagara",
    nameKinyarwanda: "Gisagara",
    provinceId: "southern"
  },
  {
    id: "huye",
    name: "Huye",
    nameKinyarwanda: "Huye",
    provinceId: "southern"
  },
  {
    id: "kamonyi",
    name: "Kamonyi",
    nameKinyarwanda: "Kamonyi",
    provinceId: "southern"
  },
  {
    id: "muhanga",
    name: "Muhanga",
    nameKinyarwanda: "Muhanga",
    provinceId: "southern"
  },
  {
    id: "nyamagabe",
    name: "Nyamagabe",
    nameKinyarwanda: "Nyamagabe",
    provinceId: "southern"
  },
  {
    id: "nyanza",
    name: "Nyanza",
    nameKinyarwanda: "Nyanza",
    provinceId: "southern"
  },
  {
    id: "nyaruguru",
    name: "Nyaruguru",
    nameKinyarwanda: "Nyaruguru",
    provinceId: "southern"
  },
  {
    id: "ruhango",
    name: "Ruhango",
    nameKinyarwanda: "Ruhango",
    provinceId: "southern"
  },
  
  // Eastern Province
  {
    id: "bugesera",
    name: "Bugesera",
    nameKinyarwanda: "Bugesera",
    provinceId: "eastern"
  },
  {
    id: "gatsibo",
    name: "Gatsibo",
    nameKinyarwanda: "Gatsibo", 
    provinceId: "eastern"
  },
  {
    id: "kayonza",
    name: "Kayonza",
    nameKinyarwanda: "Kayonza",
    provinceId: "eastern"
  },
  {
    id: "kirehe",
    name: "Kirehe",
    nameKinyarwanda: "Kirehe",
    provinceId: "eastern"
  },
  {
    id: "ngoma",
    name: "Ngoma",
    nameKinyarwanda: "Ngoma",
    provinceId: "eastern"
  },
  {
    id: "nyagatare",
    name: "Nyagatare",
    nameKinyarwanda: "Nyagatare",
    provinceId: "eastern"
  },
  {
    id: "rwamagana",
    name: "Rwamagana",
    nameKinyarwanda: "Rwamagana",
    provinceId: "eastern"
  },
  
  // Western Province
  {
    id: "karongi",
    name: "Karongi",
    nameKinyarwanda: "Karongi",
    provinceId: "western"
  },
  {
    id: "ngororero",
    name: "Ngororero",
    nameKinyarwanda: "Ngororero",
    provinceId: "western"
  },
  {
    id: "nyabihu",
    name: "Nyabihu",
    nameKinyarwanda: "Nyabihu",
    provinceId: "western"
  },
  {
    id: "nyamasheke",
    name: "Nyamasheke",
    nameKinyarwanda: "Nyamasheke",
    provinceId: "western"
  },
  {
    id: "rubavu",
    name: "Rubavu",
    nameKinyarwanda: "Rubavu",
    provinceId: "western"
  },
  {
    id: "rusizi",
    name: "Rusizi",
    nameKinyarwanda: "Rusizi",
    provinceId: "western"
  },
  {
    id: "rutsiro",
    name: "Rutsiro",
    nameKinyarwanda: "Rutsiro",
    provinceId: "western"
  }
];

export const RWANDA_SECTORS: Sector[] = [
  // Gasabo District
  {
    id: "bumbogo",
    name: "Bumbogo",
    nameKinyarwanda: "Bumbogo",
    districtId: "gasabo"
  },
  {
    id: "gasange",
    name: "Gasange",
    nameKinyarwanda: "Gasange",
    districtId: "gasabo"
  },
  {
    id: "gatsata",
    name: "Gatsata",
    nameKinyarwanda: "Gatsata",
    districtId: "gasabo"
  },
  {
    id: "gikomero",
    name: "Gikomero",
    nameKinyarwanda: "Gikomero",
    districtId: "gasabo"
  },
  {
    id: "gisozi",
    name: "Gisozi",
    nameKinyarwanda: "Gisozi",
    districtId: "gasabo"
  },
  {
    id: "jabana",
    name: "Jabana",
    nameKinyarwanda: "Jabana",
    districtId: "gasabo"
  },
  {
    id: "jali",
    name: "Jali",
    nameKinyarwanda: "Jali",
    districtId: "gasabo"
  },
  {
    id: "kacyiru",
    name: "Kacyiru",
    nameKinyarwanda: "Kacyiru",
    districtId: "gasabo"
  },
  {
    id: "kimihurura",
    name: "Kimihurura",
    nameKinyarwanda: "Kimihurura",
    districtId: "gasabo"
  },
  {
    id: "kimisagara",
    name: "Kimisagara", 
    nameKinyarwanda: "Kimisagara",
    districtId: "gasabo"
  },
  {
    id: "kinyinya",
    name: "Kinyinya",
    nameKinyarwanda: "Kinyinya",
    districtId: "gasabo"
  },
  {
    id: "ndera",
    name: "Ndera",
    nameKinyarwanda: "Ndera",
    districtId: "gasabo"
  },
  {
    id: "nduba",
    name: "Nduba",
    nameKinyarwanda: "Nduba",
    districtId: "gasabo"
  },
  {
    id: "remera",
    name: "Remera",
    nameKinyarwanda: "Remera",
    districtId: "gasabo"
  },
  {
    id: "rusororo",
    name: "Rusororo",
    nameKinyarwanda: "Rusororo",
    districtId: "gasabo"
  },
  {
    id: "rutunga",
    name: "Rutunga",
    nameKinyarwanda: "Rutunga",
    districtId: "gasabo"
  },
  
  // Kicukiro District
  {
    id: "gahanga",
    name: "Gahanga",
    nameKinyarwanda: "Gahanga",
    districtId: "kicukiro"
  },
  {
    id: "gatenga",
    name: "Gatenga",
    nameKinyarwanda: "Gatenga", 
    districtId: "kicukiro"
  },
  {
    id: "gikondo",
    name: "Gikondo",
    nameKinyarwanda: "Gikondo",
    districtId: "kicukiro"
  },
  {
    id: "kanombe",
    name: "Kanombe",
    nameKinyarwanda: "Kanombe",
    districtId: "kicukiro"
  },
  {
    id: "kicukiro",
    name: "Kicukiro",
    nameKinyarwanda: "Kicukiro",
    districtId: "kicukiro"
  },
  {
    id: "niboye",
    name: "Niboye",
    nameKinyarwanda: "Niboye",
    districtId: "kicukiro"
  },
  {
    id: "nyarugunga",
    name: "Nyarugunga",
    nameKinyarwanda: "Nyarugunga",
    districtId: "kicukiro"
  },
  
  // Nyarugenge District  
  {
    id: "gitega",
    name: "Gitega",
    nameKinyarwanda: "Gitega",
    districtId: "nyarugenge"
  },
  {
    id: "kanyinya",
    name: "Kanyinya",
    nameKinyarwanda: "Kanyinya",
    districtId: "nyarugenge"
  },
  {
    id: "kigali",
    name: "Kigali",
    nameKinyarwanda: "Kigali",
    districtId: "nyarugenge"
  },
  {
    id: "kimisagara_nyarugenge",
    name: "Kimisagara",
    nameKinyarwanda: "Kimisagara",
    districtId: "nyarugenge"
  },
  {
    id: "mageragere",
    name: "Mageragere",
    nameKinyarwanda: "Mageragere",
    districtId: "nyarugenge"
  },
  {
    id: "muhima",
    name: "Muhima",
    nameKinyarwanda: "Muhima",
    districtId: "nyarugenge"
  },
  {
    id: "nyakabanda",
    name: "Nyakabanda",
    nameKinyarwanda: "Nyakabanda",
    districtId: "nyarugenge"
  },
  {
    id: "nyamirambo",
    name: "Nyamirambo",
    nameKinyarwanda: "Nyamirambo",
    districtId: "nyarugenge"
  },
  {
    id: "rwezamenyo",
    name: "Rwezamenyo",
    nameKinyarwanda: "Rwezamenyo",
    districtId: "nyarugenge"
  }
];

export const PRODUCT_CATEGORIES = [
  {
    id: "poultry",
    name: "Poultry",
    nameKinyarwanda: "Inkoko",
    description: "Chickens and poultry products"
  },
  {
    id: "eggs", 
    name: "Eggs",
    nameKinyarwanda: "Amagi",
    description: "Fresh eggs"
  },
  {
    id: "manure",
    name: "Manure",
    nameKinyarwanda: "Ifumbire",
    description: "Organic fertilizer"
  }
];

// Helper functions
export const getProvinceById = (id: string): Province | undefined => {
  return RWANDA_PROVINCES.find(province => province.id === id);
};

export const getDistrictsByProvince = (provinceId: string): District[] => {
  return RWANDA_DISTRICTS.filter(district => district.provinceId === provinceId);
};

export const getSectorsByDistrict = (districtId: string): Sector[] => {
  return RWANDA_SECTORS.filter(sector => sector.districtId === districtId);
};

export const getDistrictById = (id: string): District | undefined => {
  return RWANDA_DISTRICTS.find(district => district.id === id);
};

export const getSectorById = (id: string): Sector | undefined => {
  return RWANDA_SECTORS.find(sector => sector.id === id);
};
