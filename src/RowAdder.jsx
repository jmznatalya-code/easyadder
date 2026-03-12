import { useState, useRef, useEffect } from "react";

const initialRows = [
  { id: 1, note: "", value: "", neg: false },
  { id: 2, note: "", value: "", neg: false },
  { id: 3, note: "", value: "", neg: false },
];

let nextId = 4;

function fmt(n) {
  const abs = Math.abs(n);
  return abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function usePrevious(val) {
  const ref = useRef(val);
  useEffect(() => { ref.current = val; });
  return ref.current;
}

export default function RowAdder() {
  const [rows, setRows] = useState(initialRows);
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(null);
  const [flashTotal, setFlashTotal] = useState(false);
  const [newRowId, setNewRowId] = useState(null);
  const prevSubtotal = useRef(0);

  const subtotal = rows.reduce((acc, r) => {
    const v = parseFloat(r.value) || 0;
    return acc + (r.neg ? -Math.abs(v) : Math.abs(v));
  }, 0);

  useEffect(() => {
    if (subtotal !== prevSubtotal.current) {
      setFlashTotal(true);
      const t = setTimeout(() => setFlashTotal(false), 300);
      prevSubtotal.current = subtotal;
      return () => clearTimeout(t);
    }
  }, [subtotal]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const addRow = () => {
    const id = nextId++;
    setRows(prev => [...prev, { id, note: "", value: "", neg: false }]);
    setNewRowId(id);
    setTimeout(() => setNewRowId(null), 400);
  };

  const updateRow = (id, field, val) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));

  const toggleSign = (id, neg) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, neg } : r));

  const deleteRow = (id) =>
    setRows(prev => prev.filter(r => r.id !== id));

  const clearAll = () => {
    if (window.confirm("Clear all rows?")) {
      setRows([]);
      showToast("Cleared");
    }
  };

  const saveData = () => {
    setSaved(JSON.stringify(rows));
    showToast("Saved ✓");
  };

  const loadData = () => {
    if (!saved) { showToast("Nothing saved"); return; }
    try { setRows(JSON.parse(saved)); showToast("Loaded ✓"); }
    catch { showToast("Load error"); }
  };

  const isNeg = subtotal < 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f0e8",
      fontFamily: "'Courier New', 'Lucida Console', monospace",
      color: "#1a1a1a",
      display: "flex",
      flexDirection: "column",
      maxWidth: 560,
      margin: "0 auto",
      boxShadow: "0 0 60px rgba(0,0,0,0.15)",
      position: "relative",
    }}>

      {/* Paper texture overlay */}
      <div style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 50,
        opacity: 0.025,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "128px",
      }} />

      {/* Receipt top serration */}
      <div style={{
        height: 12,
        background: `radial-gradient(circle at 50% 0%, #f5f0e8 8px, transparent 8px) repeat-x`,
        backgroundSize: "16px 12px",
        backgroundPosition: "0 0",
        backgroundColor: "#e8e3d8",
        flexShrink: 0,
      }} />

      {/* Header */}
      <div style={{
        background: "#1a1a1a",
        color: "#f5f0e8",
        padding: "20px 24px 16px",
        borderBottom: "3px double #f5f0e8",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ textAlign: "center", borderBottom: "1px dashed #444", paddingBottom: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#666", marginBottom: 4 }}>★ ★ ★</div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 6, textTransform: "uppercase" }}>
            ROW ADDER
          </div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#555", marginTop: 2 }}>
            CALC TERMINAL v1.0
          </div>
        </div>

        {/* Total display */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#666", marginBottom: 6 }}>
            ─── SUBTOTAL ───
          </div>
          <div style={{
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: 2,
            color: isNeg ? "#e05c5c" : "#5db85d",
            transformOrigin: "center",
            transition: "transform 0.15s cubic-bezier(.34,1.56,.64,1), color 0.3s",
            transform: flashTotal ? "scale(1.04)" : "scale(1)",
          }}>
            {isNeg ? "−" : "+"}{fmt(Math.abs(subtotal))}
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 130px 96px",
        background: "#e8e3d8",
        borderBottom: "1px solid #ccc8be",
        padding: "5px 24px",
      }}>
        {["DESCRIPTION", "AMOUNT", "±"].map((h, i) => (
          <div key={h} style={{
            fontSize: 7,
            letterSpacing: 2.5,
            color: "#888",
            textAlign: i === 2 ? "center" : i === 1 ? "right" : "left",
            paddingRight: i === 1 ? 10 : 0,
          }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1, background: "#f5f0e8" }}>
        {rows.length === 0 && (
          <div style={{
            padding: "48px 24px",
            textAlign: "center",
            color: "#bbb",
            fontSize: 9,
            letterSpacing: 3,
          }}>
            · · · NO ITEMS · · ·
          </div>
        )}
        {rows.map((r, i) => {
          const isRowNeg = r.neg;
          const isNew = r.id === newRowId;
          return (
            <div key={r.id} style={{
              display: "grid",
              gridTemplateColumns: "1fr 130px 96px",
              borderBottom: "1px dashed #ddd8ce",
              background: i % 2 === 0 ? "#f5f0e8" : "#f0ebe2",
              alignItems: "center",
              minHeight: 44,
              opacity: isNew ? 0 : 1,
              transform: isNew ? "translateY(-6px)" : "translateY(0)",
              transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(.34,1.56,.64,1)",
            }}>
              {/* Note */}
              <div style={{ padding: "0 24px" }}>
                <input
                  type="text"
                  value={r.note}
                  placeholder={`item ${i + 1}...`}
                  onChange={e => updateRow(r.id, "note", e.target.value)}
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    color: "#1a1a1a", fontFamily: "inherit", fontSize: 13,
                    width: "100%", caretColor: "#1a1a1a",
                    letterSpacing: 0.5,
                  }}
                />
              </div>

              {/* Amount */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "flex-end",
                paddingRight: 10, gap: 2,
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 900,
                  color: isRowNeg ? "#c0392b" : "#27812b",
                  minWidth: 10,
                }}>
                  {isRowNeg ? "−" : "+"}
                </span>
                <input
                  type="number"
                  value={r.value}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  onChange={e => updateRow(r.id, "value", e.target.value)}
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    color: isRowNeg ? "#c0392b" : "#27812b",
                    fontFamily: "inherit", fontSize: 15, fontWeight: 900,
                    width: 86, textAlign: "right", caretColor: "#1a1a1a",
                    letterSpacing: 0.5,
                  }}
                />
              </div>

              {/* Controls */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, padding: "0 8px" }}>
                <button
                  onClick={() => toggleSign(r.id, false)}
                  style={{
                    width: 26, height: 26,
                    border: `1.5px solid ${!isRowNeg ? "#27812b" : "#ccc"}`,
                    background: !isRowNeg ? "#d4f0d4" : "transparent",
                    color: !isRowNeg ? "#27812b" : "#bbb",
                    fontFamily: "inherit", fontSize: 16, fontWeight: 900,
                    cursor: "pointer", borderRadius: 3,
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}
                >+</button>
                <button
                  onClick={() => toggleSign(r.id, true)}
                  style={{
                    width: 26, height: 26,
                    border: `1.5px solid ${isRowNeg ? "#c0392b" : "#ccc"}`,
                    background: isRowNeg ? "#f8d7d7" : "transparent",
                    color: isRowNeg ? "#c0392b" : "#bbb",
                    fontFamily: "inherit", fontSize: 16, fontWeight: 900,
                    cursor: "pointer", borderRadius: 3,
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}
                >−</button>
                <button
                  onClick={() => deleteRow(r.id)}
                  style={{
                    width: 26, height: 26,
                    border: "1.5px solid #ddd",
                    background: "transparent", color: "#ccc",
                    fontFamily: "inherit", fontSize: 10,
                    cursor: "pointer", borderRadius: 3,
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#c0392b"; e.currentTarget.style.color = "#c0392b"; e.currentTarget.style.background = "#f8d7d7"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd"; e.currentTarget.style.color = "#ccc"; e.currentTarget.style.background = "transparent"; }}
                >✕</button>
              </div>
            </div>
          );
        })}

        {/* Running breakdown */}
        {rows.filter(r => parseFloat(r.value)).length > 0 && (
          <div style={{
            padding: "12px 24px 16px",
            borderTop: "2px dashed #ccc8be",
            background: "#ede8de",
          }}>
            <div style={{ fontSize: 7, letterSpacing: 3, color: "#aaa", marginBottom: 8, textAlign: "center" }}>
              ─── BREAKDOWN ───
            </div>
            {rows.map(r => {
              const v = parseFloat(r.value) || 0;
              if (!v) return null;
              return (
                <div key={r.id} style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 10, letterSpacing: 0.5, color: "#888", marginBottom: 3,
                }}>
                  <span style={{ maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.note || "item"}
                  </span>
                  <span style={{ color: r.neg ? "#c0392b" : "#27812b", fontWeight: 700 }}>
                    {r.neg ? "−" : "+"}{fmt(Math.abs(v))}
                  </span>
                </div>
              );
            })}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 12, letterSpacing: 1,
              borderTop: "1px solid #ccc", marginTop: 8, paddingTop: 8,
              color: isNeg ? "#c0392b" : "#27812b", fontWeight: 900,
            }}>
              <span>TOTAL</span>
              <span>{isNeg ? "−" : "+"}{fmt(Math.abs(subtotal))}</span>
            </div>
          </div>
        )}

        {/* Receipt bottom fade */}
        <div style={{ height: 24, background: "linear-gradient(to bottom, #f5f0e8, #ede8de)" }} />
      </div>

      {/* Bottom toolbar */}
      <div style={{
        display: "flex",
        borderTop: "2px solid #1a1a1a",
        background: "#1a1a1a",
        position: "sticky",
        bottom: 0,
      }}>
        {[
          { label: "CLEAR", action: clearAll, danger: true },
          { label: "+ ROW", action: addRow, accent: true },
          { label: "SAVE", action: saveData },
          { label: "LOAD", action: loadData },
        ].map((btn, i) => (
          <button
            key={btn.label}
            onClick={btn.action}
            style={{
              flex: btn.accent ? 1.5 : 1,
              padding: "14px 4px",
              background: btn.accent ? "#f5f0e8" : "transparent",
              color: btn.danger ? "#e05c5c" : btn.accent ? "#1a1a1a" : "#555",
              border: "none",
              borderRight: i < 3 ? "1px solid #2e2e2e" : "none",
              fontFamily: "inherit",
              fontSize: 9,
              letterSpacing: 2.5,
              cursor: "pointer",
              textTransform: "uppercase",
              fontWeight: btn.accent ? 900 : 400,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              if (btn.accent) { e.currentTarget.style.background = "#fff"; }
              else { e.currentTarget.style.background = "#2e2e2e"; e.currentTarget.style.color = btn.danger ? "#e07070" : "#f5f0e8"; }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = btn.accent ? "#f5f0e8" : "transparent";
              e.currentTarget.style.color = btn.danger ? "#e05c5c" : btn.accent ? "#1a1a1a" : "#555";
            }}
          >{btn.label}</button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 70, left: "50%", transform: "translateX(-50%)",
          background: "#1a1a1a", color: "#f5f0e8",
          padding: "8px 22px", fontSize: 9, letterSpacing: 3,
          fontFamily: "inherit", fontWeight: 700, zIndex: 200,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          border: "1px solid #444",
        }}>
          {toast.toUpperCase()}
        </div>
      )}
    </div>
  );
}
