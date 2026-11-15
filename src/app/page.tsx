"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  PlusCircle, 
  List, 
  ArrowRight, 
  Download, 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  FileText,
  Lock,
  Database,
  Wrench,
  Package,
  AlertTriangle,
  CreditCard,
  UserCheck,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Cpu,
  Zap,
  Globe,
  Code2,
  Layers,
  ExternalLink,
  Search,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Check,
  BarChart3,
  QrCode,
  MessageSquare,
  ShoppingCart,
  Send,
  RefreshCw,
  Headphones,
  Server,
  Laptop,
  Store,
  GraduationCap,
  Stethoscope,
  Building2,
  Scale,
  ShoppingBag,
  Camera,
  Wifi,
  Printer,
  BatteryCharging,
  Flame,
  HardDrive,
  Monitor,
  Shield,
  Award,
  Landmark,
  Fingerprint,
  IndianRupee,
  Ticket,
  FileCheck,
  Briefcase,
  Car,
  X
} from "lucide-react";
import { getRecordsFromDB, getCurrentUser } from "@/lib/actions";
import { logoutUser } from "@/app/login/actions";
import { createSupportRequest } from "@/lib/adminActions";
import LaunchSoftwareModal from "@/components/LaunchSoftwareModal";
import { getCustomerRepairRecords, CustomerSafeRecord } from "@/lib/customerActions";

// Interactive Mockup Data for Hero
const HERO_TICKETS = [
  {
    id: "JOB-1042",
    customer: "Rajesh K. Verma",
    phone: "+91 98390 XXXXX",
    device: "Dell Latitude 5420",
    issue: "Motherboard Power IC & BIOS",
    status: "Ready for Pickup",
    statusColor: "emerald",
    amount: "₹3,400",
    delivery: "Today, 5:00 PM"
  },
  {
    id: "JOB-1043",
    customer: "Priya Srivastava",
    phone: "+91 94152 XXXXX",
    device: "HP Pavilion 15 Gaming",
    issue: "144Hz FHD Screen Replacement",
    status: "In Progress",
    statusColor: "blue",
    amount: "₹4,200",
    delivery: "Tomorrow, 12:00 PM"
  },
  {
    id: "JOB-1044",
    customer: "Alok Tripathi",
    phone: "+91 79058 XXXXX",
    device: "Lenovo ThinkPad E14",
    issue: "Liquid Spill Ultrasonic Clean",
    status: "Diagnosing",
    statusColor: "amber",
    amount: "₹1,800",
    delivery: "Tomorrow, 6:00 PM"
  }
];

const HERO_PARTS = [
  { name: "512GB NVMe M.2 SSD (Gen 3x4)", stock: 3, alert: true, price: "₹2,650", category: "Storage" },
  { name: "15.6\" Slim 30-Pin FHD IPS Screen", stock: 8, alert: false, price: "₹3,700", category: "Displays" },
  { name: "16GB DDR4 3200MHz Laptop RAM", stock: 14, alert: false, price: "₹2,400", category: "Memory" },
];

const HERO_SALES = [
  { id: "SALE-812", client: "Deepak Sharma", item: "Crucial 1TB NVMe SSD + Fitting", amount: "₹4,950", date: "Just now" },
  { id: "SALE-813", client: "Allahabad Coaching Inst.", item: "3x 65W Original Type-C Adapters", amount: "₹3,600", date: "1 hr ago" },
  { id: "SALE-814", client: "Vikram Rajput", item: "Dell Inspiron Original Keyboard", amount: "₹1,250", date: "3 hrs ago" },
];

// All Laptop Brands Repaired (From Banner / Poster)
const REPAIRED_BRANDS = [
  { name: "HP", color: "from-sky-500 to-blue-600" },
  { name: "Dell", color: "from-blue-600 to-indigo-700" },
  { name: "Lenovo", color: "from-red-500 to-rose-600" },
  { name: "Asus", color: "from-cyan-500 to-blue-500" },
  { name: "Acer", color: "from-emerald-500 to-teal-600" },
  { name: "Apple", color: "from-slate-200 to-slate-400" },
  { name: "MSI", color: "from-red-600 to-orange-600" },
  { name: "Toshiba", color: "from-red-500 to-red-700" },
  { name: "Sony", color: "from-purple-500 to-indigo-600" },
  { name: "Samsung", color: "from-blue-500 to-blue-800" },
];

// Tailored Business Website Solutions for Indian Clients
const BUSINESS_WEBSITE_SOLUTIONS = [
  {
    id: 0,
    title: "Storekeepers & Local Retailers",
    hindiTag: "दुकानदार एवं लोकल रिटेलर्स",
    icon: Store,
    badge: "Local SEO & Footfall",
    tagline: "Get Found on Google Maps & Get Direct WhatsApp Customer Orders",
    problem: "When customers in your city search 'laptop repair near me', 'best mobile store', or 'grocery shop nearby', they only visit shops that appear on top of Google Maps. Without a website, you lose customers to competitors every single day.",
    solutions: [
      "High-Ranking Google Local SEO: Rank on Page 1 for local searches in your city.",
      "Google My Business (Google Maps) 5-Star Setup: Verified pin with reviews link.",
      "1-Click 'WhatsApp Order / Call Now' Button: Direct connection to customer.",
      "Digital Product Catalog & Price Showcase: Showcase your stock 24/7.",
      "Offer & Sale Announcements: Run festive discount banners directly on your site."
    ],
    timeline: "Ready in 3 to 5 Days",
    idealFor: "Computer & Mobile Shops, Kirana & Supermarkets, Garment Stores, Hardware Dealers, Electronics Showrooms"
  },
  {
    id: 1,
    title: "Schools, Colleges & Coaching",
    hindiTag: "स्कूल, कॉलेज एवं कोचिंग संस्थान",
    icon: GraduationCap,
    badge: "Admissions & Trust",
    tagline: "Attract 3X More Student Admissions & Simplify Parent Communication",
    problem: "During admission season, parents search online first. An outdated or missing website makes parents doubt the institute's quality. You need a credible, modern portal that showcases your toppers, facilities, and fee structure clearly.",
    solutions: [
      "Online Admission Inquiry Form: Instant lead alerts delivered to the Principal/Admin WhatsApp.",
      "Digital Notice Board: Publish exam schedules, holiday notices, and result circulars in seconds.",
      "Toppers & Event Gallery: Photo/video galleries of sports day, science exhibitions, and board exam toppers.",
      "Fee Structure & Bus Routes: Transparent info that saves your administrative staff hours on phone calls.",
      "Mobile-Friendly Portal: 100% responsive design optimized for parents viewing on smartphones."
    ],
    timeline: "Ready in 5 to 7 Days",
    idealFor: "CBSE/ICSE/State Board Schools, Degree Colleges, IIT-JEE/NEET Coaching, Computer Training Centers"
  },
  {
    id: 2,
    title: "Hospitals, Clinics & Doctors",
    hindiTag: "डॉक्टर्स, क्लीनिक एवं अस्पताल",
    icon: Stethoscope,
    badge: "Appointments & OPD",
    tagline: "Streamline Patient Appointments & Display OPD Timings 24/7",
    problem: "Patients and families facing health issues need immediate, reliable information. If they cannot quickly find your doctor's degrees, visiting OPD hours, clinic location, or consultation fee, they call another clinic.",
    solutions: [
      "1-Click Online Appointment Booking: Patients choose date & time slot without waiting on phone holds.",
      "Live OPD Timings & Specialist Profiles: Clearly list MBBS/MD qualifications and available days.",
      "Emergency Ambulance & Call Hotline: Prominent red emergency dial button for urgent medical care.",
      "1-Click Google Maps Clinic Navigation: Eliminates patients getting lost on the way.",
      "Health Care Tips & Department Pages: Specialized pages for Dental, Ortho, Gynaec, Paediatrics, etc."
    ],
    timeline: "Ready in 4 to 6 Days",
    idealFor: "Private Clinics, Multi-Speciality Hospitals, Dental Clinics, Diagnostic & Pathology Labs, Physiotherapy Centers"
  },
  {
    id: 3,
    title: "Real Estate, Builders & Colonizers",
    hindiTag: "प्रॉपर्टी डीलर्स एवं बिल्डर्स",
    icon: Building2,
    badge: "Direct Buyer Leads",
    tagline: "Showcase Plots, Flats & Commercial Spaces Directly to Serious Buyers",
    problem: "Relying purely on third-party property classifieds costs thousands per listing and brings low-quality leads. Serious high-budget property buyers want verified property videos, layout maps, and direct developer contact without middleman broker fees.",
    solutions: [
      "Interactive Project Showcase: Dedicated sections for Residential Plots, 2/3 BHK Flats, and Commercial Hubs.",
      "HD Video Walkthroughs & Layout Maps: High-res layout masterplans, RERA/PDA registration numbers.",
      "Built-in EMI & Price Calculator: Allows buyers to check estimated monthly installments on the spot.",
      "1-Click 'Book Free Site Visit on WhatsApp': Captures genuine buyer phone numbers instantly.",
      "Location Advantage Map: Highlights nearby highways, metro stations, hospitals, and schools."
    ],
    timeline: "Ready in 5 to 7 Days",
    idealFor: "Colonizers, Township Developers, Property Consultants, Commercial Complex Builders, Plotting Ventures"
  },
  {
    id: 4,
    title: "Advocates, Law Chambers & Firms",
    hindiTag: "वकील साहब एवं लीगल फर्म",
    icon: Scale,
    badge: "Professional Authority",
    tagline: "Establish Unmatched Legal Authority & Attract High-Value Clients",
    problem: "Individuals and corporate businesses with serious legal battles (High Court, District Court, RERA, Corporate) look for established, trustworthy legal counsel. A dignified, professional website immediately establishes your seniority, practice areas, and track record.",
    solutions: [
      "Senior Advocate & Chamber Profile: Professional biography highlighting High Court & Supreme Court experience.",
      "Detailed Practice Areas: Dedicated pages for Civil, Criminal, RERA, Bail, Matrimonial, Corporate & Land Revenue law.",
      "Confidential Consultation Request Form: Secure inquiry intake without privacy leaks.",
      "Chamber Office Address & High Court Location: Clear directions and appointment timings for clients.",
      "Legal Insights & Case Articles: Educate clients and build authority on important legal topics."
    ],
    timeline: "Ready in 3 to 5 Days",
    idealFor: "High Court Advocates, District Court Practitioners, Corporate Law Firms, RERA & Tax Consultants, Notaries"
  },
  {
    id: 5,
    title: "E-Commerce & Online Stores",
    hindiTag: "ऑनलाइन स्टोर एवं ई-कॉमर्स",
    icon: ShoppingBag,
    badge: "100% Profit Retention",
    tagline: "Sell Your Products Across All of India Without Marketplace Commissions",
    problem: "Selling on big e-commerce portals eats away 15% to 30% of your margins in commissions, listing fees, and return penalties. With your own branded website, 100% of the customer payment comes directly to your bank account via instant UPI.",
    solutions: [
      "Instant UPI & Indian Payment Gateways: PhonePe, Google Pay, Paytm, Cards, NetBanking, and Cash on Delivery (COD).",
      "Automated WhatsApp Order Alerts: Instant receipts and dispatch tracking sent straight to customer WhatsApp.",
      "Mobile-First Superfast Catalog: Ultra-smooth shopping experience even on basic Jio/Airtel mobile connections.",
      "Inventory & Order Management: Real-time stock deduction, discount coupons, and customer database ownership.",
      "Pan-India Shipping Integration: Compatible with Shiprocket, Delhivery, BlueDart, and India Post."
    ],
    timeline: "Ready in 7 to 10 Days",
    idealFor: "Clothing & Ethnic Wear, Handcrafted Goods, Electronics & Gadgets, Organic Food, Refurbished Tech Brands"
  }
];

