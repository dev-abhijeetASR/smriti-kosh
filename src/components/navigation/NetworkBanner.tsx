'use client';

import React from 'react';
import { Wifi, Smartphone, Sparkles, X, Check } from 'lucide-react';
import { QualityMode } from '@/types/gallery';

interface NetworkBannerProps {
  isMobileData: boolean;
  activeQuality: 'mobile' | 'hd';
  qualityMode: QualityMode;
  onSetQuality: (mode: QualityMode) => void;
  isDismissed: boolean;
  onDismiss: () => void;
}

export const NetworkBanner: React.FC<NetworkBannerProps> = ({
  isMobileData,
  activeQuality,
  qualityMode,
  onSetQuality,
  isDismissed,
  onDismiss,
}) => {
  if (isDismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-indigo-500/15 border-b border-amber-500/20 px-4 py-2.5 text-xs text-zinc-700 dark:text-zinc-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        {/* Message */}
        <div className="flex items-center gap-2">
          {activeQuality === 'mobile' ? (
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Wifi className="w-3.5 h-3.5" />
            </div>
          )}

          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {activeQuality === 'mobile'
                ? 'मोबाइल डेटा बचत मोड (Data Saver Active): '
                : 'अल्ट्रा एचडी मोड (Ultra HD Active): '}
            </span>
            <span>
              {activeQuality === 'mobile'
                ? 'Photos are compressed for fast browsing & low data usage. Connect to Wi-Fi for original Ultra HD experience.'
                : 'Enjoying original high-definition full clarity on Wi-Fi.'}
            </span>
          </div>
        </div>

        {/* Quality Toggles & Close */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          {activeQuality === 'mobile' ? (
            <button
              onClick={() => onSetQuality('hd')}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm shadow-indigo-600/20"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Load in Ultra HD</span>
            </button>
          ) : (
            <button
              onClick={() => onSetQuality('mobile')}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold transition-all"
            >
              <Smartphone className="w-3 h-3" />
              <span>Switch to Data Saver</span>
            </button>
          )}

          <button
            onClick={onDismiss}
            title="Dismiss notice"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
