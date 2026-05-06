import { ImageResponse } from "next/og";
import { DISTANCE_SHORT_JA, metersOf } from "@/lib/distance";
import { decodeInput } from "@/lib/encoding";
import { consensusSeconds, nextSubTargetGap, predictAll } from "@/lib/predict";
import { formatSignedDelta, formatTime } from "@/lib/time";

export const runtime = "edge";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash") ?? "";
  const decoded = decodeInput(hash);
  if (!decoded) return new Response("invalid hash", { status: 400 });

  const fromMeters = metersOf(decoded.fromKey);
  const toMeters = metersOf(decoded.toKey);
  const preds = predictAll(fromMeters, decoded.fromTimeSec, toMeters);
  const consensus = consensusSeconds(preds);
  const sub = nextSubTargetGap(consensus, toMeters);
  const fromShort = DISTANCE_SHORT_JA[decoded.fromKey];
  const toShort = DISTANCE_SHORT_JA[decoded.toKey];

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
      <div
        style={{
          display: "flex",
          fontSize: 26,
          color: "#a3afc6",
          letterSpacing: 2,
        }}
      >
        🏃 マラソンタイム予測
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
          {fromShort} {formatTime(decoded.fromTimeSec, { forceHours: true })} の人の
        </div>
        <div style={{ display: "flex", fontSize: 36, color: "#a3afc6", marginTop: 10 }}>
          {toShort} 予測タイム
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 140,
            fontWeight: 800,
            color: "#ff7a45",
            lineHeight: 1,
            marginTop: 18,
            letterSpacing: -2,
          }}
        >
          {formatTime(consensus, { forceHours: true })}
        </div>
        {sub && !sub.achieved && (
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#ffd166",
              marginTop: 24,
            }}
          >
            🎯 {sub.target.labelJa} まであと {formatSignedDelta(sub.gapSec)}
          </div>
        )}
        {sub?.achieved && (
          <div
            style={{
              display: "flex",
              fontSize: 32,
              color: "#ffd166",
              marginTop: 24,
            }}
          >
            🏆 {sub.target.labelJa} を {formatSignedDelta(sub.gapSec)} で射程内
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
          Riegel(一般) {formatTime(preds[0]?.seconds ?? 0, { forceHours: true })} ・ VDOT{" "}
          {formatTime(preds[1]?.seconds ?? 0, { forceHours: true })} ・ Riegel(エリート){" "}
          {formatTime(preds[2]?.seconds ?? 0, { forceHours: true })}
        </div>
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