// Hardware Diagnoses & Solutions (From Poster Image 1 & 2)
const HARDWARE_SOLUTIONS = [
  {
    title: "Slow Laptop / PC Performance",
    hindi: "धीमा चलना या हैंग होना",
    icon: Zap,
    desc: "Speed up your system by up to 10X. HDD to high-speed NVMe SSD upgrade, RAM expansion, startup tuning & thermal refresh. Boot Windows in just 5 seconds."
  },
  {
    title: "Overheating & Heavy Fan Noise",
    hindi: "गर्म होना एवं पंखे की आवाज",
    icon: Flame,
    desc: "Deep internal heat sink dust cleaning, fan lubrication, and replacement of old dried thermal paste with premium Arctic MX-4 compound to prevent processor burnout."
  },
  {
    title: "Cracked Screen & Display Faults",
    hindi: "स्क्रीन टूटना या लाइनें आना",
    icon: Monitor,
    desc: "Same-day replacement of broken displays, horizontal/vertical lines, white screen, or flickering display with 100% genuine OEM panels with testing warranty."
  },
  {
    title: "Virus, Malware & Ransomware",
    hindi: "वायरस हटाना व डेटा सुरक्षा",
    icon: Shield,
    desc: "Deep system sterilization, Trojan and adware cleanup without losing your important files, photos, or Tally accounting data. Genuine Antivirus installation."
  },
  {
    title: "Data Backup & Dead Drive Recovery",
    hindi: "खराब डिस्क से डेटा रिकवरी",
    icon: HardDrive,
    desc: "Accidentally formatted drives, unreadable hard disks, dead SSDs, and clicking drives recovered in our clean lab. Safe backup migration to external storage."
  },
  {
    title: "System Crash & Blue Screen (BSOD)",
    hindi: "विंडोज क्रैश या बार-बार रीस्टार्ट",
    icon: AlertTriangle,
    desc: "Repairing Windows boot loops, registry corruption, BSOD errors, missing driver conflicts, and fresh installation of genuine Windows 10/11 OS."
  },
  {
    title: "Motherboard Chip-Level Repair",
    hindi: "मदरबोर्ड चिप-लेवल रिपेयरिंग (IC)",
    icon: Cpu,
    desc: "Advanced BGA rework station diagnostics for dead laptops, water-damaged motherboards, short power rails (19V), charging IC faults, and PCH controller repair."
  },
  {
    title: "Software, Drivers & Office Setup",
    hindi: "विंडोज व जरूरी सॉफ्टवेयर इंस्टालेशन",
    icon: Wrench,
    desc: "Complete operating system setup, official MS Office, graphic design software, Tally Prime, printer drivers, and essential utility installation."
  }
];

// Hardware Deals & Products (From Poster Image 1 & 2)
const WE_DEAL_IN_PRODUCTS = [
  {
    title: "New Laptops (On Order)",
    hindi: "नए ब्रांडेड लैपटॉप्स",
    desc: "Latest generation sealed-pack laptops from HP, Dell, Lenovo, Asus at discounted dealer rates with official manufacturer warranty.",
    icon: Laptop
  },
  {
    title: "Certified Refurbished Laptops",
    hindi: "सर्टिफाइड पुराने लैपटॉप्स",
    desc: "Rigidly tested corporate-grade laptops (Dell Latitude, ThinkPad, EliteBook) backed by warranty via our sister brand Refurhub.com.",
    icon: CheckCircle2
  },
  {
    title: "Desktop Computers & Custom PCs",
    hindi: "ऑफिस व गेमिंग डेस्कटॉप",
    desc: "Custom assembled desktop PCs for office work, cyber cafes, schools, video editing, CAD design, and high-performance gaming.",
    icon: Monitor
  },
  {
    title: "CCTV Camera & Security Systems",
    hindi: "CCTV कैमरा व इंस्टालेशन",
    desc: "Complete HD & IP CCTV setup with night vision, DVR/NVR configuration, and live mobile phone viewing for shops, godowns, schools & homes.",
    icon: Camera
  },
  {
    title: "Networking & Wi-Fi Solutions",
    hindi: "ऑफिस नेटवर्किंग व वाई-फाई",
    desc: "Commercial & residential Wi-Fi router installation, structured LAN cabling, gigabit switch setup, and high-speed office internet distribution.",
    icon: Wifi
  },
  {
    title: "Printers, Cartridges & Peripherals",
    hindi: "प्रिंटर्स व कार्ट्रिज रिफिल",
    desc: "Laserjet & inkjet printer repair, cartridge toner refilling, scanner setup, and genuine printer spare parts.",
    icon: Printer
  },
  {
    title: "Laptop & PC Accessories",
    hindi: "ओरिजिनल चार्जर व एसेसरीज",
    desc: "Original laptop chargers/adapters, replacement batteries, wireless keyboard/mouse combos, laptop bags, cooling pads, and cables.",
    icon: BatteryCharging
  }
];

// Laptop Care Tips (From Poster Image 1)
const LAPTOP_CARE_TIPS = [
  {
    title: "Keep your laptop cool and clean",
    tip: "Never use your laptop on a soft bed or pillow because it blocks the air intake vents underneath. Always place it on a flat desk or use a laptop cooling stand.",
    icon: "❄️"
  },
  {
    title: "Update your system regularly",
    tip: "Install official Windows and driver security patches. Keeping your operating system updated protects against malware and unexpected system crashes.",
    icon: "🔄"
  },
  {
    title: "Use original charger and battery",
    tip: "Cheap unbranded local duplicate chargers have unstable voltage that burns the motherboard power IC. Always use certified OEM power adapters.",
    icon: "🔋"
  },
  {
    title: "Don't ignore small warning signs",
    tip: "A rattling fan sound, high heating, or a tight hinge should never be ignored. Getting it serviced early prevents expensive display cracks or motherboard failure.",
    icon: "⚠️"
  },
  {
    title: "Regular backup keeps your data safe",
    tip: "Hard drives and SSDs can fail without advance notice. Always keep a secondary copy of your critical Tally data, photos, and documents on an external drive or cloud.",
    icon: "💾"
  }
];

