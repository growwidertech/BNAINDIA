"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Globe,
  Camera,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { SUPPORTED_LANGUAGES, getDictionary } from "@/lib/languages";
import { INDIAN_STATES_DISTRICTS, getAllStates, getDistrictsForState } from "@/lib/districts";

interface ReporterSignupPageProps {
  params: { lang: string };
}

export default function ReporterSignupPage({ params }: ReporterSignupPageProps) {
  const dict = getDictionary(params.lang);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "Delhi (NCT)",
    district: "New Delhi",
    location: "New Delhi, Delhi (NCT)",
    qualification: "",
    language: "Hindi, English",
    beat: "General Ground Reporting & Regional Issues",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panCardFile, setPanCardFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const qualificationOptions = [
    "Master of Journalism & Mass Communication (MJMC)",
    "PG Diploma in Broadcast Journalism",
    "Bachelor of Journalism & Mass Communication (BJMC)",
    "Post Graduate Diploma in Investigative Journalism",
    "Master's Degree in English / Hindi / Regional Literature",
    "Master's in Political Science / International Relations",
    "Bachelor of Arts / Science / Commerce",
    "Experienced Field / Freelance Journalist",
  ];

  const commonLocations = [
    "New Delhi",
    "Mumbai",
    "Bengaluru",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Lucknow",
    "Patna",
    "Jaipur",
    "Chandigarh",
    "Bhopal",
    "Ahmedabad",
    "Guwahati",
    "Srinagar",
    "Kochi",
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("state", formData.state);
      data.append("district", formData.district);
      data.append("location", formData.location || `${formData.district}, ${formData.state}`);
      data.append("qualification", formData.qualification);
      data.append("language", formData.language);
      data.append("beat", formData.beat);

      if (photoFile) data.append("photo", photoFile);
      if (aadhaarFile) data.append("aadhaar", aadhaarFile);
      if (panCardFile) data.append("panCard", panCardFile);

      const res = await fetch("/api/reporters/register", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessData(result.reporter);
      } else {
        setErrorMsg(result.error || "Registration submission failed.");
      }
    } catch (err) {
      setErrorMsg("Network error connecting to BNA Reporter Desk. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8 font-sans">
      {/* 1. Header Banner with BNA Logo & Flag Colors */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b2545] via-[#103058] to-[#0b2545] text-white p-6 sm:p-10 shadow-xl border-t-4 border-[#ea580c]">
        {/* Tricolor Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#ea580c]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#15803d]" />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>BNA National Press Accreditation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
              Reporter & Journalist Onboarding
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Join the <b>BNA News Network (True Democracy Voice)</b>. We empower independent, ground-level journalists and regional correspondents across India with official press credentials and national syndication.
            </p>
          </div>

          <div className="shrink-0 bg-white p-3 rounded-xl shadow-md border border-slate-200">
            <img
              src="/images/bna-logo.jpg"
              alt="BNA True Democracy Voice"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* 2. Success View */}
      {successData ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Registration Successful
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Welcome to BNA News Network, {successData.name}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              Your details and identity credentials (Aadhaar & PAN) have been registered and stored in our database. Your profile is now live on the BNA Journalist Directory.
            </p>
          </div>

          {/* Registration Card Summary */}
          <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Accreditation ID:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">BNA-REP-{successData.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Bureau Location:</span>
              <span className="font-bold text-slate-900 dark:text-white">{successData.location}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-slate-500">Language:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{successData.language}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-600 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Active Accredited Press
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href={`/${params.lang}/reporters`}
              className="w-full sm:w-auto px-6 py-3 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2"
            >
              <span>View Journalists Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                setSuccessData(null);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  state: "Delhi (NCT)",
                  district: "New Delhi",
                  location: "New Delhi, Delhi (NCT)",
                  qualification: "",
                  language: "Hindi, English",
                  beat: "General Ground Reporting & Regional Issues",
                });
                setPhotoFile(null);
                setPhotoPreview(null);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl font-semibold text-xs transition"
            >
              Register Another Reporter
            </button>
          </div>
        </div>
      ) : (
        /* 3. Main Registration Form */
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 border border-gray-200 dark:border-slate-800 shadow-md space-y-8"
        >
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Personal & Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b-2 border-[#ea580c]">
              <User className="w-4 h-4 text-[#ea580c]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                1. Personal & Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field 1: Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Full Name (as per ID Proof) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 2: Email id */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Official Email ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="ramesh.sharma@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 3: Contact Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Contact Number (WhatsApp enabled) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                  />
                </div>
              </div>

              {/* Field 4: State and District Bureau */}
              <div className="space-y-3 sm:col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                <span className="block text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                  Primary Reporting Jurisdiction (State & District) *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      State / Union Territory *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => {
                        const newState = e.target.value;
                        const dists = getDistrictsForState(newState);
                        const firstDist = dists.length > 0 ? dists[0] : "";
                        setFormData({
                          ...formData,
                          state: newState,
                          district: firstDist,
                          location: `${firstDist}, ${newState}`,
                        });
                      }}
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                    >
                      {getAllStates().map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Reporting District *
                    </label>
                    <select
                      value={formData.district}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        setFormData({
                          ...formData,
                          district: newDist,
                          location: `${newDist}, ${formData.state}`,
                        });
                      }}
                      className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                    >
                      {getDistrictsForState(formData.state).map((dist) => (
                        <option key={dist} value={dist}>
                          📍 {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Bureau Office / Local Postal Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Press Club Complex, Mall Road, District Headquarters"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ea580c] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Professional Qualifications & Language */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b-2 border-[#15803d]">
              <GraduationCap className="w-4 h-4 text-[#15803d]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                2. Professional Qualification & Language
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field 5: Qualification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Educational & Journalism Qualification *
                </label>
                <select
                  required
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#15803d] focus:outline-none"
                >
                  <option value="">Select highest qualification...</option>
                  {qualificationOptions.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 6: Language - Drop down to select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Primary Reporting Language *
                </label>
                <select
                  required
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#15803d] focus:outline-none"
                >
                  <option value="">Select language...</option>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={`${lang.name} (${lang.nativeName})`}>
                      {lang.name} — {lang.nativeName}
                    </option>
                  ))}
                  <option value="Bilingual: Hindi & English">Bilingual: Hindi & English</option>
                  <option value="Multilingual: Regional & English">Multilingual: Regional & English</option>
                </select>
              </div>

              {/* Beat / Specialization */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                  Journalism Beat / Specialization Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Political Affairs, Crime & Judiciary, Agriculture & Rural, Tech & Business"
                  value={formData.beat}
                  onChange={(e) => setFormData({ ...formData, beat: e.target.value })}
                  className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#15803d] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Identity Verification & Documents */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b-2 border-[#0b2545]">
              <ShieldCheck className="w-4 h-4 text-[#0b2545] dark:text-blue-400" />
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                3. Identity Verification (Aadhaar, PAN & Photo)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Field 8: Photograph */}
              <div className="flex flex-col items-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                  Passport Photograph *
                </span>

                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center border-2 border-orange-500 shadow-inner relative group">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold transition shadow">
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400">JPG, PNG, WebP up to 5MB</p>
              </div>

              {/* Field 7A: Aadhaar Card Upload */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 flex items-center">
                    <FileText className="w-4 h-4 text-blue-600 mr-1" />
                    Aadhaar Card (PDF/Image) *
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Upload clear scanned copy or photo of your Aadhaar card for press verification.
                  </p>
                </div>

                <div>
                  <input
                    type="file"
                    required
                    accept=".pdf,image/*"
                    onChange={(e) => setAadhaarFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {aadhaarFile && (
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                      ✓ {aadhaarFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Field 7B: PAN Card Upload */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300 flex items-center">
                    <FileText className="w-4 h-4 text-emerald-600 mr-1" />
                    PAN Card (PDF/Image) *
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Upload official PAN card document for freelance syndication and honorarium verification.
                  </p>
                </div>

                <div>
                  <input
                    type="file"
                    required
                    accept=".pdf,image/*"
                    onChange={(e) => setPanCardFile(e.target.files?.[0] || null)}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {panCardFile && (
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                      ✓ {panCardFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Press Declaration */}
          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/60 text-xs text-orange-950 dark:text-orange-200 leading-relaxed">
            <span className="font-bold uppercase tracking-wider block mb-1">
              Journalistic Integrity Declaration:
            </span>
            I declare that all provided documents and qualifications are authentic. I agree to adhere to the BNA News Agency Code of Ethics, unbiased objective reporting, and the Press Council of India standards.
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-slate-800">
            <Link
              href={`/${params.lang}/reporters`}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              ← Browse Existing Reporters
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:from-[#c2410c] hover:to-[#9a3412] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isSubmitting ? "Uploading Documents & Registering..." : "Submit Reporter Registration"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
