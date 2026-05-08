import { ImageResponse } from "next/og";
import { metersOf } from "@/lib/distance";
import { decodeInput } from "@/lib/encoding";
import { getDict, interpolate } from "@/lib/i18n/dictionary";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/locales";
import { consensusSeconds, nextSubTargetGap, predictAll } from "@/lib/predict";
import { formatSignedDelta, formatTime } from "@/lib/time";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash") ?? "";
  const langRaw = searchParams.get("lang");
  const locale = langRaw && isLocale(langRaw) ? langRaw : DEFAULT_LOCALE;
  const t = getDict(locale);

  const decoded = decodeInput(hash);
  if (!decoded) return new Response("invalid hash", { status: 400 });

  const fromMeters = metersOf(decoded.fromKey);
  const toMeters = metersOf(decoded.toKey);
  const preds = predictAll(fromMeters, decoded.fromTimeSec, toMeters);
  const consensus = consensusSeconds(preds);
  const sub = nextSubTargetGap(consensus, toMeters);
  const fromShort = t.distances[decoded.fromKey];
  const toShort = t.distances[decoded.toKey];

  const subLabel = sub ? t.subTargets[sub.target.key as keyof typeof t.subTargets] : null;
  const subText = sub
    ? interpolate(sub.achieved ? t.subTargets.inReach : t.subTargets.awayBy, {
        delta: formatSignedDelta(sub.gapSec),
      })
    : "";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #07101e 0%, #142544 60%, #1c1240 100%)",
        color: "#f4f4f7",
        padding: "60px 70px",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, color: "#a3afc6", letterSpacing: 2 }}>
        🏃 {t.meta.siteName}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        <div style={{ display: "flex", fontSize: 32, color: "#ffd6c4" }}>
          {fromShort} {formatTime(decoded.fromTimeSec, { forceHours: true })}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a3afc6", marginTop: 6 }}>
          → {toShort}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 144,
            fontWeight: 800,
            color: "#ff7a45",
            lineHeight: 1,
            marginTop: 18,
            letterSpacing: -2,
          }}
        >
          {formatTime(consensus, { forceHours: true })}
        </div>
        {sub && subLabel && (
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#ffd166",
              marginTop: 24,
            }}
          >
            {sub.achieved ? "🏆" : "🎯"} {subLabel} {subText}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          color: "#a3afc6",
          marginTop: 16,
        }}
      >
        <div style={{ display: "flex" }}>
          {t.models.riegel} {formatTime(preds[0]?.seconds ?? 0, { forceHours: true })} ・{" "}
          {t.models.vdot} {formatTime(preds[1]?.seconds ?? 0, { forceHours: true })} ・{" "}
          {t.models.riegelElite} {formatTime(preds[2]?.seconds ?? 0, { forceHours: true })}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