// =========================================================================
// Cyber Cafe & Online Service Centre Data (All 11 Categories)
// =========================================================================
export const CYBER_CAFE_SERVICES = [
  {
    id: 1,
    title: "1. Online Government Services",
    hindi: "सरकारी नौकरी के आवेदन एवं ऑनलाइन योजनाएं",
    badge: "Govt Portals & Schemes",
    icon: Landmark,
    color: "blue",
    desc: "Complete, error-free application form filling for all state and central government recruitment, competitive exams, welfare schemes, and student scholarships.",
    services: [
      "Online Form Filling (ऑनलाइन फॉर्म भरना)",
      "सरकारी नौकरी के आवेदन (SSC, Railway, Police, UPSSSC, Banking)",
      "सरकारी भर्ती के फॉर्म (State & Central Govt Recruitment)",
      "Admit Card Download (प्रवेश पत्र डाउनलोड एवं प्रिंट)",
      "Online Exam Registration (परीक्षा पंजीकरण एवं स्लॉट बुकिंग)",
      "Exam Result Download (परीक्षा परिणाम एवं मेरिट लिस्ट)",
      "सरकारी योजनाओं के आवेदन (PM Awas, PM Kisan, etc.)",
      "Scholarship Form (UP Dashmottar, Post-Matric & NSP)",
      "E-KYC Services (Ration, PM Kisan, Bank e-KYC)",
      "Pension Online Application (वृद्धा, विधवा, दिव्यांग पेंशन)",
      "Labour Card Application (मजदूर / श्रमिक कार्ड पंजीयन)",
      "Employment Registration (रोजगार संगम / सेवायोजन पंजीयन)"
    ]
  },
  {
    id: 2,
    title: "2. Aadhaar Card Services",
    hindi: "आधार कार्ड सेवाएं",
    badge: "UIDAI Portal Assistance",
    icon: Fingerprint,
    color: "emerald",
    desc: "Official portal-assisted e-Aadhaar downloads, PVC plastic card orders, demographic address updates, and heavy-laminated crystal clear prints.",
    services: [
      "Aadhaar Card Download (ई-आधार कार्ड डाउनलोड)",
      "Aadhaar PVC Card Order (ओरिजिनल प्लास्टिक पीवीसी कार्ड ऑर्डर)",
      "Aadhaar Printout (हाई-क्वालिटी लेमिनेटेड प्रिंट)",
      "Aadhaar PVC Status Check (पीवीसी डिलीवरी स्टेटस जांच)",
      "Aadhaar Address Update (जहां अधिकृत ऑनलाइन सुविधा उपलब्ध हो)",
      "Aadhaar PVC Reprint (खोया हुआ आधार दोबारा मंगाना)"
    ]
  },
  {
    id: 3,
    title: "3. PAN Card Services",
    hindi: "पैन कार्ड सेवाएं",
    badge: "NSDL / UTIITSL Services",
    icon: CreditCard,
    color: "indigo",
    desc: "Instant new PAN card applications (Form 49A), minor-to-major conversion, corrections in name/DOB, instant digital e-PAN, and reprint dispatch.",
    services: [
      "New PAN Card Application (नया पैन कार्ड आवेदन - Form 49A)",
      "PAN Card Correction (नाम, जन्मतिथि, पिता का नाम सुधार)",
      "PAN Card Download (डिजिटल पैन कार्ड डाउनलोड)",
      "e-PAN Download (इंस्टेंट ई-पैन कार्ड प्राप्ति)",
      "PAN Card Reprint (टूटा या खोया पैन कार्ड दोबारा मंगाना)",
      "PAN-Aadhaar Linking Status Check (पैन-आधार लिंक स्थिति जांच)"
    ]
  },
  {
    id: 4,
    title: "4. Banking & Financial Services",
    hindi: "बैंकिंग एवं वित्तीय सेवाएं",
    badge: "AEPS & Money Transfer",
    icon: IndianRupee,
    color: "amber",
    desc: "Fast domestic money transfers (IMPS/NEFT/RTGS) to any bank across India, Aadhaar biometric cash withdrawal, balance enquiry, and mini statements.",
    services: [
      "Online Money Transfer (किसी भी बैंक खाते में तुरंत पैसा ट्रांसफर)",
      "NEFT / RTGS / IMPS (हाई-स्पीड बैंक ट्रांसफर)",
      "AEPS Services (अधिकृत एजेंट होने पर आधार फिंगरप्रिंट सेवा)",
      "Cash Withdrawal (अधिकृत एजेंट होने पर आधार से नकद निकासी)",
      "Balance Enquiry (खाता बैलेंस जांच)",
      "Mini Statement (अंतिम 10 लेन-देन पर्ची)",
      "Bank Account Opening Assistance (नया बैंक खाता खोलने में सहायता)",
      "Bank Statement Download (PDF बैंक स्टेटमेंट प्राप्त करें)",
      "Passbook Printing (जहां अधिकृत सुविधा उपलब्ध हो)"
    ]
  },
  {
    id: 5,
    title: "5. Printing & Documentation",
    hindi: "प्रिंटिंग एवं दस्तावेज़ कार्य",
    badge: "High-Speed Print & Xerox",
    icon: Printer,
    color: "sky",
    desc: "Ultra-sharp laser B&W and vibrant color printing, urgent photocopy/Xerox, scanning, heavy lamination, spiral binding, and 5-minute passport photos.",
    services: [
      "Black & White Printing (हाई-स्पीड सादा प्रिंटिंग)",
      "Colour Printing (रंगीन प्रिंटिंग - ग्लॉसी व बॉन्ड पेपर)",
      "Photocopy / Xerox (सस्ती एवं साफ फोटोकॉपी)",
      "Document Scanning (हाई-रिज़ॉल्यूशन PDF/JPG स्कैनिंग)",
      "Lamination (सुरक्षित वाटरप्रूफ हैवी लेमिनेशन)",
      "Spiral Binding (स्पाइरल व प्रोजेक्ट बाइंडिंग)",
      "ID Card Printing (स्मार्ट PVC पहचान पत्र प्रिंट)",
      "Passport Size Photo (तत्काल पासपोर्ट फोटो - 5 मिनट में)",
      "Photo Editing (फोटो बैकग्राउंड चेंज व क्लीनिंग)",
      "Resume Printing (प्रोफेशनल रिज्यूमे / बायोडाटा प्रिंट)",
      "PDF Printout (फोन / व्हाट्सएप / पेनड्राइव से डायरेक्ट प्रिंट)",
      "Document Formatting (दस्तावेज़ टाइपिंग एवं फॉर्मेटिंग)"
    ]
  },
  {
    id: 6,
    title: "6. Online Ticket Booking",
    hindi: "ऑनलाइन टिकट बुकिंग",
    badge: "IRCTC & Travel Desk",
    icon: Ticket,
    color: "rose",
    desc: "Fast, confirmed train reservation booking, Tatkal assistance, inter-state Volvo and roadways bus tickets, domestic & international air flight tickets.",
    services: [
      "Railway Ticket Booking (ट्रेन टिकट - कन्फर्म सीट बुकिंग)",
      "Bus Ticket Booking (UPSRTC रोडवेज एवं प्राइवेट एसी बस)",
      "Flight Ticket Booking (सस्ती डोमेस्टिक व इंटरनेशनल एयर टिकट)",
      "Train PNR Status (लाइव पीएनआर स्थिति जांच)",
      "Train Schedule (ट्रेन टाइम टेबल एवं लाइव रनिंग स्टेटस)",
      "Ticket Cancellation Assistance (टिकट कैंसिलेशन व रिफंड सहायता)",
      "Hotel Booking Assistance (यात्रा के लिए होटल रूम बुकिंग)"
    ]
  },
  {
    id: 7,
    title: "7. Government Certificate Services",
    hindi: "सरकारी प्रमाण पत्र सेवाएं",
    badge: "e-District UP Portal",
    icon: FileCheck,
    color: "teal",
    desc: "Timely submission on Uttar Pradesh e-District portal for all essential citizen certificates required for school/college admissions and govt jobs.",
    services: [
      "Income Certificate (आय प्रमाण पत्र)",
      "Caste Certificate (जाति प्रमाण पत्र - SC/ST/OBC/GEN)",
      "Domicile Certificate (निवास प्रमाण पत्र)",
      "Birth Certificate Application (जन्म प्रमाण पत्र)",
      "Death Certificate Application (मृत्यु प्रमाण पत्र)",
      "Residence Certificate (अधिवास प्रमाण पत्र)",
      "Character Certificate (चरित्र प्रमाण पत्र / पुलिस वेरिफिकेशन)",
      "EWS Certificate (आर्थिक रूप से कमजोर वर्ग प्रमाण पत्र - 10% कोटा)",
      "Family Register Copy (कुटुंब / परिवार रजिस्टर नकल)",
      "Ration Card Application (नया राशन कार्ड ऑनलाइन आवेदन)",
      "Ration Card Correction (राशन कार्ड में नाम जोड़ना / सुधार)"
    ]
  },
  {
    id: 8,
    title: "8. Job & Education Services",
    hindi: "शिक्षा एवं नौकरी सेवाएं",
    badge: "Students & Aspirants",
    icon: GraduationCap,
    color: "violet",
    desc: "Dedicated student and job-seeker support: Online recruitment applications, resume creation, university admission forms, entrance fees, and marksheet downloads.",
    services: [
      "Online Job Application (सरकारी एवं प्राइवेट नौकरी फॉर्म)",
      "Resume / CV Making (प्रोफेशनल बायोडाटा निर्माण)",
      "Job Registration (रोजगार मेला व सेवायोजन पोर्टल)",
      "University Admission Form (Allahabad University, CSJMU, etc.)",
      "College Admission Form (डिग्री कॉलेज एवं स्कूल प्रवेश फॉर्म)",
      "Scholarship Application (UP व नेशनल स्कॉलरशिप)",
      "Entrance Exam Forms (JEE, NEET, CUET, B.Ed, CTET, UPTET)",
      "Exam Fee Payment (ऑनलाइन परीक्षा शुल्क भुगतान)",
      "Marksheet Download (बोर्ड मार्कशीट व डिजीलॉकर)",
      "Migration Certificate Application (माइग्रेशन व डिग्री आवेदन)",
      "Result Download (रिजल्ट एवं रैंक कार्ड डाउनलोड)"
    ]
  },
  {
    id: 9,
    title: "9. Business & Document Services",
    hindi: "व्यापारिक एवं कानूनी दस्तावेज़",
    badge: "MSME, GST & Startup",
    icon: Briefcase,
    color: "orange",
    desc: "Legal registration and compliance for shopkeepers, traders, and small businesses: GST filing, Udyam MSME certificate, FSSAI food license, and Digital Signatures.",
    services: [
      "GST Registration Assistance (नया जीएसटी नंबर आवेदन सहायता)",
      "Udyam Registration (उद्यम आधार प्रमाण पत्र)",
      "MSME Registration (लघु एवं मध्यम उद्योग पंजीकरण)",
      "Shop Registration Assistance (दुकान एवं व्यापार पंजीकरण सहायता)",
      "FSSAI Registration Assistance (फूड लाइसेंस - होटल, किराना, रेस्टोरेंट)",
      "Online Business Registration (व्यापार का ऑनलाइन पंजीयन)",
      "Digital Signature Certificate (DSC - क्लास-3 डिजिटल सिग्नेचर)",
      "E-Tender Registration Assistance (ई-टेंडरिंग व बिड सबमिशन सहायता)"
    ]
  },
  {
    id: 10,
    title: "10. Insurance & Other Services",
    hindi: "बीमा एवं आवश्यक नागरिक सेवाएं",
    badge: "Bills, Recharge & RTO",
    icon: Car,
    color: "emerald",
    desc: "Instant two-wheeler and four-wheeler vehicle insurance, traffic e-challan checks, driving license assistance, voter ID, passport slots, and electricity bills.",
    services: [
      "Vehicle Insurance Assistance (बाइक, कार व कमर्शियल वाहन बीमा)",
      "Health Insurance Assistance (स्वास्थ्य बीमा सहायता)",
      "Life Insurance Assistance (जीवन बीमा सहायता)",
      "Vehicle Challan Check (ट्रैफिक चालान जांच एवं ऑनलाइन भुगतान)",
      "Driving Licence Application Assistance (ड्राइविंग लाइसेंस - Sarathi)",
      "Learner Licence Application (लर्निंग लाइसेंस ऑनलाइन फॉर्म)",
      "Voter ID Application (नया वोटर पहचान पत्र - NVSP)",
      "Voter ID Correction (वोटर कार्ड में नाम, पता सुधार)",
      "Passport Application Assistance (पासपोर्ट सेवा केंद्र स्लॉट बुकिंग)",
      "Electricity Bill Payment (बिजली बिल तुरंत चेक व भुगतान)",
      "Water Bill Payment (जल कर एवं नगर निगम बिल भुगतान)",
      "Mobile Recharge (सभी कंपनियों का तुरंत रिचार्ज)",
      "DTH Recharge (टाटा प्ले, एयरटेल, डिश टीवी रिचार्ज)"
    ]
  },
  {
    id: 11,
    title: "11. Computer & Internet Services",
    hindi: "कम्प्यूटर, इंटरनेट एवं ऑफिस कार्य",
    badge: "High-Speed Internet Hub",
    icon: Monitor,
    color: "blue",
    desc: "High-speed internet browsing cabins, Gmail assistance, online document uploads, PDF editing, format conversion, Excel work, and Hindi/English typing.",
    services: [
      "Internet Browsing (सुरक्षित एवं तेज इंटरनेट केबिन)",
      "Email Create & Send (नई ईमेल आईडी बनाना व महत्वपूर्ण मेल भेजना)",
      "Gmail Account Assistance (पासवर्ड रीसेट व रिकवरी सहायता)",
      "Online Document Upload (दस्तावेज़ साइज कंप्रेस व सुरक्षित अपलोड)",
      "PDF Editing (पीडीएफ सुधार, री-साइज व मर्ज करना)",
      "PDF to Word Conversion (पीडीएफ से वर्ड डॉक्यूमेंट बनाना)",
      "Word to PDF Conversion (वर्ड फाइल को पीडीएफ बनाना)",
      "Excel Work (माइक्रोसॉफ्ट एक्सेल डाटा एंट्री व हिसाब-किताब)",
      "Hindi & English Typing (कुर्तिदेव, मंगल व अंग्रेजी में तेज़ टाइपिंग)",
      "Online Application Submission (फॉर्म की अंतिम जांच व सबमिट)",
      "File Download & Upload (पेनड्राइव व ड्राइव में फाइल ट्रांसफर)"
    ]
  }
];

