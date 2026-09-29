/**
 * Abstract, hand-drawn map surface matching the Routta design system's
 * RouttaMap.dc.html reference component — a stylised Victoria Island / Ikeja
 * street grid so the app reads as "a map" without pretending to stream real
 * tiles.
 *
 * This is the fallback rendered by `RouttaMap` (see RouttaMap.tsx) whenever
 * `VITE_GOOGLE_MAPS_API_KEY` is unset or the Google Maps JS SDK fails to load
 * (auth/billing/quota/network) — kept around and exported on its own so that
 * failure path never has to render a blank screen. Coordinate props from the
 * real map interface are accepted for a drop-in swap but intentionally
 * ignored: this surface never had real geography to plot them on.
 */
export function RouttaMapPlaceholder({
  showRoute = true,
  showPickup = true,
  showDest = true,
  showVehicle = false,
  pulse = false,
  className,
}: {
  showRoute?: boolean;
  showPickup?: boolean;
  showDest?: boolean;
  showVehicle?: boolean;
  pulse?: boolean;
  className?: string;
  // Accepted for interface-compatibility with RouttaMap; unused here.
  pickup?: unknown;
  destination?: unknown;
  vehicle?: unknown;
  route?: unknown;
  zoom?: unknown;
}) {
  return (
    <div className={"absolute inset-0 overflow-hidden bg-[#F2EFE6] " + (className ?? "")}>
      <svg
        viewBox="0 0 390 780"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full block"
      >
        <rect x="0" y="0" width="390" height="780" fill="#F2EFE6" />
        <g fill="#E7E3D6">
          <rect x="12" y="16" width="46" height="82" rx="3" />
          <rect x="90" y="16" width="64" height="58" rx="3" />
          <rect x="184" y="30" width="60" height="68" rx="3" />
          <rect x="278" y="16" width="44" height="40" rx="3" />
          <rect x="348" y="40" width="34" height="58" rx="3" />
          <rect x="16" y="138" width="42" height="88" rx="3" />
          <rect x="186" y="132" width="58" height="46" rx="3" />
          <rect x="188" y="196" width="42" height="34" rx="3" />
          <rect x="284" y="140" width="40" height="86" rx="3" />
          <rect x="352" y="150" width="30" height="72" rx="3" />
          <rect x="14" y="412" width="48" height="94" rx="3" />
          <rect x="188" y="410" width="62" height="52" rx="3" />
          <rect x="196" y="474" width="48" height="38" rx="3" />
          <rect x="286" y="404" width="42" height="60" rx="3" />
          <rect x="350" y="420" width="32" height="88" rx="3" />
          <rect x="186" y="548" width="56" height="96" rx="3" />
          <rect x="284" y="544" width="44" height="52" rx="3" />
          <rect x="292" y="612" width="36" height="36" rx="3" />
          <rect x="352" y="556" width="30" height="94" rx="3" />
          <rect x="20" y="684" width="42" height="70" rx="3" />
          <rect x="96" y="690" width="58" height="46" rx="3" />
          <rect x="190" y="682" width="50" height="52" rx="3" />
        </g>
        <path d="M16 556h122a6 6 0 016 6v96a6 6 0 01-6 6H16z" fill="#D3E4BE" />
        <g fill="#B9D3A0">
          <circle cx="44" cy="592" r="9" />
          <circle cx="76" cy="614" r="12" />
          <circle cx="112" cy="586" r="8" />
          <circle cx="58" cy="642" r="10" />
          <circle cx="118" cy="638" r="7" />
        </g>
        <path d="M390 780V596c-42 14-72 48-96 100-14 30-26 58-34 84z" fill="#A9CFEA" />
        <path
          d="M390 596c-42 14-72 48-96 100-14 30-26 58-34 84"
          fill="none"
          stroke="#8FBCDC"
          strokeWidth="1.5"
        />
        <g fill="none" stroke="#E3DED0" strokeWidth="14" strokeLinecap="round">
          <path d="M-6 118H396M-6 258H396M-6 400H396M-6 540H396M-6 668H396" />
          <path d="M74-6V786M168-6V786M262-6V786M336-6V786" />
          <path d="M120 118V258M212 400V540M300 258V400" />
        </g>
        <g fill="none" stroke="#fff" strokeWidth="9.5" strokeLinecap="round">
          <path d="M-6 118H396M-6 258H396M-6 400H396M-6 540H396M-6 668H396" />
          <path d="M74-6V786M168-6V786M262-6V786M336-6V786" />
          <path d="M120 118V258M212 400V540M300 258V400" />
        </g>
        <path
          d="M-10 736C74 676 108 546 196 452S330 254 402 156"
          fill="none"
          stroke="#E6D68C"
          strokeWidth="19"
          strokeLinecap="round"
        />
        <path
          d="M-10 736C74 676 108 546 196 452S330 254 402 156"
          fill="none"
          stroke="#FBEFA8"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <g
          fill="#A6A196"
          fontFamily="'Plus Jakarta Sans',system-ui,sans-serif"
          fontSize="9"
          fontWeight="600"
          letterSpacing=".4"
        >
          <text x="22" y="112">ADEOLA ODEKU ST</text>
          <text x="182" y="394">AKIN ADESOLA</text>
          <text x="80" y="662">OZUMBA MBADIWE AVE</text>
          <text x="30" y="546" fill="#8FA37C">MUSA YAR'ADUA PARK</text>
          <text x="286" y="742" fill="#7FA6C4">LAGOS LAGOON</text>
        </g>
        {showRoute ? (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M100 600H168V400H262V258H300V190" stroke="#C4F04A" strokeWidth="13" opacity=".55" />
            <path d="M100 600H168V400H262V258H300V190" stroke="#003028" strokeWidth="6" />
            <path
              d="M100 600H168V400H262V258H300V190"
              stroke="#fff"
              strokeWidth="2.2"
              strokeDasharray="7 21"
              opacity=".85"
              className="[animation:rt-dash_1.1s_linear_infinite]"
            />
          </g>
        ) : null}
        {showPickup ? (
          <g>
            {pulse ? (
              <>
                <circle
                  cx="100"
                  cy="600"
                  r="14"
                  fill="#003028"
                  opacity=".45"
                  className="[animation:rt-ping_2s_ease-out_infinite] origin-[100px_600px]"
                />
                <circle
                  cx="100"
                  cy="600"
                  r="14"
                  fill="#003028"
                  opacity=".45"
                  className="[animation:rt-ping_2s_ease-out_0.9s_infinite] origin-[100px_600px]"
                />
              </>
            ) : null}
            <circle cx="100" cy="600" r="11" fill="#fff" />
            <circle cx="100" cy="600" r="11" fill="none" stroke="#003028" strokeWidth="2.5" />
            <circle cx="100" cy="600" r="4.5" fill="#003028" />
          </g>
        ) : null}
        {showDest ? (
          <g>
            <path
              d="M300 190c-9.9 0-18-8.1-18-18 0-13.5 18-30 18-30s18 16.5 18 30c0 9.9-8.1 18-18 18z"
              fill="#003028"
              transform="translate(0,10)"
            />
            <rect x="292" y="156" width="16" height="16" rx="4" fill="#C4F04A" />
          </g>
        ) : null}
        {showVehicle ? (
          <g className="[animation:rt-drift_4s_ease-in-out_infinite]">
            <circle cx="168" cy="470" r="19" fill="#003028" />
            <circle cx="168" cy="470" r="19" fill="none" stroke="#fff" strokeWidth="3" />
            <path
              d="M158 472v-5l3-6h14l3 6v5h-3a3 3 0 01-6 0h-2a3 3 0 01-6 0z"
              fill="#C4F04A"
            />
          </g>
        ) : null}
      </svg>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg,rgba(18,33,29,.10) 0%,rgba(18,33,29,0) 22%,rgba(18,33,29,0) 70%,rgba(18,33,29,.06) 100%)",
        }}
      />
    </div>
  );
}
