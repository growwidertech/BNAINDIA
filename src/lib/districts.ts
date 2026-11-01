export interface StateDistrictMap {
  [state: string]: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistrictMap = {
  "Delhi (NCT)": [
    "New Delhi",
    "Central Delhi",
    "South Delhi",
    "North Delhi",
    "East Delhi",
    "West Delhi",
  ],
  "Maharashtra": [
    "Mumbai City",
    "Mumbai Suburban",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Chhatrapati Sambhaji Nagar",
    "Kolhapur",
    "Solapur",
    "Amravati",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Varanasi",
    "Prayagraj",
    "Kanpur Nagar",
    "Gautam Buddha Nagar (Noida)",
    "Agra",
    "Meerut",
    "Gorakhpur",
    "Ayodhya",
    "Bareilly",
  ],
  "Karnataka": [
    "Bengaluru Urban",
    "Bengaluru Rural",
    "Mysuru",
    "Dharwad",
    "Dakshina Kannada (Mangaluru)",
    "Belagavi",
    "Kalaburagi",
    "Udupi",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Vellore",
  ],
  "West Bengal": [
    "Kolkata",
    "North 24 Parganas",
    "South 24 Parganas",
    "Howrah",
    "Darjeeling",
    "Siliguri",
    "Murshidabad",
    "Paschim Bardhaman",
  ],
  "Telangana": [
    "Hyderabad",
    "Ranga Reddy",
    "Medchal-Malkajgiri",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
  ],
  "Punjab": [
    "Chandigarh",
    "Amritsar",
    "Ludhiana",
    "Jalandhar",
    "Patiala",
    "SAS Nagar (Mohali)",
    "Bathinda",
  ],
  "Rajasthan": [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Kota",
    "Ajmer",
    "Bikaner",
    "Alwar",
  ],
  "Bihar": [
    "Patna",
    "Gaya",
    "Muzaffarpur",
    "Bhagalpur",
    "Darbhanga",
    "Nalanda",
    "Purnia",
  ],
  "Gujarat": [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Gandhinagar",
    "Bhavnagar",
  ],
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Gwalior",
    "Jabalpur",
    "Ujjain",
  ],
  "Kerala": [
    "Thiruvananthapuram",
    "Ernakulam (Kochi)",
    "Kozhikode",
    "Thrissur",
    "Kannur",
  ],
  "Assam": [
    "Kamrup Metropolitan (Guwahati)",
    "Dibrugarh",
    "Silchar",
    "Jorhat",
  ],
  "Odisha": [
    "Khordha (Bhubaneswar)",
    "Cuttack",
    "Puri",
    "Sambalpur",
    "Ganjam",
  ],
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada (NTR)",
    "Guntur",
    "Tirupati",
    "Kurnool",
  ],
  "Haryana": [
    "Gurugram",
    "Faridabad",
    "Panipat",
    "Ambala",
    "Hisar",
  ],
  "Jharkhand": [
    "Ranchi",
    "East Singhbhum (Jamshedpur)",
    "Dhanbad",
    "Bokaro",
  ],
  "Jammu & Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
  ],
};

export const POPULAR_DISTRICT_FILTERS = [
  "All Districts",
  "New Delhi",
  "Mumbai Suburban",
  "Bengaluru Urban",
  "Lucknow",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Varanasi",
  "Pune",
  "Patna",
  "Jaipur",
  "Amritsar",
  "Gautam Buddha Nagar (Noida)",
  "Ahmedabad",
  "Bhopal",
];

export function getAllStates(): string[] {
  return Object.keys(INDIAN_STATES_DISTRICTS);
}

export function getDistrictsForState(state: string): string[] {
  return INDIAN_STATES_DISTRICTS[state] || [];
}

export function getAllDistricts(): string[] {
  const all: string[] = [];
  for (const state of Object.keys(INDIAN_STATES_DISTRICTS)) {
    all.push(...INDIAN_STATES_DISTRICTS[state]);
  }
  return Array.from(new Set(all));
}

export const INDIAN_STATES_DATA = Object.entries(INDIAN_STATES_DISTRICTS).map(
  ([state, districts]) => ({ state, districts })
);

export function getStateForDistrict(district: string): string | null {
  for (const [state, districts] of Object.entries(INDIAN_STATES_DISTRICTS)) {
    if (districts.some(d => d.toLowerCase() === district.toLowerCase() || district.toLowerCase().includes(d.toLowerCase()))) {
      return state;
    }
  }
  return null;
}
