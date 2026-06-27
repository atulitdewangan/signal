import { useState } from "react";

const NEON = "#39FF14";

/* ── Procedural barcode ── */
function Barcode({ dark = true }: { dark?: boolean }) {
  const pattern = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2];
  const color = dark ? "#0A0A0A" : NEON;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: 32, gap: 1.5 }}>
      {pattern.map((w, i) => (
        <div
          key={i}
          style={{
            width: w === 1 ? 1.5 : w === 2 ? 2.5 : 4,
            height: i % 7 === 0 ? "100%" : i % 3 === 0 ? "75%" : "55%",
            background: color,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

/* ── Certificate card (white physical card) ── */
function Certificate() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        width: "100%",
        aspectRatio: "210 / 297", // A4
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px 28px 24px",
        fontFamily: "'Inter', sans-serif",
        boxShadow: "0 32px 96px rgba(0,0,0,0.9)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top section */}
      <div>
        {/* Double-rule header */}
        <div style={{ height: 2.5, background: "#0A0A0A", marginBottom: 3 }} />
        <div style={{ height: 0.5, background: "#0A0A0A", marginBottom: 22 }} />

        {/* Issuer */}
        <p style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 7.5,
          letterSpacing: "0.2em",
          color: "#888",
          textTransform: "uppercase",
          marginBottom: 10,
        }}>
          CERTIFICATE OF COMPLETION
        </p>

        {/* Title */}
        <h1 style={{
          fontSize: 20,
          fontWeight: 900,
          color: "#0A0A0A",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          marginBottom: 18,
        }}>
          Spatial<br />Gestural<br />Mastery
        </h1>

        {/* Thin divider */}
        <div style={{ height: 0.5, background: "#D0D0D0", marginBottom: 14 }} />

        {/* Awarded to */}
        <p style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 7,
          letterSpacing: "0.18em",
          color: "#999",
          textTransform: "uppercase",
          marginBottom: 4,
        }}>
          AWARDED TO
        </p>
        <p style={{
          fontSize: 11.5,
          fontWeight: 800,
          color: "#0A0A0A",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          ATULIT DEWANGAN
        </p>
      </div>

      {/* Score band */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 6,
        margin: "16px 0",
      }}>
        <span style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 48,
          fontWeight: 700,
          color: "#0A0A0A",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}>
          98.4
        </span>
        <span style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 18,
          color: "#555",
        }}>
          %
        </span>
        <span style={{
          fontFamily: "'Fira Code', monospace",
          fontSize: 7,
          letterSpacing: "0.14em",
          color: "#aaa",
          textTransform: "uppercase",
          marginLeft: 6,
        }}>
          ACCURACY SCORE
        </span>
      </div>

      {/* Bottom section */}
      <div>
        <div style={{ height: 0.5, background: "#D0D0D0", marginBottom: 14 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          {/* Verification */}
          <div>
            <p style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 6.5,
              letterSpacing: "0.16em",
              color: "#aaa",
              textTransform: "uppercase",
              marginBottom: 3,
            }}>
              VERIFIED BUILD
            </p>
            <p style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: "0.1em",
              color: "#0A0A0A",
              textTransform: "uppercase",
            }}>
              BUILD // ATULIT DEWANGAN
            </p>
          </div>

          {/* Barcode block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <Barcode dark />
            <p style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 6,
              color: "#bbb",
              letterSpacing: "0.06em",
            }}>
              SIG-2026-984-AD
            </p>
          </div>
        </div>

        {/* Double-rule footer */}
        <div style={{ height: 0.5, background: "#0A0A0A", marginTop: 14, marginBottom: 3 }} />
        <div style={{ height: 2, background: "#0A0A0A" }} />
      </div>
    </div>
  );
}

/* ── Data table rows ── */
const ROWS = [
  { key: "TOTAL_TIME", value: "02:14:45", unit: null },
  { key: "LATENCY_AVG", value: "12", unit: "ms" },
  { key: "SIGNS_MATCHED", value: "26/26", unit: null },
];

