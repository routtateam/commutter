/**
 * Real Google Maps surface for the Routta commuter app, built on
 * `@vis.gl/react-google-maps` (Google's official React wrapper around the
 * Maps JavaScript SDK — see ADR note at the bottom of this file).
 *
 * Coordinate-driven: callers pass real `{lat,lng}` points (pickup,
 * destination, a live vehicle fix, an optional route polyline) rather than
 * the old boolean-only placeholder. The `show*`/`pulse` toggles from the
 * original design-system component are preserved so existing call sites keep
 * their visual intent even where no real coordinate exists yet.
 *
 * Graceful fallback: if `VITE_GOOGLE_MAPS_API_KEY` is empty, or the Maps JS
 * SDK fails to load (bad key, billing/quota, offline), this renders
 * `RouttaMapPlaceholder` — the original hand-drawn SVG — instead of a blank
 * screen or a crash.
 */
import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Polyline,
  useMap,
  useApiLoadingStatus,
  APILoadingStatus,
} from "@vis.gl/react-google-maps";
import { RouttaMapPlaceholder } from "./RouttaMapPlaceholder";
import { LAGOS_DEFAULT_CENTER, type LatLngPoint } from "@/store/geoStore";

export type { LatLngPoint };

export interface RouttaMapProps {
  /** Real pickup coordinate. Omit/null to skip the pickup pin. */
  pickup?: LatLngPoint | null;
  /** Real destination coordinate. Omit/null to skip the destination pin. */
  destination?: LatLngPoint | null;
  /** Last-known vehicle/driver fix. There is no live driver GPS feed today
   *  (see BACKEND-GAP note in rideService.ts) — pass this only when the
   *  backend trip DTO actually carries one; never fabricate a position. */
  vehicle?: LatLngPoint | null;
  /** Ordered polyline points. Falls back to a straight pickup→destination
   *  line when omitted, since the Directions/Routes API is not enabled on
   *  the current key (Maps JS, Places and Geocoding only). */
  route?: LatLngPoint[];
  showRoute?: boolean;
  showPickup?: boolean;
  showDest?: boolean;
  showVehicle?: boolean;
  /** Animate the pickup marker with a soft radar ping (matches the old SVG). */
  pulse?: boolean;
  className?: string;
  zoom?: number;
}

const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim();
// Google's public demo Map ID — required for AdvancedMarker's vector
// rendering path. Works out of the box with any key for dev/testing; swap in
// a real Map ID (Cloud Console → Map Management) before shipping to prod via
// VITE_GOOGLE_MAPS_MAP_ID.
const MAP_ID = (import.meta.env.VITE_GOOGLE_MAPS_MAP_ID as string | undefined)?.trim() || "DEMO_MAP_ID";

function resolveCenter(props: Pick<RouttaMapProps, "pickup" | "destination" | "vehicle">): LatLngPoint {
  const { pickup, destination, vehicle } = props;
  if (pickup && destination) {
    return { lat: (pickup.lat + destination.lat) / 2, lng: (pickup.lng + destination.lng) / 2 };
  }
  return pickup ?? destination ?? vehicle ?? LAGOS_DEFAULT_CENTER;
}

export function RouttaMap(props: RouttaMapProps) {
  if (!API_KEY) {
    // No key configured — never attempt to load the SDK.
    return <RouttaMapPlaceholder {...props} />;
  }
  return (
    <APIProvider apiKey={API_KEY} libraries={["marker"]}>
      <RouttaMapInner {...props} />
    </APIProvider>
  );
}

/**
 * The Maps JS SDK reports auth failures (bad key, referrer restriction) via
 * `useApiLoadingStatus()`, but a *billing-not-enabled* or over-quota project
 * is a different animal: the script itself loads fine, tiles even partially
 * render, and Google just logs `Google Maps JavaScript API error:
 * <SomeMapError>` to the console and overlays its own "This page can't load
 * Google Maps correctly" dialog — there is no callback for it. We watch the
 * console for that signature so this counts as a load failure too, instead
 * of leaving Google's broken/watermarked map on screen.
 */
function useMapsRuntimeErrorGuard(): string | null {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const original = console.error;
    console.error = (...args: unknown[]) => {
      const message = args.map((a) => (typeof a === "string" ? a : "")).join(" ");
      const match = message.match(/Google Maps JavaScript API error:\s*(\S+)/);
      if (match) setError(match[1]);
      original(...args);
    };
    return () => {
      console.error = original;
    };
  }, []);

  return error;
}

function RouttaMapInner(props: RouttaMapProps) {
  const status = useApiLoadingStatus();
  const runtimeError = useMapsRuntimeErrorGuard();
  const failed = status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE || Boolean(runtimeError);

  useEffect(() => {
    if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
      // Surface the exact failure mode (bad key / referrer restriction)
      // rather than swallowing it — this is the one signal we get from the
      // SDK before it gives up and we fall back to the SVG.
      console.error(
        `[RouttaMap] Google Maps JS SDK failed to load (status: ${status}). ` +
          "Falling back to the placeholder map. Check VITE_GOOGLE_MAPS_API_KEY " +
          "and API/referrer restrictions."
      );
    }
  }, [status]);

  useEffect(() => {
    if (runtimeError) {
      console.warn(
        `[RouttaMap] Google Maps reported "${runtimeError}" (see the console error above for the ` +
          "docs link). Falling back to the placeholder map. This usually means billing is not " +
          "enabled on the Cloud project linked to VITE_GOOGLE_MAPS_API_KEY, or the daily quota was hit."
      );
    }
  }, [runtimeError]);

  if (failed) {
    return <RouttaMapPlaceholder {...props} />;
  }

  // While LOADING/NOT_LOADED, keep showing the placeholder so there is never
  // a blank frame; it is swapped for the live map the instant it is ready.
  if (status !== APILoadingStatus.LOADED) {
    return <RouttaMapPlaceholder {...props} />;
  }

  return <RouttaGoogleMap {...props} />;
}

