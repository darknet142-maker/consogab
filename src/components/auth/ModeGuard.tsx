import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfileMode } from "@/hooks/use-profile-mode";
import { createDomainLogger } from "@/lib/logger";

interface ModeGuardProps {
  children: React.ReactNode;
}

const guardLogger = createDomainLogger('mode-guard');

export const ModeGuard = ({ children }: ModeGuardProps) => {
  const { currentMode, currentBusinessId, loading } = useProfileMode();
  const location = useLocation();
  const navigate = useNavigate();

  const lastRedirectRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    const path = location.pathname;
    let target: string | null = null;

    // Règles de navigation strictes pour séparation Consumer ↔ Business
    if (currentMode === 'business') {
      if (!currentBusinessId) {
        if (!path.startsWith('/entreprises')) {
          target = '/entreprises';
        }
      } else {
        // En mode Business: interdire l'accès aux routes consommateur
        if (path.startsWith('/consumer') || path === '/home') {
          target = `/business/${currentBusinessId}/profile`;
        }

        // Vérifier que l'utilisateur accède uniquement à SON business sur les routes d'administration
        const businessAdminMatch = path.match(/^\/business\/([^/]+)\/(dashboard|profile|settings|catalogues)/);
        if (businessAdminMatch && businessAdminMatch[1] !== currentBusinessId) {
          guardLogger.warn('Tentative d\'accès à l\'administration d\'un autre business');
          target = `/business/${currentBusinessId}/profile`;
        }
      }
    } else {
      // Mode Consommateur: autoriser l'accès public aux business (/business/:id) mais pas aux zones pro
      const businessSettingsMatch = path.match(/^\/business\/([^/]+)\/(dashboard|profile|settings|catalogues)/);
      if (businessSettingsMatch) {
        guardLogger.warn('Tentative d\'accès aux zones privées business en mode consommateur');
        target = '/consumer/home';
      }
    }

    // Éviter les boucles et redirections redondantes
    if (target && target !== path && lastRedirectRef.current !== target) {
      guardLogger.info('Mode guard redirect', { 
        action: 'guard_redirect',
        from: path,
        to: target
      });
      
      lastRedirectRef.current = target;
      navigate(target, { replace: true });
    }
  }, [currentMode, currentBusinessId, loading, location.pathname, navigate]);

  return <>{children}</>;
};
