'use client';

import { useState, useEffect } from 'react';
import { QualityMode } from '@/types/gallery';

export function useNetworkQuality() {
  const [isMobileData, setIsMobileData] = useState<boolean>(false);
  const [effectiveType, setEffectiveType] = useState<string>('4g');
  const [qualityMode, setQualityMode] = useState<QualityMode>('auto');
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check localStorage for user preference
    const savedMode = localStorage.getItem('smriti_quality_mode') as QualityMode | null;
    if (savedMode) {
      setQualityMode(savedMode);
    }

    const checkNetwork = () => {
      // Check Network Information API
      const nav = navigator as Navigator & {
        connection?: {
          type?: string;
          effectiveType?: string;
          saveData?: boolean;
          addEventListener?: (event: string, handler: () => void) => void;
          removeEventListener?: (event: string, handler: () => void) => void;
        };
      };

      const conn = nav.connection;
      if (conn) {
        const isCellular = conn.type === 'cellular' || conn.effectiveType === '2g' || conn.effectiveType === '3g' || Boolean(conn.saveData);
        setIsMobileData(isCellular);
        if (conn.effectiveType) {
          setEffectiveType(conn.effectiveType);
        }
      } else {
        // Fallback: If mobile screen width and touch device, assume mobile data as gentle default
        const isMobileDevice = window.innerWidth <= 768 && 'ontouchstart' in window;
        setIsMobileData(isMobileDevice);
      }
    };

    checkNetwork();

    const nav = navigator as Navigator & {
      connection?: {
        addEventListener?: (event: string, handler: () => void) => void;
        removeEventListener?: (event: string, handler: () => void) => void;
      };
    };

    const conn = nav.connection;
    if (conn && conn.addEventListener) {
      conn.addEventListener('change', checkNetwork);
      return () => {
        conn.removeEventListener?.('change', checkNetwork);
      };
    }
  }, []);

  const updateQualityMode = (mode: QualityMode) => {
    setQualityMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smriti_quality_mode', mode);
    }
  };

  // Resolved active quality: if 'auto', depends on isMobileData
  const activeQuality: 'mobile' | 'hd' =
    qualityMode === 'auto' ? (isMobileData ? 'mobile' : 'hd') : qualityMode;

  return {
    isMobileData,
    effectiveType,
    qualityMode,
    activeQuality,
    setQualityMode: updateQualityMode,
    bannerDismissed,
    dismissBanner: () => setBannerDismissed(true),
  };
}
