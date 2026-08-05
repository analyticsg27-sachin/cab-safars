export type Lang = 'en' | 'hi' | 'gu';
export const LANG_KEY = 'cs_language';

export function getLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem(LANG_KEY) as Lang) || 'en';
}

export const T = {
  // Bottom nav
  nav_home:       { en: 'Home',      hi: 'होम',      gu: 'હોમ' },
  nav_trips:      { en: 'Trips',     hi: 'ट्रिप्स',  gu: 'ટ્રિપ્સ' },
  nav_post:       { en: 'Post Trip', hi: 'पोस्ट',    gu: 'પોસ્ટ' },
  nav_route:      { en: 'Route',     hi: 'रूट',      gu: 'રૂટ' },
  nav_profile:    { en: 'Profile',   hi: 'प्रोफाइल', gu: 'પ્રોફાઇલ' },
  nav_search:     { en: 'Search',    hi: 'खोजें',    gu: 'શોધો' },
  nav_alerts:     { en: 'Alerts',    hi: 'अलर्ट',    gu: 'અલર્ટ' },
  nav_drivers:    { en: 'Drivers',   hi: 'ड्राइवर',  gu: 'ડ્રાઇવર' },

  // Home
  good_morning:   { en: 'Good Morning', hi: 'शुभ प्रभात', gu: 'સુપ્રભાત' },
  good_afternoon: { en: 'Good Afternoon', hi: 'शुभ दोपहर', gu: 'શુભ બપોર' },
  good_evening:   { en: 'Good Evening', hi: 'शुभ संध्या', gu: 'શુભ સાંજ' },
  find_driver:    { en: 'Find a Driver', hi: 'ड्राइवर खोजें', gu: 'ડ્રાઇવર શોધો' },
  post_trip:      { en: 'Post a Trip',   hi: 'ट्रिप पोस्ट करें', gu: 'ટ્રિપ પોસ્ટ કરો' },
  my_trips:       { en: 'My Trips',      hi: 'मेरी ट्रिप्स', gu: 'મારી ટ્રિપ્સ' },
  available_trips:{ en: 'Available Trips', hi: 'उपलब्ध ट्रिप्स', gu: 'ઉપલ્બ્ધ ટ્રિપ્સ' },
  active_trips:   { en: 'Active Trips',  hi: 'सक्रिय ट्रिप्स', gu: 'સક્રિય ટ્રિપ્સ' },
  quick_actions:  { en: 'Quick Actions', hi: 'त्वरित क्रियाएं', gu: 'ઝડપી ક્રિયાઓ' },
  welcome_back:   { en: 'Welcome back',  hi: 'वापस स्वागत है', gu: 'પાછા સ્વાગત છે' },

  // Trip card
  trip_date:      { en: 'Trip Date',     hi: 'ट्रिप तारीख', gu: 'ટ્રિપ તારીખ' },
  vehicle:        { en: 'Vehicle',       hi: 'वाहन',     gu: 'વાહન' },
  fare:           { en: 'Fare',          hi: 'किराया',   gu: 'ભાડું' },
  open_to_negotiate: { en: 'Open to negotiate', hi: 'बातचीत योग्य', gu: 'વાટાઘાટ યોગ્ય' },
  view_details:   { en: 'View Details',  hi: 'विवरण देखें', gu: 'વિગત જુઓ' },
  premium_only:   { en: 'Premium Only',  hi: 'प्रीमियम केवल', gu: 'પ્રીમિયમ માત્ર' },
  upgrade_to_view:{ en: 'Upgrade to view this trip', hi: 'इस ट्रिप को देखने के लिए अपग्रेड करें', gu: 'આ ટ્રિપ જોવા અપગ્રેડ કરો' },

  // Post trip
  post_new_trip:  { en: 'Post New Trip', hi: 'नई ट्रिप पोस्ट करें', gu: 'નવી ટ્રિપ પોસ્ટ કરો' },
  route:          { en: 'Route',         hi: 'रूट',      gu: 'રૂટ' },
  schedule:       { en: 'Schedule',      hi: 'समय-सारणी', gu: 'સમયપત્રક' },
  trip_date_lbl:  { en: 'Trip Date',     hi: 'ट्रिप तारीख', gu: 'ટ્રિપ તારીખ' },
  trip_time_lbl:  { en: 'Trip Time',     hi: 'ट्रिप समय', gu: 'ટ્રિપ સમય' },
  vehicle_type:   { en: 'Vehicle Type',  hi: 'वाहन प्रकार', gu: 'વાહન પ્રકાર' },
  load_type:      { en: 'Load Type',     hi: 'ट्रिप प्रकार', gu: 'ટ્રિપ પ્રકાર' },
  trip_visibility:{ en: 'Trip Visibility', hi: 'ट्रिप दृश्यता', gu: 'ટ્રિપ દૃશ્યતા' },
  free_trip:      { en: 'Free Trip',     hi: 'मुफ्त ट्रिप', gu: 'ફ્રી ટ્રિપ' },
  premium_trip:   { en: 'Premium Trip',  hi: 'प्रीमियम ट्रिप', gu: 'પ્રીમિયમ ટ્રિપ' },
  visible_all:    { en: 'Visible to all drivers', hi: 'सभी ड्राइवरों को दिखेगा', gu: 'બધા ડ્રાઇવર્સ ને દેખાશે' },
  premium_drivers:{ en: 'Premium drivers only', hi: 'केवल प्रीमियम ड्राइवर', gu: 'ફક્ત પ્રીમિયમ ડ્રાઇવર' },
  expected_fare:  { en: 'Expected Fare', hi: 'अनुमानित किराया', gu: 'અપેક્ષિત ભાડું' },
  add_details:    { en: 'Additional Details', hi: 'अतिरिक्त जानकारी', gu: 'વધારાની માહિતી' },
  internal_notes: { en: 'Internal Notes', hi: 'आंतरिक नोट्स', gu: 'આંતરિક નોટ્સ' },
  not_shown:      { en: 'Not shown to drivers', hi: 'ड्राइवरों को नहीं दिखता', gu: 'ડ્રાઇવર્સ ને નહીં દેખાય' },
  post_btn:       { en: 'Post Trip',     hi: 'ट्रिप पोस्ट करें', gu: 'ટ્રિપ પોસ્ટ કરો' },
  posting:        { en: 'Posting Trip…', hi: 'पोस्ट हो रहा है…', gu: 'પોસ્ટ થઈ રહ્યું છે…' },

  // Find trips
  find_trips:     { en: 'Find Trips',    hi: 'ट्रिप्स खोजें', gu: 'ટ્રિપ્સ શોધો' },
  search_trips:   { en: 'Search Trips',  hi: 'ट्रिप्स खोजें', gu: 'ટ્રિપ્સ શોધો' },
  no_trips_found: { en: 'No trips found', hi: 'कोई ट्रिप नहीं मिली', gu: 'કોઈ ટ્રિપ મળી નથી' },
  all_trips:      { en: 'All Trips',     hi: 'सभी ट्रिप्स', gu: 'બધી ટ્રિપ્સ' },
  premium_badge:  { en: 'Premium',       hi: 'प्रीमियम', gu: 'પ્રીમિયમ' },

  // Profile
  my_details:     { en: 'My Details',    hi: 'मेरी जानकारी', gu: 'મારી માહિતી' },
  documents:      { en: 'Documents',     hi: 'दस्तावेज़', gu: 'દસ્તાવેજ' },
  change_password:{ en: 'Change Password', hi: 'पासवर्ड बदलें', gu: 'પાસવર્ડ બદલો' },
  subscription:   { en: 'Subscription',  hi: 'सदस्यता', gu: 'સભ્યપદ' },
  payment_history:{ en: 'Payment History', hi: 'भुगतान इतिहास', gu: 'ચુકવણી ઇતિહાસ' },
  help_faq:       { en: 'Help & FAQ',    hi: 'मदद और FAQ', gu: 'મદદ અને FAQ' },
  logout:         { en: 'Logout',        hi: 'लॉगआउट', gu: 'લૉગ આઉટ' },
  account:        { en: 'Account',       hi: 'खाता',    gu: 'ખાતું' },
  support:        { en: 'Support',       hi: 'सहायता',  gu: 'સહાય' },

  // Common
  from:           { en: 'From',          hi: 'से',       gu: 'થી' },
  to:             { en: 'To',            hi: 'तक',       gu: 'સુધી' },
  search:         { en: 'Search',        hi: 'खोजें',   gu: 'શોધો' },
  cancel:         { en: 'Cancel',        hi: 'रद्द करें', gu: 'રદ કરો' },
  save:           { en: 'Save',          hi: 'सहेजें',  gu: 'સાચવો' },
  upgrade:        { en: 'Upgrade',       hi: 'अपग्रेड', gu: 'અપગ્રેડ' },
  premium:        { en: 'Premium',       hi: 'प्रीमियम', gu: 'પ્રીમિયમ' },
  free:           { en: 'Free',          hi: 'मुफ्त',   gu: 'ફ્રી' },
  loading:        { en: 'Loading…',      hi: 'लोड हो रहा है…', gu: 'લોડ થઈ રહ્યું છે…' },
  trip_provider:  { en: 'Trip Provider', hi: 'ट्रिप प्रदाता', gu: 'ટ્રિપ પ્રોવાઇડર' },
  driver:         { en: 'Driver',        hi: 'ड्राइवर', gu: 'ડ્રાઇવર' },

  // Language screen
  choose_language:{ en: 'Choose Language', hi: 'भाषा चुनें', gu: 'ભાષા પસંદ કરો' },
  skip_english:   { en: 'Skip — use English', hi: 'छोड़ें — अंग्रेजी में जारी रखें', gu: 'છોડો — અંગ્રેજીમાં ચાલુ રાખો' },
} as const;

export type TKey = keyof typeof T;

export function t(key: TKey, lang: Lang): string {
  return T[key][lang] ?? T[key]['en'];
}
