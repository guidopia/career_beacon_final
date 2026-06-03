import React, { useState, useEffect } from "react";
import {
  Play,
  User,
  Brain,
  Briefcase,
  QrCode,
  ArrowRight,
  Twitter,
  Instagram,
  MessageCircle,
  Facebook,
  AlertTriangle,
  Compass,
} from "lucide-react";

import * as htmlToImage from 'html-to-image';
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL, apiAxios } from '../api/index';
import { SITE_BRAND_NAME_SENTENCE } from '../constants/branding';
// --- MAIN PAGE COMPONENT WITH LOGIC ---

export default function FutureMeCard() {
  const { state } = useLocation() || { state: {} };
  const card = state?.card;
  const fromOnboarding = state?.fromOnboarding;
  const navigate = useNavigate();
  const [sharing, setSharing] = useState(false);

  // Debug logging

  // Save card to backend - only if not already saved from onboarding
  const saveFutureMeCard = async () => {
    if (!card || fromOnboarding) return; // Skip if already saved from onboarding
    try {
      const data = {
        answers: state?.onboardingAnswers || {},
        futureRole: card.futureRole,
        tagline: card.tagline,
        tags: card.tags || card.skills, // Handle both field names
        mindset: card.mindset,
        salary: card.salary,
        keySkills: card.keySkills,
        mentors: card.mentors,
        cta: card.cta,
        personalityType: card.personalityType,
        careerRecommendations: card.careerRecommendations,
        skillRecommendations: card.skillRecommendations,
      };
      await apiAxios('/api/futureme', {
        method: 'POST',
        data: data
      });
    } catch (error) {
      console.error('Error saving Future Me Card:', error);
    }
  };

  useEffect(() => {
    // Only save if not from onboarding (since it's already saved)
    if (!fromOnboarding && card) {
      saveFutureMeCard();
    }
    // eslint-disable-next-line
  }, [card, fromOnboarding]);


  // Card image capture (just the card, no extra background)
  const captureCardAsImage = async () => {
    setSharing(true);
    try {
      const cardElement = document.getElementById('future-me-card');
      if (!cardElement) {
        console.error('Card element (#future-me-card) not found.');
        alert('Error: Could not find the card content to create an image.');
        setSharing(false);
        return null;
      }

      // Use devicePixelRatio for sharpness
      const pixelRatio = window.devicePixelRatio || 1;

      // Use html-to-image to capture only the card element as PNG blob
      const cardBlob = await htmlToImage.toBlob(cardElement, {
        pixelRatio: pixelRatio,
        // backgroundColor: null, // Let the card's own background show
        // skipAutoScale: true, // Not needed, but ensures no extra scaling
        // style: { background: "transparent" }, // Not needed if card is white
      });

      if (!cardBlob) {
        console.error('Failed to capture card element as a blob.');
        alert('Error: Could not create an image from the card content.');
        setSharing(false);
        return null;
      }

      // No need to draw onto a new canvas or add any background.
      // The blob is already just the card, with its white rounded background.

      return cardBlob;
    } catch (error) {
      console.error('Card capture process failed:', error);
      alert('Sorry, an error occurred while creating the card image. Please check the console for details.');
      return null;
    } finally {
      setSharing(false);
    }
  };
  const downloadImage = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Unified share handler
  const handleShare = async (platform) => {
    const imageBlob = await captureCardAsImage();
    if (!imageBlob) {
      alert("Sorry, we couldn't create an image of your card.");
      return;
    }
    downloadImage(imageBlob, "future-me-card.png");
    const text = encodeURIComponent(
      `🚀 Just created my Future Me Card! Goal: ${card?.futureRole} #FutureMe #CareerGoals`
    );
    let url = "";

    setTimeout(() => {
      switch (platform) {
        case "twitter":
          url = `https://twitter.com/intent/tweet?text=${text}`;
          break;
        case "whatsapp":
          url = `https://wa.me/?text=${text}`;
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}&quote=${text}`;
          break;
        case "instagram":
          alert("📸 Card image downloaded! You can now share it on Instagram.");
          return;
        default:
          return;
      }
      if (url) window.open(url, "_blank");
    }, 500);
  };

  // Render the new card UI with all the logic passed down
  if (!card) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#000] font-sans">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">No Future Me Card Found</h2>
          <p className="text-gray-400 mb-6">Please complete the onboarding process to generate your personalized Future Me Card.</p>
          <button
            onClick={() => navigate('/onboarding')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <FutureMeCardUI
      card={card}
      sharing={sharing}
      onShare={handleShare}
      onNavigate={() => navigate(fromOnboarding ? "/dashboard" : "/future-me")}
      buttonText={fromOnboarding ? "Go to Dashboard" : "Generate Another"}
    />
  );
}

// --- PRESENTATIONAL CARD COMPONENT ---

const FutureMeCardUI = ({ card, sharing, onShare, onNavigate, buttonText }) => {
  // Helper to map skill names to icons


  // Helper to clean up salary text (remove brackets and their content)
  const cleanSalary = (salary) => {
    if (!salary) return "";
    // Remove anything in brackets (and the brackets themselves)
    return salary.replace(/\s*\(.*?\)\s*/g, "").trim();
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#000] font-sans">
      <div
        id="future-me-card"
        className="bg-white text-black rounded-2xl pb-4  max-w-xl shadow-xl relative z-10 flex flex-col"
        style={{ minHeight: "60vh", maxHeight: "72vh" }}
      >
        <div className="p-5 flex flex-col gap-4 flex-1">
          {/* Header */}
          <div>
            <h3 className="text-xs font-medium text-black mb-1">
              Future You, {card?.age || "25"}
            </h3>
            <h1 className="text-2xl font-semibold mb-1">
              {card?.futureRole || "Career Professional"}
            </h1>
            <div className="relative right-6 mt-1">
                          <span className="inline-block bg-gradient-to-r rounded-l-none from-black via-gray-900 to-gray-800 text-white text-xs font-semibold px-4 my-2 py-1 rounded-full shadow-md tracking-wide border border-gray-800 uppercase pl-10" style={{ letterSpacing: "0.04em" }}>
              {card?.tagline || "Create Your Future"}
            </span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex gap-2">
            {(card?.skills || card?.tags || ["Creativity", "Learn", "Action"]).slice(0, 3).map((skill, i) => {
              // Soft, minimal, aesthetic pastel gradients
              const pastelGradients = [
                "bg-gradient-to-r from-blue-100 to-blue-200",
                "bg-gradient-to-r from-green-100 to-green-200",
                "bg-gradient-to-r from-pink-100 to-pink-200",
                "bg-gradient-to-r from-yellow-100 to-yellow-200",
                "bg-gradient-to-r from-purple-100 to-purple-200",
                "bg-gradient-to-r from-cyan-100 to-cyan-200",
                "bg-gradient-to-r from-gray-100 to-gray-200"
              ];
              const gradientClass = pastelGradients[i % pastelGradients.length];
              return (
                <div
                  key={i}
                  className={`flex items-center gap-1 ${gradientClass} rounded-full px-3 py-1 border border-gray-200`}
                >
                  <span className="text-xs font-medium text-gray-800">{typeof skill === 'string' ? skill : 'Skill'}</span>
                </div>
              );
            })}
          </div>

          {/* Mindset */}
          <div className="bg-gray-100 text-black border-t border-b border-gray-300 py-2  font-sans text-center">
            <span className="text-lg font-semibold ">Mindset:</span>
            <span className="font-bold text-xl ml-1">{card?.mindset || "Growth Mindset"}</span>
          </div>

          {/* Key Skills & Salary */}
          <div className="flex flex-col gap-2">
            {/* Key Skills */}
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-xs text-black">Key Skills:</span>
              {(Array.isArray(card?.keySkills) ? card.keySkills : (card?.keySkills ? card.keySkills.split(",") : ["AutoCAD & BIM", "Structural Analysis", "Leadership"]))
                .map((skill, i) => {
                  // Use same pastel gradients as above
                  const pastelGradients = [
                    "bg-gradient-to-r from-blue-100 to-blue-200",
                    "bg-gradient-to-r from-green-100 to-green-200",
                    "bg-gradient-to-r from-pink-100 to-pink-200",
                    "bg-gradient-to-r from-yellow-100 to-yellow-200",
                    "bg-gradient-to-r from-purple-100 to-purple-200",
                    "bg-gradient-to-r from-cyan-100 to-cyan-200",
                    "bg-gradient-to-r from-gray-100 to-gray-200"
                  ];
                  const gradientClass = pastelGradients[i % pastelGradients.length];
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-1 ${gradientClass} rounded-full px-3 py-1 border border-gray-200`}
                    >
                      <span className="text-xs font-medium text-black">{typeof skill === "string" ? skill.trim() : 'Skill'}</span>
                    </div>
                  );
                })}
            </div>
            {/* Target Salary */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-black">Target Salary:</span>
              <span className="font-bold text-xl text-black ml-1">
                {cleanSalary(card?.salary) || "₹3 LPA - ₹20 LPA"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div>
            <p className="text-sm font-medium font-serif text-black text-center">
              {card?.cta || "Start building your skills today; connect with mentors in your field"}
            </p>
          </div>

          {/* Share & Action */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                onClick={() => onShare("twitter")}
                disabled={sharing}
                title="Share to Twitter"
                className="p-2 rounded-full bg-[#1da1f2] hover:bg-[#1a8cd8] transition-all disabled:opacity-50"
              >
                <Twitter className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onShare("whatsapp")}
                disabled={sharing}
                title="Share to WhatsApp"
                className="p-2 rounded-full bg-[#25d366] hover:bg-[#1ebe57] transition-all disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onShare("instagram")}
                disabled={sharing}
                title="Share to Instagram"
                className="p-2 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515bd4] hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Instagram className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onShare("facebook")}
                disabled={sharing}
                title="Share to Facebook"
                className="p-2 rounded-full bg-[#1877f3] hover:bg-[#145db2] transition-all disabled:opacity-50"
              >
                <Facebook className="w-4 h-4 text-white" />
              </button>
            </div>
            {sharing && (
              <p className="text-center text-[11px] text-gray-400 mb-1">
                📸 Capturing card...
              </p>
            )}
            <button
              onClick={onNavigate}
              className="w-full py-2 bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95 mt-1"
            >
              {buttonText}
              <ArrowRight size={14} />
            </button>
            <p className="text-center flex items-center justify-center gap-2 text-sm text-gray-700 my-3">
              Generated with
              <Compass className="w-5 h-5" />
              {`${SITE_BRAND_NAME_SENTENCE}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
//solving error
