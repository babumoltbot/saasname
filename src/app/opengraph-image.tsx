import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "PikName — AI-powered name generator. Get name ideas, check domains, and validate your brand.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #0d1f12 50%, #0a0a0a 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: "absolute",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(60,255,138,0.08) 0%, transparent 70%)",
            top: "-100px",
            right: "-100px",
            display: "flex",
          }}
        />

        {/* Logo / Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#3cff8a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
              color: "#0a0a0a",
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            PikName
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Stop guessing.
          </span>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#3cff8a",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Validate it.
          </span>
        </div>

        {/* Subtitle */}
        <span
          style={{
            fontSize: "22px",
            color: "#a3a3a3",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.5,
            marginBottom: "40px",
          }}
        >
          AI-powered name generator for startups and products.
          Get ideas, check domains, and score your brand.
        </span>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            padding: "14px 40px",
            borderRadius: "10px",
            background: "#3cff8a",
            color: "#0a0a0a",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Try it at www.pikname.com
        </div>
      </div>
    ),
    { ...size }
  );
}