/* ── App ── */
export default function App() {
  const [dlState, setDlState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = () => {
    if (dlState !== "idle") return;
    setDlState("loading");
    setTimeout(() => {
      setDlState("done");
      setTimeout(() => setDlState("idle"), 3000);
    }, 1600);
  };

  const btnLabel =
    dlState === "idle"
      ? "[ INITIATE_DOWNLOAD : CREDENTIAL.PDF ]"
      : dlState === "loading"
      ? "[ GENERATING... ]"
      : "[ DOWNLOAD_COMPLETE ]";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#FFFFFF",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ════════════ HEADER ════════════ */}
      <header style={{ padding: "28px 48px 0" }}>
        <div style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 20,
        }}>
          {/* Logo group */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#FFFFFF",
              lineHeight: 1,
            }}>
              SIGNAL
            </span>
            <span style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 8.5,
              letterSpacing: "0.22em",
              color: "#3A3A3A",
              textTransform: "uppercase",
            }}>
              SPATIAL_RECOGNITION // ENGINE V4
            </span>
          </div>

          {/* Right credit */}
          <span style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 9.5,
            letterSpacing: "0.2em",
            color: "#A1A1AA",
            textTransform: "uppercase",
          }}>
            BUILD // ATULIT DEWANGAN
          </span>
        </div>

        {/* 2px neon rule */}
        <div style={{ width: "100%", height: 2, background: NEON }} />
      </header>

      {/* ════════════ MAIN GRID ════════════ */}
      <main style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        padding: "0 48px",
      }}>

        {/* ─── LEFT COLUMN ─── */}
        <div style={{
          padding: "52px 64px 52px 0",
          borderRight: "1px solid #262626",
          display: "flex",
          flexDirection: "column",
        }}>

          {/* Session status chip */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
          }}>
            <div style={{ width: 7, height: 7, background: NEON }} />
            <span style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 10.5,
              letterSpacing: "0.25em",
              color: NEON,
              textTransform: "uppercase",
            }}>
              [ SESSION_COMPLETE ]
            </span>
          </div>

          {/* Giant percentage */}
          <div style={{ marginBottom: 24, lineHeight: 1 }}>
            <span style={{
              fontSize: 128,
              fontWeight: 900,
              color: NEON,
              letterSpacing: "-0.04em",
              display: "block",
              fontVariantNumeric: "tabular-nums",
            }}>
              98.4
            </span>
            <span style={{
              fontSize: 48,
              fontWeight: 900,
              color: NEON,
              letterSpacing: "-0.02em",
              display: "block",
              marginTop: -8,
            }}>
              %
            </span>
          </div>

          {/* Technical description */}
          <p style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 11,
            lineHeight: 1.8,
            color: "#A1A1AA",
            letterSpacing: "0.04em",
            marginBottom: 40,
            maxWidth: 480,
          }}>
            GESTURE_RECOGNITION_ACCURACY — SESSION_ID: SGM-2026-AD-0026 //<br />
            ALL 26 SIGN VECTORS CAPTURED AND VALIDATED AGAINST REFERENCE<br />
            CORPUS. DELTA ±0.3° // FRAME_RATE 60FPS // ENGINE SIGNALV4.
          </p>

          {/* Data matrix */}
          <div style={{
            border: "1px solid #262626",
            marginBottom: 28,
          }}>
            {/* Col headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderBottom: "1px solid #262626",
              background: "#0F0F0F",
            }}>
              {["PARAMETER", "VALUE"].map((h, i) => (
                <div key={h} style={{
                  padding: "9px 18px",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 8.5,
                  letterSpacing: "0.22em",
                  color: "#444",
                  textTransform: "uppercase",
                  borderRight: i === 0 ? "1px solid #262626" : "none",
                }}>
                  {h}
                </div>
              ))}
            </div>

            {ROWS.map((row, i) => (
              <div
                key={row.key}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  borderBottom: i < ROWS.length - 1 ? "1px solid #1A1A1A" : "none",
                  cursor: "default",
                }}
                className="table-row-hover"
              >
                <div style={{
                  padding: "16px 18px",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 11.5,
                  color: "#666",
                  letterSpacing: "0.07em",
                  borderRight: "1px solid #1A1A1A",
                }}>
                  {row.key}
                </div>
                <div style={{
                  padding: "16px 18px",
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  letterSpacing: "0.05em",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                }}>
                  {row.value}
                  {row.unit && (
                    <span style={{ fontSize: 9, color: "#666", fontWeight: 400 }}>
                      {row.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA download button */}
          <button
            onClick={handleDownload}
            style={{
              width: "100%",
              background: dlState === "done" ? NEON : "transparent",
              border: `1px solid ${dlState === "idle" ? "#444" : NEON}`,
              color: dlState === "done" ? "#0A0A0A" : dlState === "loading" ? NEON : "#FFFFFF",
              padding: "20px 24px",
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: dlState === "idle" ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.25s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              if (dlState === "idle") {
                e.currentTarget.style.borderColor = NEON;
                e.currentTarget.style.color = NEON;
              }
            }}
            onMouseLeave={(e) => {
              if (dlState === "idle") {
                e.currentTarget.style.borderColor = "#444";
                e.currentTarget.style.color = "#FFFFFF";
              }
            }}
          >
            <span>{btnLabel}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v9M3 7l4 4 4-4M1 13h12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          {/* Secure line */}
          <div style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <div style={{
              width: 5,
              height: 5,
              background: NEON,
              borderRadius: "50%",
            }}
              className="blink"
            />
            <span style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 8.5,
              letterSpacing: "0.16em",
              color: "#333",
              textTransform: "uppercase",
            }}>
              SECURE_ENDPOINT — TLS 1.3 — SHA-256 // SIGNED
            </span>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div style={{
          padding: "52px 0 52px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}>

          {/* Right header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}>
            <span style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 9,
              letterSpacing: "0.24em",
              color: "#444",
              textTransform: "uppercase",
            }}>
              [ CREDENTIAL_PREVIEW ]
            </span>
            <span style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              color: "#333",
              textTransform: "uppercase",
            }}>
              REV_01 // 2026-06-26
            </span>
          </div>

          {/* Dark frame containing certificate */}
          <div style={{
            background: "#161616",
            border: "1px solid #262626",
            padding: "36px 36px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flex: 1,
          }}>
            {/* Corner crosshairs */}
            {[
              { top: 10, left: 10, bt: true, bl: true },
              { top: 10, right: 10, bt: true, br: true },
              { bottom: 10, left: 10, bb: true, bl: true },
              { bottom: 10, right: 10, bb: true, br: true },
            ].map((c, i) => (
              <div key={i} style={{
                position: "absolute",
                width: 14,
                height: 14,
                top: c.top,
                left: (c as any).left,
                right: (c as any).right,
                bottom: c.bottom,
                borderTop: (c as any).bt ? `1.5px solid ${NEON}` : undefined,
                borderBottom: (c as any).bb ? `1.5px solid ${NEON}` : undefined,
                borderLeft: (c as any).bl ? `1.5px solid ${NEON}` : undefined,
                borderRight: (c as any).br ? `1.5px solid ${NEON}` : undefined,
              }} />
            ))}

            {/* Scan-line texture overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
              pointerEvents: "none",
              zIndex: 1,
            }} />

            {/* Certificate */}
            <div style={{
              width: "100%",
              maxWidth: 300,
              position: "relative",
              zIndex: 2,
            }}>
              <Certificate />
            </div>
          </div>

          {/* Meta strip */}
          <div style={{
            border: "1px solid #262626",
            borderTop: "none",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
          }}>
            {[
              { label: "FORMAT", value: "A4 PDF" },
              { label: "VERSION", value: "V4.0.1" },
              { label: "STATUS", value: "SEALED", accent: true },
            ].map((item, i) => (
              <div key={item.label} style={{
                padding: "14px 16px",
                borderRight: i < 2 ? "1px solid #262626" : "none",
              }}>
                <div style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 7.5,
                  letterSpacing: "0.2em",
                  color: "#444",
                  textTransform: "uppercase",
                  marginBottom: 5,
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: item.accent ? NEON : "#FFFFFF",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{ padding: "0 48px 24px" }}>
        <div style={{ height: 1, background: "#1C1C1C", marginBottom: 14 }} />
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 8.5,
            letterSpacing: "0.16em",
            color: "#2C2C2C",
            textTransform: "uppercase",
          }}>
            SIGNAL ENGINE V4 — SPATIAL GESTURAL RECOGNITION PLATFORM
          </span>
          <span style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 8.5,
            letterSpacing: "0.14em",
            color: "#2C2C2C",
            textTransform: "uppercase",
          }}>
            © 2026 // ALL SYSTEMS NOMINAL
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .blink { animation: blink 2.2s ease-in-out infinite; }
        .table-row-hover:hover { background: #111111; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