// Helper to compute live stage for CustomerSafeRecord
function computeSafeRecordStage(record: CustomerSafeRecord) {
  const status = (record.workStatus || "").toLowerCase();
  const final = (record.finalStatus || "").toLowerCase();

  if (record.actualDeliveryDate || final === "complete") {
    return {
      stage: 4,
      stageText: "Ready for Pickup / Delivered",
      notes: "Device inspection & burn-in passed. Ready for customer collection."
    };
  }
  if (status === "done" || final.includes("complete")) {
    return {
      stage: 4,
      stageText: "Repair Completed • Ready for Pickup",
      notes: "Components fitted and tested on bench station. Unit sanitized and bagged."
    };
  }
  if (status === "non repair" || final.includes("return")) {
    return {
      stage: 3,
      stageText: "Diagnosed • Return Item / Non Repairable",
      notes: "Hardware inspected under microscope. Customer advised regarding spares availability."
    };
  }
  if (status === "pending" || !status) {
    return {
      stage: 2,
      stageText: "In Diagnosis & Chip-Level Rework",
      notes: "Device logged in National Computer Prayagraj register. Bench testing in progress."
    };
  }
  return {
    stage: 1,
    stageText: "Device Checked In",
    notes: "Device received at service desk. Initial physical assessment recorded."
  };
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, paid: 0, unpaid: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Landing Page Interactive States
  const [heroTab, setHeroTab] = useState<"tickets" | "inventory" | "sales">("tickets");
  const [activeModuleTab, setActiveModuleTab] = useState<number>(0);
  const [activeIndustryTab, setActiveIndustryTab] = useState<number>(0);
  const [activeHardwareTab, setActiveHardwareTab] = useState<"solutions" | "products" | "tips">("solutions");
  const [isAnnualPricing, setIsAnnualPricing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Cyber Cafe & Online Services Interactive State
  const [cyberSearchQuery, setCyberSearchQuery] = useState("");
  const [selectedCyberCategory, setSelectedCyberCategory] = useState<number | null>(null);

  // Privacy-Protected Track Repair Widget State
  const [trackJobId, setTrackJobId] = useState("");
  const [trackPhone, setTrackPhone] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<CustomerSafeRecord | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  // Contact Form State
  const [selectedServices, setSelectedServices] = useState<string[]>(["Web Development"]);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactBusiness, setContactBusiness] = useState("");
  const [contactBudget, setContactBudget] = useState("₹25k - ₹75k");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentUser: any = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
          
          // Role redirect
          if (currentUser.role === "SUPER_ADMIN") {
            router.push("/admin");
            return;
          }

          // Fetch dashboard stats only if subscription is active
          if (currentUser.subscriptionActive) {
            const records = await getRecordsFromDB();
            const total = records.length;
            const paid = records.filter(r => r.isPaid).length;
            const unpaid = records.filter(r => !r.isPaid).length;
            setStats({ total, paid, unpaid });
          }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to load user or records:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = trackPhone.replace(/\D/g, "");
    if (cleanDigits.length < 10) {
      setTrackError("Please enter your 10-digit registered mobile number to verify ownership.");
      setTrackResult(null);
      setTrackSearched(true);
      return;
    }

    setTrackLoading(true);
    setTrackError(null);

    try {
      const res = await getCustomerRepairRecords({
        phone: cleanDigits,
        jobNumber: trackJobId.trim() || undefined
      });

      if (res.success && res.records && res.records.length > 0) {
        setTrackResult(res.records[0]);
        setTrackError(null);
      } else {
        setTrackResult(null);
        setTrackError(res.error || "No repair record found matching this mobile number and Job ID.");
      }
      setTrackSearched(true);
    } catch (err: any) {
      setTrackResult(null);
      setTrackError("Unable to verify repair status. Please try again or open our Customer Portal.");
      setTrackSearched(true);
    } finally {
      setTrackLoading(false);
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactSubmitting) return;
    setContactSubmitting(true);

    const fullMessage = `[PROJECT INQUIRY]\nServices: ${selectedServices.join(", ")}\nBusiness Name: ${contactBusiness || "N/A"}\nBudget/Timeline: ${contactBudget}\nBrief: ${contactMessage}`;

    try {
      await createSupportRequest(contactName, contactPhone, fullMessage);
      setContactSubmitted(true);
    } catch (err) {
      console.error(err);
      setContactSubmitted(true); // Graceful UX confirmation
    } finally {
      setContactSubmitting(false);
    }
  };

  const triggerExportMock = () => {
    setExportNotice("Exported national_computer_repair_register.xlsx (556 records saved to local drive)");
    setTimeout(() => setExportNotice(null), 3500);
  };

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 text-slate-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-semibold text-sm animate-pulse">Initializing National Computer Portal...</p>
      </main>
    );
  }

  // =========================================================================
  // 1. PUBLIC WEBSITE (When user is NOT logged in)
  // =========================================================================
  if (!user) {
    return (
      <main id="home" className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden w-full selection:bg-blue-600 selection:text-white">
        
        {/* Ambient Subtle Tech Lighting Gradients */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-transparent blur-[120px] pointer-events-none -z-10" />
        <div className="fixed top-[45%] right-[-10%] w-[550px] h-[550px] bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none -z-10" />

        {/* ===================================================================
            SECTION B: HERO SECTION
        =================================================================== */}
        <section className="relative pt-12 md:pt-20 pb-16 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headline & Action Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Pillar Badges Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span>Web • Custom Software • Public SaaS • IT Solutions</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-950">
                Web Development,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
                  Custom Software
                </span>{" "}
                & Complete IT Solutions.
              </h1>

              {/* Sub-headline */}
              <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
                At National Computer Allahabad, we build modern websites, engineer custom business software, offer public-use SaaS tools for repair & retail shops, and deliver expert IT support in Prayagraj.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#software"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <Sparkles size={16} />
                  <span>Explore Public Software</span>
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider text-slate-800 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
                >
                  <Send size={15} className="text-blue-600" />
                  <span>Get a Web / Software Quote</span>
                </a>
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">12+ Years</div>
                  <div className="text-xs text-slate-600 font-semibold mt-0.5">Engineering Lab</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">550+</div>
                  <div className="text-xs text-slate-600 font-semibold mt-0.5">Shops & Clients</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-blue-600">99.9%</div>
                  <div className="text-xs text-slate-600 font-semibold mt-0.5">Cloud SaaS Uptime</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">Prayagraj</div>
                  <div className="text-xs text-slate-600 font-semibold mt-0.5">Flagship Studio</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive UI Mockup Preview Card */}
            <div className="lg:col-span-5 relative">
              
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-400/30 via-indigo-400/20 to-emerald-400/20 rounded-[2.5rem] blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

              {/* Dashboard Preview Window */}
              <div className="bg-white border border-slate-200 shadow-2xl shadow-slate-200/80 rounded-[2.2rem] p-5 sm:p-6 space-y-4">
                
                {/* Simulated Window Frame Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-[11px] font-mono text-slate-500">cloud.nationalcomputerallahabad.com</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                    Live SaaS Demo
                  </span>
                </div>

                {/* Metric Counters Banner */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600">Active Jobs</div>
                    <div className="text-base font-black text-slate-900 mt-0.5">24</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600">Today Sales</div>
                    <div className="text-base font-black text-emerald-600 mt-0.5">₹18,600</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-semibold text-slate-600">Parts Low</div>
                    <div className="text-base font-black text-amber-600 mt-0.5">3 Items</div>
                  </div>
                </div>

                {/* Low-Stock Warning Alert Badge (< 5 units) */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-800">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle size={15} className="text-amber-600 shrink-0" />
                    <span>Low Stock Alert: NVMe 512GB SSD (<strong className="font-bold text-slate-900">&lt; 5 units</strong> left)</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-extrabold rounded text-[10px] uppercase shrink-0">
                    Reorder
                  </span>
                </div>

                {/* Interactive Inner Filter Tabs */}
                <div className="flex items-center justify-between gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setHeroTab("tickets")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      heroTab === "tickets" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Repairs (3)
                  </button>
                  <button
                    onClick={() => setHeroTab("inventory")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      heroTab === "inventory" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Parts Stock
                  </button>
                  <button
                    onClick={() => setHeroTab("sales")}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      heroTab === "sales" ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Counter Sales
                  </button>
                </div>

                {/* Tab Dynamic Body */}
                <div className="space-y-2 min-h-[175px]">
                  {heroTab === "tickets" && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      {HERO_TICKETS.map(t => (
                        <div key={t.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:border-slate-300 transition-colors">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-blue-600">{t.id}</span>
                              <span className="text-xs font-bold text-slate-900">{t.customer}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">{t.device} • {t.issue}</div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              t.statusColor === "emerald" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : t.statusColor === "blue"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}>
                              {t.status}
                            </span>
                            <div className="text-xs font-extrabold text-slate-900 mt-0.5">{t.amount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {heroTab === "inventory" && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      {HERO_PARTS.map(p => (
                        <div key={p.name} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-slate-900">{p.name}</div>
                            <div className="text-[11px] text-slate-600">{p.category} • Cost Price: {p.price}</div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              p.alert ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700"
                            }`}>
                              {p.stock} In Stock
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {heroTab === "sales" && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      {HERO_SALES.map(s => (
                        <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-emerald-700 font-bold">{s.id}</span>
                              <span className="text-xs font-bold text-slate-900">{s.client}</span>
                            </div>
                            <div className="text-[11px] text-slate-600">{s.item}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-black text-emerald-700">{s.amount}</div>
                            <div className="text-[10px] text-slate-500">{s.date}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mockup Action Footer Bar */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-200">
                  <button
                    onClick={triggerExportMock}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-300 active:scale-95"
                    title="Export active registry records"
                  >
                    <Download size={13} className="text-emerald-600" />
                    <span>Export .XLSX</span>
                  </button>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-blue-600/25 active:scale-95"
                  >
                    <PlusCircle size={13} />
                    <span>Launch Full App</span>
                  </button>
                </div>

                {/* Export Toast Notification */}
                {exportNotice && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold text-center animate-in fade-in slide-in-from-bottom-2">
                    {exportNotice}
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ===================================================================
            SECTION C: 4 CORE BUSINESS PILLARS GRID ("WHAT WE DO")
        =================================================================== */}
        <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-widest">
              Comprehensive Technology Offerings
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Four Core Pillars of Our IT Studio
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              From crafting digital presences to architecting custom business software and delivering precision chip-level hardware repair in Prayagraj.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Pillar 1: Web Development */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/60 hover:shadow-xl shadow-sm transition-all duration-300 space-y-5 relative">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Globe size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  1. Web Development
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Custom corporate websites, high-converting e-commerce stores, full-stack web applications, and cloud server deployment.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                  <span>Next.js 16, React, Node.js & High-Speed Tailwind CSS</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                  <span>Technical SEO optimization & Core Web Vitals under 1.0s</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                  <span>Integrated Indian payment gateways (UPI, Cards, NetBanking)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                  <span>AWS & Vercel automated CI/CD cloud deployment</span>
                </li>
              </ul>
              <div className="pt-2">
                <a 
                  href="#contact" 
                  onClick={() => setSelectedServices(["Web Development"])}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-all"
                >
                  <span>Request Web Development Quote</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Pillar 2: Custom Software Development */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500/60 hover:shadow-xl shadow-sm transition-all duration-300 space-y-5 relative">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Code2 size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                  2. Custom Software Development
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Tailor-made ERP, CRM, POS billing systems, and business workflow automation built around your exact operations.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                  <span>Tailored relational database modeling (PostgreSQL / Prisma)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                  <span>Granular role-based staff permissions (Admin, Cashier, Technician)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                  <span>Real-time WhatsApp & SMS API business triggers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-indigo-600 shrink-0" />
                  <span>Automated GST billing, inventory reduction & audit logs</span>
                </li>
              </ul>
              <div className="pt-2">
                <a 
                  href="#contact" 
                  onClick={() => setSelectedServices(["Custom Software / ERP"])}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-700 group-hover:translate-x-1 transition-all"
                >
                  <span>Discuss Custom Software Specs</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Pillar 3: Public-Use SaaS Software (Flagship Product) */}
            <div className="group p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 border-2 border-blue-500/40 hover:border-blue-500 hover:shadow-xl shadow-md transition-all duration-300 space-y-5 relative">
              <div className="absolute top-6 right-6">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                  Flagship Cloud Product
                </span>
              </div>
              <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 transition-all">
                <Database size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  3. Public-Use SaaS Software
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Ready-to-use cloud software for computer & mobile repair shops to manage tickets, parts stock, sales, and Excel backups—open for anyone to sign up and use.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Instant cloud access with zero software installation needed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>4 core modules: Registry, Inventory, Direct Sales & Excel Sync</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Automated WhatsApp customer reminder notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Multi-device compatibility: Desktop, Tablet & Smartphone</span>
                </li>
              </ul>
              <div className="pt-2 flex items-center gap-4">
                <a 
                  href="#software" 
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 group-hover:translate-x-1 transition-all"
                >
                  <span>Explore SaaS Spotlight</span>
                  <ArrowRight size={14} />
                </a>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  Launch App
                </button>
              </div>
            </div>

            {/* Pillar 4: IT Hardware Repair & Corporate AMC */}
            <div className="group p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/60 hover:shadow-xl shadow-sm transition-all duration-300 space-y-5 relative">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Wrench size={26} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                  4. Chip-Level Repair & Corporate AMC
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                  Trusted hardware diagnostics, motherboard repair, and office AMC in Prayagraj. Equipped with advanced BGA rework stations and precision micro-soldering labs.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 font-semibold pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Laptop motherboard chip-level repair (Power IC, IO Controller, PCH)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Comprehensive Annual Maintenance Contracts (AMC) for corporate offices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>Fast turnaround with genuine OEM replacement components</span>
                </li>
              </ul>
              
              {/* Prominent Refurhub Sister Brand Link */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider">Sister Hardware Division</div>
                  <div className="text-xs text-slate-800 font-semibold">Looking to buy refurbished laptops or spare parts?</div>
                </div>
                <a
                  href="https://refurhub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                >
                  <span>Visit Refurhub.com</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Cyber Cafe & Citizen Services Quick Callout Banner */}
            <div className="md:col-span-2 p-6 rounded-3xl bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/90 border border-blue-200/90 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                  <Landmark size={24} />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                    Also Available In-Store
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-950">
                    National Computer Cyber Cafe & Online Citizen Service Centre
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Sarkari Job Forms, Admit Cards, Aadhaar/PAN, e-District Certificates, Banking AEPS, Ticket Booking & High-Speed Xerox.
                  </p>
                </div>
              </div>
              <a
                href="#cyber-cafe"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-600/25 transition-all hover:scale-105"
              >
                <span>Explore 100+ Services (11 Categories)</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>
        </section>

        {/* ===================================================================
            SECTION C2: WEBSITES BUILT FOR INDIAN BUSINESSES & PROFESSIONALS
        =================================================================== */}
        <section id="business-web" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-widest">
              <Globe size={13} />
              <span>Tailored Digital Growth for India</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
              Websites Built for Indian Businesses & Professionals
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              Aapki local dukaan ya profession ko Google par laayein — zyada customers, direct WhatsApp calls aur 100% bharosa paayein.
            </p>
          </div>

          {/* Industry Horizontal Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
            {BUSINESS_WEBSITE_SOLUTIONS.map(sol => {
              const isSelected = activeIndustryTab === sol.id;
              const IconComp = sol.icon;
              return (
                <button
                  key={sol.id}
                  onClick={() => setActiveIndustryTab(sol.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950 shadow-sm"
                  }`}
                >
                  <IconComp size={22} className={isSelected ? "text-white mb-2" : "text-blue-600 mb-2"} />
                  <div>
                    <div className="font-black text-xs leading-tight">{sol.title}</div>
                    <div className={`text-[10px] mt-1 font-semibold ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                      {sol.hindiTag}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Industry Deep Dive Feature Card */}
          {(() => {
            const currentSol = BUSINESS_WEBSITE_SOLUTIONS[activeIndustryTab];
            const CurrentIcon = currentSol.icon;
            return (
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sm:p-10 shadow-xl relative overflow-hidden space-y-8 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header Strip */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-extrabold uppercase tracking-wider">
                        {currentSol.badge}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">• {currentSol.hindiTag}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                      {currentSol.title}
                    </h3>
                    <p className="text-blue-600 text-sm font-bold">
                      {currentSol.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Timeline:</span>
                      <span className="text-xs font-black text-emerald-700">{currentSol.timeline}</span>
                    </div>
                  </div>
                </div>

                {/* Problem vs Solution 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Indian Business Challenge */}
                  <div className="lg:col-span-5 p-6 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-900">
                      <AlertTriangle size={15} className="text-amber-700" />
                      <span>Kyun Zaroori Hai Website? (The Challenge)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
                      &ldquo;{currentSol.problem}&rdquo;
                    </p>
                    <div className="pt-2 border-t border-amber-200/80">
                      <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1">Kiske Liye Best Hai (Ideal For):</span>
                      <p className="text-xs text-amber-950 font-semibold">{currentSol.idealFor}</p>
                    </div>
                  </div>

                  {/* Right Column: Exact What We Build */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-800">
                      <CheckCircle2 size={15} className="text-emerald-600" />
                      <span>National Computer Kya Banakar Deta Hai (Features Included):</span>
                    </div>

                    <div className="space-y-3">
                      {currentSol.solutions.map((feat, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:border-blue-400 hover:bg-blue-50/40 transition-colors">
                          <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-slate-800 font-semibold leading-snug">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                      <a
                        href={`https://wa.me/917860130721?text=${encodeURIComponent(
                          `Hello National Computer, I am interested in building a website for ${currentSol.title} (${currentSol.hindiTag}). Please share packages and demo.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                      >
                        <MessageSquare size={16} />
                        <span>Discuss {currentSol.title} on WhatsApp</span>
                      </a>

                      <a
                        href="#contact"
                        onClick={() => setSelectedServices([currentSol.title])}
                        className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
                      >
                        <span>Request Official Project Quote</span>
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

        </section>

        {/* ===================================================================
            SECTION D: FLAGSHIP PUBLIC SOFTWARE SPOTLIGHT SECTION
        =================================================================== */}
        <section id="software" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-widest">
              <Sparkles size={13} />
              <span>Flagship SaaS Platform</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
              Built by Technicians, Open for Everyone.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Running a repair shop shouldn&apos;t mean losing track of job numbers or inventory. Our cloud platform gives any service center the tools to operate like a tier-1 service company.
            </p>
          </div>

          {/* Interactive Module Selector Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { id: 0, title: "1. Repair Registry", subtitle: "Customer & Device Intake", icon: Laptop },
              { id: 1, title: "2. Parts Inventory", subtitle: "Stock & Low-Stock Alerts", icon: Package },
              { id: 2, title: "3. Log Shop Sales", subtitle: "Direct Counter Billing", icon: ShoppingCart },
              { id: 3, title: "4. Excel Sync Backups", subtitle: "1-Click Offline Backups", icon: Download }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveModuleTab(tab.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                  activeModuleTab === tab.id
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25 scale-[1.02]"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950 shadow-sm"
                }`}
              >
                <tab.icon size={22} className={activeModuleTab === tab.id ? "text-white mb-2" : "text-blue-600 mb-2"} />
                <div>
                  <div className="font-black text-sm">{tab.title}</div>
                  <div className={`text-xs mt-0.5 ${activeModuleTab === tab.id ? "text-blue-100" : "text-slate-500"}`}>
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Module Detailed Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden mb-16 text-slate-900">
            
            {activeModuleTab === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                    Core Module 1: Comprehensive Intake
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                    Digital Repair Registry & Job Tracking
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Log laptop brands, main issues, customer configurations, device passwords/patterns, digital signature status, and expected delivery countdown timers. Say goodbye to forgotten notes on customer paper slips.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-semibold pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Device Passcode / Pattern Save</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Charger Collected Checkbox</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Digital Customer Signature</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Expected Delivery Deadline</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
                    >
                      <span>Try Registry In Live Demo</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Laptop size={18} className="text-blue-600" />
                      <span className="font-bold text-sm text-slate-900">Sample Job Record: JOB-1285</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded uppercase">
                      Active Ticket
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Customer Name:</span>
                      <span className="font-bold text-slate-900">Ved Prakash (+91 98390 XXXXX)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Laptop Brand & Model:</span>
                      <span className="font-bold text-slate-900">Dell Vostro 3568 (Core i3)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Reported Problem:</span>
                      <span className="font-bold text-amber-800">Charging Jack Broken & Power Pin Loose</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Charger Collected:</span>
                      <span className="font-bold text-emerald-700">Yes (With Power Cord)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">Customer Signature:</span>
                      <span className="font-bold text-blue-600">Digitally Verified on Intake</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Estimated Cost:</span>
                      <span className="font-black text-sm text-slate-950">₹650.00 (Unpaid)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                    Core Module 2: Warehouse Control
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                    Parts Inventory with Auto Low-Stock Alarms
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Add screens, SSDs, keyboards, RAM sticks, and chargers. Monitor live stock levels with auto-triggered low-stock warnings when inventory drops below 5 units so your workshop never halts mid-repair.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-semibold pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>&lt; 5 Units Low-Stock Alarm</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Part SKU / Serial Barcode</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Cost vs Sale Price Margin</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>1-Click Stock Adjustment</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
                    >
                      <span>Explore Inventory Module</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <Package size={18} className="text-emerald-600" />
                      <span className="font-bold text-sm text-slate-900">Live Spare Parts Roster</span>
                    </div>
                    <span className="text-[11px] text-slate-500">Showing 3 of 84 items</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Western Digital 500GB NVMe SSD</div>
                        <div className="text-[10px] text-red-600 font-extrabold">⚠️ Warning: Only 2 units remaining (&lt; 5 threshold)</div>
                      </div>
                      <span className="px-2 py-1 bg-red-100 text-red-700 font-black text-xs rounded">
                        2 Left
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">14.0&quot; LED Slim 40-Pin HD Display</div>
                        <div className="text-[10px] text-slate-500">Stock Status: Healthy</div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-black text-xs rounded">
                        11 Left
                      </span>
                    </div>

                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Universal 65W Laptop Charger (19.5V)</div>
                        <div className="text-[10px] text-slate-500">Stock Status: Healthy</div>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 font-black text-xs rounded">
                        22 Left
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold uppercase tracking-wider">
                    Core Module 3: Retail Sales
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                    Counter Spare Part Sales & Auto Stock Deduction
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Make direct sales entries of spare parts to clients. Automatically deducts stock levels from your warehouse in real time and records daily transaction logs with profit metrics.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-semibold pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Instant Inventory Deduction</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Cash / Online / UPI Tracking</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Daily Revenue Analytics</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Print Thermal Bill Slips</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
                    >
                      <span>Test Counter Sales Entry</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={18} className="text-indigo-600" />
                      <span className="font-bold text-sm text-slate-900">Direct Counter Checkout</span>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">
                      Invoice #NC-9821
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs">
                    <div className="flex justify-between text-slate-700">
                      <span>1x Crucial BX500 480GB SATA SSD</span>
                      <span className="font-bold text-slate-900">₹2,450.00</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>1x 2.5&quot; USB 3.0 External Caddy</span>
                      <span className="font-bold text-slate-900">₹450.00</span>
                    </div>
                    <div className="flex justify-between text-slate-700 border-t border-slate-200 pt-2 font-bold">
                      <span className="text-emerald-700">Total Billed:</span>
                      <span className="text-emerald-700 text-sm font-black">₹2,900.00</span>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>Inventory stock deducted automatically: Crucial SSD (9 → 8 units)</span>
                  </div>
                </div>
              </div>
            )}

            {activeModuleTab === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-6 space-y-5">
                  <span className="px-3 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider">
                    Core Module 4: Offline Security
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                    Excel Sync & 1-Click Backup Export
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Bulk import existing Excel worksheets or download active register lists in one click for offline accounting, CA audits, or safe local backups. You own 100% of your business records.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-semibold pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>1-Click .XLSX Export</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Bulk Excel File Uploader</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Offline Accounting Peace</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Encrypted Cloud Sync</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={triggerExportMock}
                      className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2"
                    >
                      <Download size={14} />
                      <span>Simulate Excel Export Now</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
                    <Download size={28} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Bulk Spreadsheet Engine</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                    Already have hundreds of jobs recorded in Microsoft Excel or Google Sheets? Upload your spreadsheet to automatically migrate all historical records into your cloud register.
                  </p>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700">
                    File: NCA_Repair_Registry_2026.xlsx • Verified 556 Records
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Smart Add-on Highlights (3 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <QrCode size={20} />
              </div>
              <h4 className="font-black text-slate-900 text-base">QR Code Receipt Tracking</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Every repair intake receipt generates a unique QR code. Customers simply scan it with their phone camera to view live diagnostic and component status without disturbing your counter technicians.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <h4 className="font-black text-slate-900 text-base">Automated WhatsApp Alerts</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Dispatches pre-formatted WhatsApp notifications on intake (&ldquo;Dear Customer, we received Job #1285...&rdquo;) and completion (&ldquo;Job #1285 is Ready! Amount: ₹280...&rdquo;) directly to customer numbers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h4 className="font-black text-slate-900 text-base">GST Invoice & Thermal Bills</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Produce professional 80mm thermal POS counter slips or formal A4 GST tax invoices featuring your shop name, logo, GSTIN, HSN codes, and legal terms in 1-click.
              </p>
            </div>

          </div>

          {/* =================================================================
              SaaS Free vs Pro Quick Comparison Toggle
          ================================================================== */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl max-w-4xl mx-auto">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-950 tracking-tight">SaaS Subscription Plans</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">Transparent, technician-friendly pricing for single stores & multi-branch hubs.</p>
              </div>

              {/* Billing Cycle Toggle */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setIsAnnualPricing(false)}
                  className={`py-1.5 px-3 rounded-lg transition-all ${
                    !isAnnualPricing ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnualPricing(true)}
                  className={`py-1.5 px-3 rounded-lg transition-all flex items-center gap-1.5 ${
                    isAnnualPricing ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>Annual</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-white font-black text-[9px] rounded uppercase">
                    Save 25%
                  </span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Plan 1: Free Forever */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-lg text-slate-950">Community Free Tier</h4>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded uppercase">
                    Zero Cost
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-950">
                  ₹0 <span className="text-xs text-slate-500 font-semibold">/ Free Forever</span>
                </div>
                <p className="text-xs text-slate-600 font-medium">Ideal for small repair shops or technicians getting started with digital registers.</p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Up to 50 active repair tickets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Basic parts inventory (up to 25 items)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Manual WhatsApp alerts via web chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Single store manager login</span>
                  </li>
                </ul>
                <Link
                  href="/register"
                  className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl block text-center transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Plan 2: Pro Storekeeper */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/70 via-white to-blue-50/30 border-2 border-blue-500 space-y-4 relative shadow-lg">
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded uppercase tracking-wider shadow-sm">
                    Most Popular
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-lg text-slate-950">Pro Storekeeper Plan</h4>
                </div>
                <div className="text-3xl font-black text-slate-950">
                  {isAnnualPricing ? "₹375" : "₹499"}{" "}
                  <span className="text-xs text-slate-500 font-semibold">
                    / month {isAnnualPricing && "(Billed ₹4,499 annually)"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">For busy repair centers handling daily customer volume and spare parts sales.</p>
                <ul className="space-y-2 text-xs text-slate-800 font-semibold">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Unlimited repair jobs & complete history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Unlimited parts inventory with &lt; 5 stock alarms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>Automated WhatsApp customer reminder dispatch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>1-Click Excel backup export & bulk sheet import</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600" />
                    <span>GST tax invoices & 80mm thermal slip printing</span>
                  </li>
                </ul>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl block text-center shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5"
                >
                  Create Free Account / Try Live Demo
                </button>
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================================
            SECTION D2: EXPERT LAPTOP REPAIR, IT SOLUTIONS & HARDWARE HUB
            (From Official Shop Poster & Service Banner)
        =================================================================== */}
        <section id="hardware-it" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-black text-emerald-800 uppercase tracking-widest">
              <Award size={13} className="text-emerald-600" />
              <span>YOUR ONE-STOP SOLUTION FOR ALL LAPTOP PROBLEMS • TRUSTED SINCE 2015</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">
              Expert Laptop Repair & Complete IT Solutions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              Chip-level motherboard repair, same-day cracked screen replacement, virus removal, CCTV cameras, and office networking. Serving Prayagraj at Rashoolabad Chauraha, Teliarganj.
            </p>
          </div>

          {/* We Repair All Brands Strip */}
          <div className="mb-12 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-500">
              We Repair & Service All Major Laptop & Desktop Brands:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {REPAIRED_BRANDS.map(brand => (
                <div 
                  key={brand.name}
                  className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${brand.color}`} />
                  <span className="font-black text-sm text-slate-900 tracking-wide">{brand.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Interactive View Switcher Tabs */}
          <div className="flex bg-slate-100 border border-slate-200 p-1.5 rounded-2xl max-w-2xl mx-auto mb-10 shadow-sm">
            {[
              { id: "solutions", label: "1. Diagnosis & Solutions", icon: Wrench, count: "8 Services" },
              { id: "products", label: "2. We Also Deal In", icon: Package, count: "7 Categories" },
              { id: "tips", label: "3. Laptop Care Tips", icon: ShieldCheck, count: "5 Tips" },
            ].map(tab => {
              const isActive = activeHardwareTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveHardwareTab(tab.id as any)}
                  className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 font-black"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <TabIcon size={15} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: DIAGNOSIS & SOLUTIONS GRID (8 Common Issues from Poster) */}
          {activeHardwareTab === "solutions" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {HARDWARE_SOLUTIONS.map((item, idx) => {
                  const IconC = item.icon;
                  return (
                    <div 
                      key={idx}
                      className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/60 hover:shadow-xl shadow-sm transition-all space-y-3 group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-11 h-11 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <IconC size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[11px] font-bold text-blue-600 block mt-0.5">{item.hindi}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <a
                          href={`https://wa.me/917860130721?text=${encodeURIComponent(
                            `Hello National Computer, my laptop has an issue with: ${item.title}. Can I bring it to your Teliarganj center?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>Book Repair on WhatsApp</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: WE ALSO DEAL IN (Products & IT Infrastructure from Poster) */}
          {activeHardwareTab === "products" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {WE_DEAL_IN_PRODUCTS.map((prod, idx) => {
                  const IconP = prod.icon;
                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500/60 hover:shadow-xl shadow-sm transition-all space-y-3 group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          <IconP size={22} />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {prod.title}
                          </h4>
                          <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">{prod.hindi}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                          {prod.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <a
                          href={`https://wa.me/917860130721?text=${encodeURIComponent(
                            `Hello National Computer, I am inquiring about pricing and availability for: ${prod.title}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                        >
                          <span>Inquire Price on WhatsApp</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LAPTOP CARE TIPS (Directly from Poster Image 1) */}
          {activeHardwareTab === "tips" && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl mx-auto">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
                <span className="text-xs font-bold text-blue-900">
                  National Computer Allahabad Golden Care Guide: Follow these 5 proven maintenance rules to keep your laptop fast and prevent sudden failures.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {LAPTOP_CARE_TIPS.map((tip, idx) => (
                  <div 
                    key={idx}
                    className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-start gap-4"
                  >
                    <span className="text-3xl shrink-0 p-2 rounded-2xl bg-slate-50 border border-slate-200">
                      {tip.icon}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900">{tip.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {tip.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Our Promise & Trust Badges (From Poster Image 1 & 2) */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-50 border border-blue-200 shadow-sm space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700">Our Service Guarantee</span>
              <h3 className="text-2xl font-black text-slate-950">Why Customers Trust National Computer Since 2015</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
              {[
                { title: "Quality Service", desc: "Expert certified chip technicians" },
                { title: "Affordable Price", desc: "Fair rates, no hidden fees" },
                { title: "100% Genuine Parts", desc: "Original OEM screens & ICs" },
                { title: "Warranty on Service", desc: "Warranty backed repairs" },
                { title: "Same Day Service", desc: "Fast turnaround on intake" },
                { title: "Customer Satisfaction", desc: "5,000+ happy clients in UP" },
              ].map((prom, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
                  <CheckCircle2 size={16} className="text-emerald-600 mx-auto mb-1" />
                  <div className="text-xs font-black text-slate-900">{prom.title}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{prom.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Shop Location, Timings & Payment Strip (From Poster Image 1 & 2) */}
          <div className="mt-8 p-6 rounded-3xl bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin size={16} className="text-blue-600" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Rashoolabad Chauraha, Teliarganj, Prayagraj
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-slate-600 font-medium">
                <Clock size={14} className="text-emerald-600" />
                <span>Open Everyday: <strong className="text-slate-900 font-bold">10:00 AM – 10:00 PM</strong> (10 AM - 2 PM & 5 PM - 10 PM)</span>
              </div>
              <div className="text-xs text-slate-600">
                Payment Options: <strong className="text-slate-900 font-semibold">Cash • UPI (GPay, PhonePe, Paytm, BHIM) • Debit/Credit Card • Wallet</strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <a
                href="tel:7786961902"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all"
              >
                <Phone size={14} />
                <span>Call 7786961902</span>
              </a>

              <a
                href="https://wa.me/917860130721?text=Hello%20National%20Computer,%20I%20want%20to%20visit%20your%20Teliarganj%20center%20for%20laptop%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
              >
                <MessageSquare size={14} />
                <span>WhatsApp 7860130721</span>
              </a>
            </div>
          </div>

        </section>

        {/* ===================================================================
            SECTION D3: CYBER CAFE & ONLINE / OFFLINE SERVICE CENTRE
        =================================================================== */}
        <section id="cyber-cafe" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-widest">
              <Landmark size={13} />
              <span>National Computer • Teliarganj Prayagraj</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
              Cyber Cafe & Online / Offline Services
            </h2>
            <div className="text-blue-700 text-base sm:text-lg font-bold">
              नेशनल कम्प्यूटर: साइबर कैफे एवं जन सेवा केंद्र • All Types of Online & Offline Services
            </div>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              Prayagraj&apos;s trusted single-window digital service hub at Rashoolabad Chauraha, Teliarganj. From Sarkari job application forms, scholarships, and e-District certificates (Income/Caste/Niwas) to Aadhaar, PAN, banking AEPS, fast ticket bookings, and crystal-clear laser printing—all under one roof.
            </p>
          </div>

          {/* Quick Hub Stats & Live Shop Info Bar */}
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 border border-blue-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-200">
              <div className="space-y-1 md:pr-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-blue-700">Total Digital Services</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950">100+ Services</div>
                <div className="text-xs text-slate-600 font-medium">11 comprehensive categories</div>
              </div>

              <div className="space-y-1 pt-4 md:pt-0 md:px-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">Shop Location</div>
                <div className="text-base font-bold text-slate-950">Rashoolabad Chauraha</div>
                <div className="text-xs text-slate-600 font-medium">Teliarganj, Prayagraj, UP</div>
              </div>

              <div className="space-y-1 pt-4 md:pt-0 md:px-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700">Opening Hours</div>
                <div className="text-base font-bold text-slate-950">10:00 AM – 10:00 PM</div>
                <div className="text-xs text-slate-600 font-medium">Open Everyday (Mon – Sun)</div>
              </div>

              <div className="space-y-1 pt-4 md:pt-0 md:pl-4">
                <div className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">Instant Assistance</div>
                <div className="flex flex-col gap-1 pt-0.5">
                  <a href="tel:7786961902" className="text-xs font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 justify-center md:justify-start">
                    <Phone size={13} className="text-blue-600" />
                    <span>Call: 7786961902</span>
                  </a>
                  <a href="https://wa.me/917860130721?text=Hello%20National%20Computer,%20I%20need%20assistance%20with%20cyber%20cafe%20online%20services." target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 justify-center md:justify-start">
                    <MessageSquare size={13} className="text-emerald-600" />
                    <span>WhatsApp: 7860130721</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4 Trust Highlights */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                <span>100% Error-Free Form Filling</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Strict Document Confidentiality</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                <span>Government Authorized Rates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-sky-600 shrink-0" />
                <span>Instant Slip & WhatsApp PDF</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Search & Category Filter */}
          <div className="space-y-6 mb-10">
            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={cyberSearchQuery}
                onChange={e => setCyberSearchQuery(e.target.value)}
                placeholder="Search any service (e.g. Aadhaar, PAN, Railway Ticket, आय प्रमाण पत्र, Scholarship, Resume, Bill)..."
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              />
              {cyberSearchQuery && (
                <button
                  onClick={() => setCyberSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start lg:justify-center scrollbar-thin scrollbar-thumb-slate-200">
              <button
                onClick={() => setSelectedCyberCategory(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCyberCategory === null
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "bg-white text-slate-700 hover:text-slate-950 border border-slate-200 shadow-sm"
                }`}
              >
                All 11 Categories (100+)
              </button>
              {CYBER_CAFE_SERVICES.map(cat => {
                const isSelected = selectedCyberCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCyberCategory(isSelected ? null : cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                        : "bg-white text-slate-700 hover:text-slate-950 border border-slate-200 shadow-sm"
                    }`}
                  >
                    <span>{cat.id}. {cat.title.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 11 Categories Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CYBER_CAFE_SERVICES.filter(cat => {
              if (selectedCyberCategory !== null && cat.id !== selectedCyberCategory) {
                return false;
              }
              if (!cyberSearchQuery.trim()) return true;
              const q = cyberSearchQuery.toLowerCase();
              return (
                cat.title.toLowerCase().includes(q) ||
                cat.hindi.toLowerCase().includes(q) ||
                cat.desc.toLowerCase().includes(q) ||
                cat.services.some(s => s.toLowerCase().includes(q))
              );
            }).map(cat => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 shadow-sm group"
                >
                  <div className="space-y-4">
                    {/* Header with Icon + Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <IconComponent size={22} />
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                        {cat.badge}
                      </span>
                    </div>

                    {/* Title & Hindi Title */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                        {cat.title}
                      </h3>
                      <div className="text-xs font-bold text-blue-700">
                        {cat.hindi}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {cat.desc}
                    </p>

                    {/* Sub-Services Checklist */}
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
                        <span>Available Services</span>
                        <span className="text-emerald-700 font-bold">{cat.services.length} items</span>
                      </div>
                      <ul className="space-y-2">
                        {cat.services.map((item, idx) => {
                          const isMatch = cyberSearchQuery.trim() && item.toLowerCase().includes(cyberSearchQuery.toLowerCase());
                          return (
                            <li
                              key={idx}
                              className={`flex items-start gap-2 text-xs font-semibold leading-tight ${
                                isMatch ? "text-amber-950 bg-amber-100 px-1 py-0.5 rounded font-bold" : "text-slate-800"
                              }`}
                            >
                              <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom WhatsApp Action */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <a
                      href={`https://wa.me/917860130721?text=${encodeURIComponent(`Hello National Computer, I need assistance regarding ${cat.title} (${cat.hindi}) at your Teliarganj cyber cafe.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-emerald-600 text-slate-800 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200 hover:border-emerald-500"
                    >
                      <MessageSquare size={13} className="text-emerald-600 group-hover:text-white" />
                      <span>WhatsApp Inquiry / Apply</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Help Footer Callout */}
          <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
            <div className="space-y-1">
              <div className="text-sm font-black text-slate-950">
                Need Urgent Assistance with Any Form, Admit Card or Certificate?
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Visit directly at Rashoolabad Chauraha, Teliarganj or send documents directly on WhatsApp for quick processing.
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:7786961902"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <Phone size={13} className="text-blue-600" />
                <span>Call 7786961902</span>
              </a>
              <a
                href="https://wa.me/917860130721?text=Hello%20National%20Computer,%20I%20have%20an%20urgent%20form%20to%20fill%20at%20your%20cyber%20cafe."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <MessageSquare size={13} />
                <span>WhatsApp 7860130721</span>
              </a>
            </div>
          </div>

        </section>

        {/* ===================================================================
            SECTION E: PRIVACY-PROTECTED "TRACK YOUR REPAIR" UTILITY WIDGET
        =================================================================== */}
        <section id="track-repair" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full border-t border-slate-200">
          
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest">
              <ShieldCheck size={13} />
              <span>Privacy-Protected Customer Tracker</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Track Your Repair in Real Time
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Had your laptop, desktop, or gadget submitted at our Prayagraj service center? Enter your registered mobile number and Job ID below for verified live status.
            </p>
          </div>

          {/* Quick Access to Full Customer Portal Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50 border border-blue-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Laptop size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-950">Dedicated Customer Support Portal (CX Login)</h4>
                <p className="text-[11px] text-slate-600 font-medium">View complete repair history, print official job cards, and check pending bills.</p>
              </div>
            </div>
            <Link
              href="/track"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20 shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Open Customer Portal</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Search Lookup Bar with Phone & Job ID Verification */}
          <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-3xl shadow-lg max-w-2xl mx-auto mb-8">
            <form onSubmit={handleTrackSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Registered Phone Field */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Registered Mobile Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={trackPhone}
                      onChange={(e) => setTrackPhone(e.target.value)}
                      maxLength={14}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Job ID / Ticket Number Field */}
                <div className="space-y-1 text-left">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Job / Ticket Number (Optional)
                  </label>
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. 559, NCA-1042"
                      value={trackJobId}
                      onChange={(e) => setTrackJobId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={trackLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {trackLoading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Verifying Customer Record...</span>
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    <span>Track Repair Status</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium pt-1">
                <Lock size={12} className="text-emerald-600" />
                <span>Protected by Customer Phone Authentication. Zero public data exposure.</span>
              </div>
            </form>
          </div>

          {/* Error Notice */}
          {trackSearched && trackError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-xs font-semibold max-w-2xl mx-auto mb-6 animate-in shake">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1">
                <p>{trackError}</p>
                <div className="mt-2 flex items-center gap-3">
                  <Link href="/track" className="text-blue-700 hover:underline font-bold">
                    Go to Full Customer Portal →
                  </Link>
                  <a 
                    href="https://wa.me/917860130721?text=Hello%20National%20Computer,%20I%20need%20assistance%20tracking%20my%20device." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-700 hover:underline font-bold"
                  >
                    Contact Support on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Live Repair Status Result Card (Verified Data) */}
          {trackSearched && trackResult && (() => {
            const stageInfo = computeSafeRecordStage(trackResult);
            return (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Ticket #{trackResult.jobNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">• {trackResult.shopName}</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-950">{trackResult.laptop}</h3>
                    <p className="text-xs text-slate-600 font-medium">
                      Customer: <strong className="text-slate-900">{trackResult.name}</strong> • Registered: +91 {trackResult.maskedPhone}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-xs text-slate-500 font-semibold">Current Phase</div>
                    <div className="text-sm font-black text-emerald-700 mt-0.5">{stageInfo.stageText}</div>
                    <div className="text-xs text-slate-600 mt-1 font-medium">
                      Received: <strong className="text-slate-900">{trackResult.receivedDate}</strong> • Expected: <strong className="text-slate-900">{trackResult.expectedDeliveryDate || "In Inspection"}</strong>
                    </div>
                  </div>
                </div>

                {/* 4-Stage Interactive Progress Stepper */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Diagnostic & Repair Milestones</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { step: 1, name: "1. Intake Logged", desc: "Inspection & intake logged" },
                      { step: 2, name: "2. Diagnosing", desc: "Chip-level circuit analysis" },
                      { step: 3, name: "3. Repaired / Tested", desc: "Component fitted & burn-in" },
                      { step: 4, name: "4. Ready for Pickup", desc: "Quality check passed" }
                    ].map(s => {
                      const isDone = s.step <= stageInfo.stage;
                      const isCurrent = s.step === stageInfo.stage;
                      return (
                        <div 
                          key={s.step} 
                          className={`p-3 rounded-2xl border transition-all ${
                            isCurrent
                              ? "bg-blue-50 border-2 border-blue-600 text-blue-950 shadow-sm"
                              : isDone
                              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                              : "bg-slate-50 border-slate-200 text-slate-500"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs">{s.name}</span>
                            {isDone ? (
                              <CheckCircle2 size={14} className={isCurrent ? "text-blue-600" : "text-emerald-600"} />
                            ) : (
                              <Clock size={14} className="text-slate-400" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium">{s.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Technician Notes Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Bench Technician Observation:</div>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    &ldquo;{stageInfo.notes}&rdquo;
                  </p>
                </div>

                {/* Direct WhatsApp Contact & Full Portal CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-600 font-medium">
                    Repair Amount: <strong className="text-slate-950 text-base font-black">₹{trackResult.amount.toFixed(2)}</strong>{" "}
                    <span className={`ml-2 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      trackResult.isPaid ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {trackResult.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href={`/track?job=${encodeURIComponent(trackResult.jobNumber)}&phone=${encodeURIComponent(trackPhone.replace(/\D/g, "").slice(-10))}`}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-300 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Laptop size={14} className="text-blue-600" />
                      <span>Open in Customer Portal</span>
                    </Link>

                    <a
                      href={`https://wa.me/917860130721?text=${encodeURIComponent(`Hello National Computer, I am checking status of my Ticket #${trackResult.jobNumber} for ${trackResult.laptop}. Customer: ${trackResult.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                    >
                      <MessageSquare size={14} />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })()}

        </section>

        {/* ===================================================================
            SECTION F: REFURHUB.COM SISTER-BRAND CALLOUT BANNER
        =================================================================== */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 relative overflow-hidden shadow-md">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-xs font-black text-emerald-900 uppercase tracking-widest">
                  <ShieldCheck size={14} />
                  <span>Sister Hardware Division • Refurhub</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                  Need Certified Refurbished Laptops, Desktops, or Genuine Spare Parts?
                </h3>

                <p className="text-slate-700 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
                  Explore our dedicated hardware e-commerce platform <strong className="text-slate-950 font-black">Refurhub.com</strong>—tested business laptops, SSD/RAM upgrades, and bulk B2B deals backed by National Computer Allahabad&apos;s technical quality check.
                </p>

                {/* Badges Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-800 pt-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    6-Month Hardware Warranty
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    40-Point Hardware Diagnostic
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    Pan-India Express Delivery
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                <a
                  href="https://refurhub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-100 transition-all text-center"
                >
                  <span>Shop on Refurhub.com</span>
                  <ExternalLink size={16} />
                </a>
                <span className="text-[11px] text-slate-600 mt-2 font-medium">Opens official e-commerce storefront in a new tab</span>
              </div>

            </div>

          </div>
        </section>

        {/* ===================================================================
            SECTION G: PROJECT INQUIRY & CONTACT SECTION
        =================================================================== */}
        <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 uppercase tracking-widest">
              Direct Engagement
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Start a Project or Request a Service Quote
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Whether you need a custom corporate website, scalable ERP software, a public SaaS store setup, or corporate hardware AMC in Prayagraj, our engineering team is ready.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Interactive Project Inquiry Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-950">Inquiry Received Successfully!</h3>
                  <p className="text-slate-700 text-sm max-w-md mx-auto font-medium">
                    Thank you, <strong className="text-slate-950">{contactName}</strong>. Your project brief has been recorded in our system. A senior engineer from National Computer Allahabad will contact you shortly.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href={`https://wa.me/917860130721?text=${encodeURIComponent(`Hello National Computer, I just submitted an inquiry for ${selectedServices.join(", ")} on your website. My name is ${contactName}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                    >
                      <MessageSquare size={14} />
                      <span>Continue Conversation on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="px-6 py-3 bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  
                  {/* Service Multi-Select Checkboxes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Select Interested Services (Click to toggle)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        "Storekeeper / Retail Website",
                        "School / College Website",
                        "Clinic / Hospital Website",
                        "Real Estate / Property Website",
                        "Advocate / Legal Website",
                        "E-Commerce Online Store",
                        "Laptop / Chip-Level Repair",
                        "CCTV Camera & Networking",
                        "Cyber Cafe / Sarkari Form Filling",
                        "Aadhaar / PAN Card Services",
                        "Certificates & Ration Card",
                        "Banking / AEPS Money Transfer",
                        "Custom Software / ERP",
                        "Public SaaS Store Demo"
                      ].map(service => {
                        const isSelected = selectedServices.includes(service);
                        return (
                          <button
                            type="button"
                            key={service}
                            onClick={() => handleServiceToggle(service)}
                            className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-blue-50 border-2 border-blue-600 text-blue-950 shadow-sm"
                                : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950"
                            }`}
                          >
                            <span>{service}</span>
                            {isSelected && <Check size={14} className="text-blue-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alok Sharma"
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">WhatsApp / Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98390 12345"
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Business Name and Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Company / Shop Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma Infotech / Retail Hub"
                        value={contactBusiness}
                        onChange={e => setContactBusiness(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Estimated Budget / Scope</label>
                      <select
                        value={contactBudget}
                        onChange={e => setContactBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      >
                        <option value="Under ₹25,000">Under ₹25,000</option>
                        <option value="₹25k - ₹75k">₹25,000 – ₹75,000</option>
                        <option value="₹75k - ₹2 Lakh">₹75,000 – ₹2,00,000</option>
                        <option value="Enterprise / Custom Contract">Enterprise / Custom AMC Contract</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Brief */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Project Brief / Service Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your website, custom software, SaaS requirements, or hardware maintenance needs..."
                      value={contactMessage}
                      onChange={e => setContactMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {contactSubmitting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>Recording Project Brief...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send Project Inquiry</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>

            {/* Right: Business Info Card */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="text-xl font-black text-slate-950">National Computer Allahabad</h3>
                  <p className="text-xs text-blue-700 font-bold uppercase tracking-wider mt-0.5">Technology Studio & Hardware Diagnostics Lab</p>
                </div>

                <div className="space-y-4 text-xs font-medium text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-950">Physical Address (Service Center & Lab)</div>
                      <div className="text-slate-700 mt-0.5 font-semibold">
                        Rashoolabad Chauraha, Teliarganj,<br />
                        Prayagraj (Allahabad), Uttar Pradesh – 211004, India
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-950">Operating Hours</div>
                      <div className="text-slate-700 mt-0.5">
                        <strong className="text-emerald-700">Open Everyday:</strong> 10:00 AM – 10:00 PM<br />
                        <span className="text-slate-500 text-[11px] font-medium">(Morning Shift: 10 AM - 2 PM | Evening Shift: 5 PM - 10 PM)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-950">Call & WhatsApp Hotline</div>
                      <div className="text-slate-800 mt-0.5 font-bold">
                        Call: <a href="tel:7786961902" className="text-slate-950 hover:text-blue-600 underline">7786961902</a> • WhatsApp: <a href="https://wa.me/917860130721" target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:text-emerald-800 underline">7860130721</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-950">Payment Modes Accepted</div>
                      <div className="text-slate-600 mt-0.5">
                        Cash • UPI (GPay, PhonePe, Paytm, BHIM) • Debit / Credit Card • Mobile Wallets
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Button */}
                <div className="pt-2">
                  <a
                    href="https://wa.me/917860130721?text=Hello%20National%20Computer%20Allahabad,%20I%20want%20to%20discuss%20a%20project%20or%20software%20requirement"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <MessageSquare size={15} />
                    <span>Chat Directly on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Founder / Technical Direction Credit Card */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-2 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Engineering Direction</div>
                <div className="text-sm font-bold text-slate-950">
                  Founded & Headed by <strong className="text-blue-700">Devraj Singh Tomar</strong>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Leading full-stack architect & hardware technician with over a decade of production experience across India.
                </p>
                <div className="pt-1">
                  <a
                    href="https://devrajsinghtomar.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800"
                  >
                    <span>View Developer Portfolio</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ===================================================================
            SECTION H: FOOTER (4 High-Readability Columns)
        =================================================================== */}
        <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs w-full">
          <div className="max-w-7xl mx-auto space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              
              {/* Column 1: Brand Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                    <Cpu size={18} />
                  </div>
                  <span className="font-black text-sm text-white">National Computer Allahabad</span>
                </div>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Prayagraj&apos;s trusted IT studio & hardware service lab since 2015. Located at Rashoolabad Chauraha, Teliarganj. Crafting high-converting business websites, custom software, and delivering precision chip-level laptop repair.
                </p>
                <div className="text-slate-500 font-semibold text-[11px] space-y-1">
                  <div>Rashoolabad Chauraha, Teliarganj, Prayagraj</div>
                  <div>Open Everyday: 10:00 AM – 10:00 PM</div>
                  <div>Call: 7786961902 • WhatsApp: 7860130721</div>
                </div>
              </div>

              {/* Column 2: Technology & Cyber Cafe Services */}
              <div className="space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-white">Services & Lab</div>
                <ul className="space-y-2 font-medium">
                  <li><a href="#business-web" className="hover:text-white transition-colors">Websites for Local Shopkeepers</a></li>
                  <li><a href="#business-web" className="hover:text-white transition-colors">School & Clinic Portals</a></li>
                  <li><a href="#hardware-it" className="hover:text-white transition-colors">Chip-Level Laptop Repair & AMC</a></li>
                  <li><a href="#hardware-it" className="hover:text-white transition-colors">CCTV Installation & Networking</a></li>
                  <li><a href="#cyber-cafe" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">Cyber Cafe & Online Services (11 Categories) →</a></li>
                  <li><a href="#cyber-cafe" className="hover:text-white transition-colors">Sarkari Job, Admit Card & Results</a></li>
                  <li><a href="#cyber-cafe" className="hover:text-white transition-colors">Aadhaar, PAN & UP e-District Certificates</a></li>
                </ul>
              </div>

              {/* Column 3: Public Software (SaaS) */}
              <div className="space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-white">Public Software (SaaS)</div>
                <ul className="space-y-2 font-medium">
                  <li><a href="#software" className="hover:text-white transition-colors">Repair Registry Module</a></li>
                  <li><a href="#software" className="hover:text-white transition-colors">Spare Parts Inventory Roster</a></li>
                  <li><a href="#software" className="hover:text-white transition-colors">Direct Counter Sales Logger</a></li>
                  <li><a href="#software" className="hover:text-white transition-colors">1-Click Excel Sync Backups</a></li>
                  <li><a href="#software" className="hover:text-white transition-colors">SaaS Free vs. Pro Pricing</a></li>
                  <li><Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">Create Free Shop Account →</Link></li>
                </ul>
              </div>

              {/* Column 4: Ecosystem & Quick Links */}
              <div className="space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-white">Ecosystem Links</div>
                <ul className="space-y-2 font-medium">
                  <li>
                    <a href="https://refurhub.com/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                      <span>Refurhub Hardware Store ↗</span>
                    </a>
                  </li>
                  <li><a href="#track-repair" className="hover:text-white transition-colors">Track Repair Status</a></li>
                  <li><Link href="/login" className="hover:text-white transition-colors">Store Keeper Login</Link></li>
                  <li><Link href="/admin-login" className="hover:text-white transition-colors">Super Admin Portal</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About National Computer</Link></li>
                  <li><Link href="/support" className="hover:text-white transition-colors">Customer Support Center</Link></li>
                </ul>
              </div>

            </div>

            {/* Bottom Credit Strip */}
            <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-slate-500 font-medium">
              <div>
                © {new Date().getFullYear()} National Computer Allahabad. All rights reserved.
              </div>
              <div>
                Designed & Developed by{" "}
                <a
                  href="https://devrajsinghtomar.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-slate-300 hover:text-blue-400 transition-colors underline decoration-slate-700 underline-offset-4"
                >
                  Devraj Singh Tomar
                </a>
              </div>
            </div>

          </div>
        </footer>

        {/* Global Interactive Launch Software Modal */}
        <LaunchSoftwareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </main>
    );
  }

  // =========================================================================
  // 2. SUBSCRIPTION INACTIVE LOCKOUT WALL (When logged in with expired license)
  // =========================================================================
  if (user && !user.subscriptionActive) {
    return (
      <main className="flex flex-col min-h-[85vh] justify-center p-6 bg-slate-50 text-slate-900">
        <div className="max-w-md mx-auto w-full text-center space-y-6 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-200">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-950">Subscription Inactive</h2>
          <p className="text-slate-600 text-sm font-medium">
            Your store account subscription license is currently inactive or expired. Please contact the Super Admin or extend your subscription plan to regain access.
          </p>
          <div className="space-y-3 pt-2">
            <Link
              href="/subscription"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg block text-sm transition-all"
            >
              Manage & Extend Subscription
            </Link>
            <button
              onClick={async () => {
                await logoutUser();
                localStorage.removeItem("user");
                router.push("/login");
              }}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors border border-slate-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // 3. REGULAR STORE DASHBOARD PANEL (When store keeper is logged in)
  // =========================================================================
  return (
    <main className="flex flex-col min-h-screen p-4 pt-8 pb-24 bg-muted/10 md:p-6 lg:p-8">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            {user ? `Welcome, ${user.name.split(" ")[0]}!` : "Welcome Back!"}
          </h1>
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold mt-1">
            <UserCheck size={14} className="text-emerald-500 animate-pulse" />
            <span>License Status: Active ({user.subscriptionPlan || "Standard"})</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
          <LayoutDashboard size={24} />
        </div>
      </header>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Records</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-green-50 text-green-600 rounded-2xl">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Paid Jobs</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{stats.paid}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-border rounded-3xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Unpaid Jobs</p>
            <p className="text-2xl font-black text-foreground mt-0.5">{stats.unpaid}</p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-3 mb-8">
        <Link
          href="/add"
          className="flex items-center justify-between p-5 bg-primary text-primary-foreground font-bold rounded-3xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <PlusCircle size={22} />
            <span className="text-base tracking-tight font-extrabold">New Repair Record</span>
          </div>
          <ArrowRight size={20} />
        </Link>

        <Link
          href="/records"
          className="flex items-center justify-between p-5 bg-white border border-border text-foreground font-bold rounded-3xl shadow-sm hover:bg-muted/40 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <List size={22} className="text-primary" />
            <span className="text-base tracking-tight font-extrabold">View All Register Entries</span>
          </div>
          <ArrowRight size={20} className="text-muted-foreground" />
        </Link>

        <Link
          href="/inventory"
          className="flex items-center justify-between p-5 bg-white border border-border text-foreground font-bold rounded-3xl shadow-sm hover:bg-muted/40 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <Package size={22} className="text-primary" />
            <span className="text-base tracking-tight font-extrabold">Shop Parts Inventory</span>
          </div>
          <ArrowRight size={20} className="text-muted-foreground" />
        </Link>

        <Link
          href="/export"
          className="flex items-center justify-between p-5 bg-white border border-border text-foreground font-bold rounded-3xl shadow-sm hover:bg-muted/40 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <Download size={22} className="text-primary" />
            <span className="text-base tracking-tight font-extrabold">Export Data (Excel)</span>
          </div>
          <ArrowRight size={20} className="text-muted-foreground" />
        </Link>
      </div>
    </main>
  );
}
