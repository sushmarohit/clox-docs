'use client';

import { useId, useState } from 'react';
import type { HomeCopy } from '@/components/home/copy';

type AboutTab = 'vision' | 'mission';

export function HomeAbout({ copy }: { copy: HomeCopy }) {
  const [activeTab, setActiveTab] = useState<AboutTab>('vision');
  const baseId = useId();
  const visionPanelId = `${baseId}-vision`;
  const missionPanelId = `${baseId}-mission`;

  return (
    <section
      id="aboutus"
      className="relative scroll-mt-28 overflow-hidden bg-white px-5 py-14 sm:px-8 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] motion-reduce:hidden"
        aria-hidden
      >
        <svg
          className="absolute bottom-[10%] left-[-150px] w-[150px] animate-about-truck-bg text-clox-navy"
          viewBox="0 0 640 512"
          fill="currentColor"
        >
          <path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative mx-auto h-[400px] w-full max-w-[520px] lg:mx-0 lg:h-[500px] lg:max-w-none">
          <img
            src="/landing/18771.jpg"
            alt="Logistics operations"
            className="absolute left-0 top-0 z-[2] aspect-[7/5] w-[70%] max-h-[350px] rounded-2xl border-8 border-white object-cover shadow-clox-card animate-about-float motion-reduce:animate-none"
          />
          <img
            src="/landing/1380.jpg"
            alt="Freight transport"
            className="absolute bottom-0 right-0 z-[1] aspect-[3/2.5] w-[60%] max-h-[300px] rounded-2xl border-8 border-white object-cover shadow-clox-card animate-about-float-delayed motion-reduce:animate-none"
          />
        </div>

        <div>
          <div className="relative mb-3 h-[52px] overflow-hidden border-b-2 border-dashed border-clox-navy/20 motion-reduce:hidden">
            <svg
              className="absolute bottom-0.5 left-[-200px] h-11 w-[190px] animate-about-truck-scroll"
              viewBox="0 0 190 50"
              aria-hidden
            >
              <line
                x1="2"
                y1="20"
                x2="14"
                y2="20"
                stroke="#FF560E"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
              <line
                x1="6"
                y1="26"
                x2="16"
                y2="26"
                stroke="#0A1F3C"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.4"
              />
              <line
                x1="1"
                y1="32"
                x2="12"
                y2="32"
                stroke="#FF560E"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
              />
              <rect x="18" y="8" width="98" height="30" rx="3" fill="#0A1F3C" />
              <line x1="32" y1="9" x2="32" y2="37" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <line x1="46" y1="9" x2="46" y2="37" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <line x1="60" y1="9" x2="60" y2="37" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <line x1="74" y1="9" x2="74" y2="37" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <line x1="88" y1="9" x2="88" y2="37" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <line x1="102" y1="9" x2="102" y2="37" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
              <rect x="18" y="21" width="98" height="6" fill="#FF560E" />
              <text
                x="67"
                y="18"
                fill="#ffffff"
                fontSize="8.5"
                fontWeight="900"
                fontFamily="Poppins, sans-serif"
                textAnchor="middle"
                letterSpacing="1.5"
              >
                CLOX
              </text>
              <text
                x="67"
                y="33"
                fill="#cbd5e1"
                fontSize="4.5"
                fontWeight="700"
                fontFamily="Poppins, sans-serif"
                textAnchor="middle"
                letterSpacing="1"
              >
                FULL LOAD
              </text>
              <rect x="22" y="38" width="90" height="3" fill="#334155" />
              <rect x="44" y="38" width="30" height="4" rx="1" fill="#1e293b" />
              <rect x="114" y="28" width="8" height="9" fill="#334155" />
              <path
                d="M 120 38 L 120 14 Q 120 9 125 9 L 146 9 Q 155 10 162 20 L 168 28 Q 170 30 170 34 L 170 38 Z"
                fill="#FF560E"
              />
              <path
                d="M 143 13 L 127 13 Q 125 13 125 15 L 125 24 L 143 24 Z"
                fill="#0a1f3c"
                opacity="0.9"
              />
              <path
                d="M 147 13 L 157 22 Q 159 24 160 24 L 147 24 Z"
                fill="#0a1f3c"
                opacity="0.9"
              />
              <path d="M 120 14 Q 120 7 127 7 L 140 7 Q 133 9 125 14 Z" fill="#0A1F3C" />
              <rect x="166" y="31" width="4" height="4" rx="1" fill="#fef08a" />
              <polygon points="170,31 189,27 189,38 170,35" fill="rgba(254, 240, 138, 0.3)" />
              <rect x="162" y="35" width="8" height="3" rx="1" fill="#1e293b" />
              <circle cx="34" cy="41" r="7" fill="#0f172a" />
              <circle cx="34" cy="41" r="4.5" fill="#94a3b8" />
              <circle cx="34" cy="41" r="2" fill="#FF560E" />
              <circle cx="52" cy="41" r="7" fill="#0f172a" />
              <circle cx="52" cy="41" r="4.5" fill="#94a3b8" />
              <circle cx="52" cy="41" r="2" fill="#FF560E" />
              <circle cx="106" cy="41" r="7" fill="#0f172a" />
              <circle cx="106" cy="41" r="4.5" fill="#94a3b8" />
              <circle cx="106" cy="41" r="2" fill="#FF560E" />
              <circle cx="152" cy="41" r="7" fill="#0f172a" />
              <circle cx="152" cy="41" r="4.5" fill="#94a3b8" />
              <circle cx="152" cy="41" r="2" fill="#FF560E" />
            </svg>
          </div>

          <p className="mb-2 text-[1.05rem] font-semibold tracking-wide text-clox-orange sm:text-[1.2rem]">
            {copy.overviewEyebrow}
          </p>
          <h2 className="mb-4 text-left text-[1.65rem] font-extrabold uppercase tracking-tight text-clox-navy sm:text-[2.8rem] lg:text-[3.1rem]">
            {copy.overviewTitle}
          </h2>
          <p className="mb-8 text-[1.05rem] leading-7 text-slate-600 sm:text-[1.1rem] sm:leading-8">
            {copy.overviewBody}
          </p>

          <div className="mb-5 flex flex-wrap gap-3" role="tablist" aria-label={copy.overviewTitle}>
            <TabButton
              id={`${baseId}-tab-vision`}
              controls={visionPanelId}
              isActive={activeTab === 'vision'}
              onSelect={() => setActiveTab('vision')}
              label={copy.visionTab}
            />
            <TabButton
              id={`${baseId}-tab-mission`}
              controls={missionPanelId}
              isActive={activeTab === 'mission'}
              onSelect={() => setActiveTab('mission')}
              label={copy.missionTab}
            />
          </div>

          <div
            id={visionPanelId}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-vision`}
            hidden={activeTab !== 'vision'}
            className={activeTab === 'vision' ? 'animate-about-tab-in' : undefined}
          >
            <p className="text-base leading-7 text-slate-600 sm:text-[1.05rem] sm:leading-8">
              {copy.visionBody}
            </p>
          </div>
          <div
            id={missionPanelId}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-mission`}
            hidden={activeTab !== 'mission'}
            className={activeTab === 'mission' ? 'animate-about-tab-in' : undefined}
          >
            <p className="text-base leading-7 text-slate-600 sm:text-[1.05rem] sm:leading-8">
              {copy.missionBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TabButton({
  id,
  controls,
  isActive,
  onSelect,
  label,
}: {
  id: string;
  controls: string;
  isActive: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="tab"
      aria-selected={isActive}
      aria-controls={controls}
      tabIndex={isActive ? 0 : -1}
      onClick={onSelect}
      className={
        isActive
          ? 'rounded-full border-2 border-clox-orange bg-clox-orange px-4 py-1.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(255,114,0,0.3)] transition'
          : 'rounded-full border-2 border-slate-200 bg-transparent px-4 py-1.5 text-sm font-semibold text-slate-500 transition hover:border-clox-orange hover:text-clox-orange'
      }
    >
      {label}
    </button>
  );
}
