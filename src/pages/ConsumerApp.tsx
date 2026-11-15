import { useEffect, useState } from "react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Header } from "@/components/layout/Header";
import { HomePage } from "@/pages/HomePage";
import {
  LazyMapPage,
  LazyProfilePage,
  LazyRankingsPage
} from "@/lib/performance/lazy-components";
import { QRScanner } from "@/components/scanner/QRScanner";
import { ProfileSettings } from "@/components/profile/ProfileSettings";
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useProfileMode } from "@/hooks/use-profile-mode";
import { useActivityTracker } from "@/hooks/use-activity-tracker";
import { useStartConversation } from "@/hooks/use-start-conversation";

const ConsumerApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startBusinessConversation } = useStartConversation();
  const {
    trackNavigation,
    trackButtonClick,
    trackTabChange,
    trackModalOpen
  } = useActivityTracker();
  const [activeTab, setActiveTab] = useState("home");
  const [showScanner, setShowScanner] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const {
    currentMode,
    currentBusinessId
  } = useProfileMode();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/consumer/map")) setActiveTab("map");
    else if (path.startsWith("/consumer/profile")) setActiveTab("profile");
    else setActiveTab("home");
  }, [location.pathname]);

  const handleCommerceMessage = (commerce: { id?: string } | null) => {
    if (commerce?.id) {
      startBusinessConversation(commerce.id);
    } else {
      navigate("/messaging");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <Routes>
        <Route
          path="/home"
          element={
            <>
              <Header
                title="Découvrir"
                showBack={false}
                onLocationClick={() => navigate("/consumer/map")}
                onMessageClick={() => navigate("/messaging")}
              />
              <main className="flex-1 pt-24 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+1rem)] overflow-y-auto rounded-none py-[71px]">
                <HomePage
                  onNavigate={(tab) => navigate(`/consumer/${tab}`)}
                  onMessage={handleCommerceMessage}
                />
              </main>
            </>
          }
        />

        <Route
          path="/map"
          element={
            <main className="flex-1 pt-24 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+1rem)] overflow-y-auto">
              <LazyMapPage onBack={() => navigate("/consumer/home")} />
            </main>
          }
        />

        <Route
          path="/profile"
          element={
            <main className="flex-1 pt-24 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+1rem)] overflow-y-auto">
              <LazyProfilePage
                onBack={() => navigate("/consumer/home")}
                onSettings={() => setShowProfileSettings(true)}
              />
            </main>
          }
        />

        <Route
          path="/rankings"
          element={
            <main className="flex-1 pt-6 pb-[calc(var(--bottom-nav-height)+env(safe-area-inset-bottom)+1rem)] overflow-y-auto">
              <LazyRankingsPage onBack={() => navigate("/consumer/home")} />
            </main>
          }
        />

        <Route path="/*" element={<Navigate to="/consumer/home" replace />} />
      </Routes>

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === "scanner") {
            trackButtonClick("Scanner QR", "Navigation");
            trackModalOpen("Scanner QR");
            setShowScanner(true);
            return;
          }
          if (tab === "profile" && currentMode === "business" && currentBusinessId) {
            trackNavigation(activeTab, "business-profile");
            navigate(`/business/${currentBusinessId}/profile`);
            return;
          }
          trackTabChange(activeTab, tab);
          setActiveTab(tab);
          const path = tab === "home" ? "/consumer/home" : `/consumer/${tab}`;
          navigate(path);
        }}
      />

      {showScanner && (
        <QRScanner
          onClose={() => {
            trackModalOpen("Scanner QR - Fermeture");
            setShowScanner(false);
          }}
          onScan={() => {
            trackButtonClick("QR Code Scanné", "Scanner");
            setShowScanner(false);
          }}
        />
      )}

      {showProfileSettings && (
        <ProfileSettings
          open={showProfileSettings}
          onClose={() => {
            trackModalOpen("Paramètres Profil - Fermeture");
            setShowProfileSettings(false);
          }}
          userType="client"
        />
      )}
    </div>
  );
};
export default ConsumerApp;