function RouttaGoogleMap({
  pickup,
  destination,
  vehicle,
  route,
  showRoute = true,
  showPickup = true,
  showDest = true,
  showVehicle = false,
  pulse = false,
  className,
  zoom,
}: RouttaMapProps) {
  const center = useMemo(() => resolveCenter({ pickup, destination, vehicle }), [pickup, destination, vehicle]);
  const routePath = useMemo(() => {
    if (route && route.length > 1) return route;
    if (pickup && destination) return [pickup, destination];
    return null;
  }, [route, pickup, destination]);

  return (
    <div className={"absolute inset-0 overflow-hidden " + (className ?? "")}>
      <GoogleMap
        mapId={MAP_ID}
        defaultCenter={center}
        center={pickup || destination || vehicle ? center : undefined}
        defaultZoom={zoom ?? (pickup && destination ? 13 : 15)}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}
        style={{ width: "100%", height: "100%" }}
      >
        <FitToPoints pickup={showPickup ? pickup : null} destination={showDest ? destination : null} vehicle={showVehicle ? vehicle : null} />

        {showRoute && routePath ? (
          <>
            <Polyline path={routePath} strokeColor="#C4F04A" strokeOpacity={0.55} strokeWeight={10} zIndex={1} />
            <Polyline path={routePath} strokeColor="#003028" strokeOpacity={1} strokeWeight={5} zIndex={2} />
          </>
        ) : null}

        {showPickup && pickup ? <PickupPin position={pickup} pulse={pulse} /> : null}
        {showDest && destination ? <DestinationPin position={destination} /> : null}
        {showVehicle && vehicle ? <VehiclePin position={vehicle} /> : null}
      </GoogleMap>
    </div>
  );
}

/** Fits the viewport to whatever real points are actually being shown. */
function FitToPoints({
  pickup,
  destination,
  vehicle,
}: {
  pickup?: LatLngPoint | null;
  destination?: LatLngPoint | null;
  vehicle?: LatLngPoint | null;
}) {
  const map = useMap();
  const points = [pickup, destination, vehicle].filter((p): p is LatLngPoint => Boolean(p));

  useEffect(() => {
    if (!map || points.length < 2) return;
    const bounds = new google.maps.LatLngBounds();
    for (const p of points) bounds.extend(p);
    map.fitBounds(bounds, 64);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, JSON.stringify(points)]);

  return null;
}

function PickupPin({ position, pulse }: { position: LatLngPoint; pulse: boolean }) {
  return (
    <AdvancedMarker position={position} zIndex={3}>
      <div className="relative grid place-items-center h-[22px] w-[22px]">
        {pulse ? (
          <>
            <span className="absolute h-[22px] w-[22px] rounded-full bg-[#003028] opacity-45 [animation:rt-ping_2s_ease-out_infinite]" />
            <span className="absolute h-[22px] w-[22px] rounded-full bg-[#003028] opacity-45 [animation:rt-ping_2s_ease-out_0.9s_infinite]" />
          </>
        ) : null}
        <span className="relative h-[22px] w-[22px] rounded-full bg-white border-[2.5px] border-[#003028] grid place-items-center">
          <span className="h-[9px] w-[9px] rounded-full bg-[#003028]" />
        </span>
      </div>
    </AdvancedMarker>
  );
}

function DestinationPin({ position }: { position: LatLngPoint }) {
  return (
    <AdvancedMarker position={position} zIndex={3}>
      <div className="relative flex flex-col items-center -translate-y-1/2">
        <span
          className="h-[28px] w-[28px] rounded-full rounded-bl-none rotate-45 bg-[#003028]"
          style={{ clipPath: "path('M14 0C6.3 0 0 6.3 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.3 21.7 0 14 0z')" }}
        />
        <span className="absolute top-[6px] h-[13px] w-[13px] rounded-[3px] bg-[#C4F04A]" />
      </div>
    </AdvancedMarker>
  );
}

function VehiclePin({ position }: { position: LatLngPoint }) {
  return (
    <AdvancedMarker position={position} zIndex={4}>
      <div className="[animation:rt-drift_4s_ease-in-out_infinite] h-[38px] w-[38px] rounded-full bg-[#003028] border-[3px] border-white grid place-items-center shadow-[0_2px_8px_rgba(18,33,29,.4)]">
        <span className="h-[10px] w-[16px] rounded-[2px] bg-[#C4F04A]" />
      </div>
    </AdvancedMarker>
  );
}

/*
 * ---- Library choice ----
 * `@vis.gl/react-google-maps` (not `@react-google-maps/api`):
 *  - Actively maintained by the Google Maps Platform team (the other popular
 *    wrapper, react-google-maps/api, has had long maintainer gaps).
 *  - First-class function-component API (`<APIProvider>`/`<Map>`/
 *    `<AdvancedMarker>`/`<Polyline>`), no HOCs/render-prop ceremony, small
 *    (~30kB) and tree-shakeable.
 *  - `useApiLoadingStatus()` exposes FAILED/AUTH_FAILURE distinctly, which is
 *    exactly the signal this component needs to fall back to the SVG
 *    placeholder on a bad key or billing/quota error instead of guessing
 *    from a thrown exception.
 *  - Designed for exactly this "many independent screens each mount their
 *    own <APIProvider>" pattern: the underlying script load is deduped
 *    globally by API key, so remounting per-route (as we do, once per
 *    RouttaMap instance) does not reload the SDK on every navigation.
 */
