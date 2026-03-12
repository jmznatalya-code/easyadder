import { useState } from "react";

const initialRows = [
  { id: 1, note: "", value: "", neg: false },
  { id: 2, note: "", value: "", neg: false },
  { id: 3, note: "", value: "", neg: false },
];

let nextId = 4;

function fmt(n) {
  return Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RowAdder() {
  const [rows, setRows] = useState(initialRows);
  const [toast, setToast] = useState(null);
  const [saved, setSaved] = useState(null);

  const subtotal = rows.reduce((acc, r) => {
    const v = parseFloat(r.value) || 0;
    return acc + (r.neg ? -Math.abs(v) : Math.abs(v));
  }, 0);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const addRow = () => {
    const id = nextId++;
    setRows(prev => [...prev, { id, note: "", value: "", neg: false }]);
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
    showToast("Saved");
  };

  const loadData = () => {
    if (!saved) { showToast("Nothing saved"); return; }
    try { setRows(JSON.parse(saved)); showToast("Loaded"); }
    catch { showToast("Load error"); }
  };

  const exportPDF = () => window.print();

  const isNeg = subtotal < 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff",
      fontFamily: "'Courier New', 'Lucida Console', monospace",
      color: "#111",
      display: "flex",
      flexDirection: "column",
      maxWidth: 560,
      margin: "0 auto",
      border: "1px solid #ccc",
    }}>

      {/* Header */}
      <div style={{
        background: "#111",
        color: "#fff",
        padding: "16px 20px 14px",
        borderBottom: "2px solid #111",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ textAlign: "center", borderBottom: "1px dashed #555", paddingBottom: 10, marginBottom: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 6, textTransform: "uppercase" }}>
            ROW ADDER
          </div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#aaa", marginTop: 2 }}>
            CALC TERMINAL v1.0
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 8, letterSpacing: 3, color: "#888", marginBottom: 4 }}>
            ─── SUBTOTAL ───
          </div>
          <div style={{
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 2,
            color: "#fff",
          }}>
            {isNeg ? "−" : "+"}{fmt(Math.abs(subtotal))}
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 90px",
        background: "#e0e0e0",
        borderBottom: "1px solid #aaa",
        padding: "5px 20px",
      }}>
        {["DESCRIPTION", "AMOUNT", "±"].map((h, i) => (
          <div key={h} style={{
            fontSize: 7,
            letterSpacing: 2.5,
            color: "#555",
            textAlign: i === 2 ? "center" : i === 1 ? "right" : "left",
            paddingRight: i === 1 ? 8 : 0,
          }}>{h}</div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ flex: 1, background: "#fff" }}>
        {rows.length === 0 && (
          <div style={{
            padding: "48px 20px",
            textAlign: "center",
            color: "#aaa",
            fontSize: 9,
            letterSpacing: 3,
          }}>
            · · · NO ITEMS · · ·
          </div>
        )}
        {rows.map((r, i) => (
          <div key={r.id} style={{
            display: "grid",
            gridTemplateColumns: "1fr 120px 90px",
            borderBottom: "1px solid #ddd",
            background: i % 2 === 0 ? "#fff" : "#f5f5f5",
            alignItems: "center",
            minHeight: 44,
          }}>
            {/* Note */}
            <div style={{ padding: "0 20px" }}>
              <input
                type="text"
                value={r.note}
                placeholder={`item ${i + 1}...`}
                onChange={e => updateRow(r.id, "note", e.target.value)}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: "#111", fontFamily: "inherit", fontSize: 13,
                  width: "100%", caretColor: "#111",
                }}
              />
            </div>

            {/* Amount */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: 8, gap: 2,
            }}>
              <span style={{ fontSize: 10, fontWeight: 900, color: "#333", minWidth: 10 }}>
                {r.neg ? "−" : "+"}
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
                  color: r.neg ? "#555" : "#111",
                  fontFamily: "inherit", fontSize: 15, fontWeight: 900,
                  width: 80, textAlign: "right", caretColor: "#111",
                }}
              />
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, padding: "0 6px" }}>
              <button
                onClick={() => toggleSign(r.id, false)}
                style={{
                  width: 26, height: 26,
                  border: `1.5px solid ${!r.neg ? "#111" : "#ccc"}`,
                  background: !r.neg ? "#111" : "#fff",
                  color: !r.neg ? "#fff" : "#bbb",
                  fontFamily: "inherit", fontSize: 16, fontWeight: 900,
                  cursor: "pointer", borderRadius: 2,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  lineHeight: 1,
                }}
              >+</button>
              <button
                onClick={() => toggleSign(r.id, true)}
                style={{
                  width: 26, height: 26,
                  border: `1.5px solid ${r.neg ? "#111" : "#ccc"}`,
                  background: r.neg ? "#555" : "#fff",
                  color: r.neg ? "#fff" : "#bbb",
                  fontFamily: "inherit", fontSize: 16, fontWeight: 900,
                  cursor: "pointer", borderRadius: 2,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  lineHeight: 1,
                }}
              >−</button>
              <button
                onClick={() => deleteRow(r.id)}
                style={{
                  width: 26, height: 26,
                  border: "1.5px solid #ccc",
                  background: "#fff", color: "#aaa",
                  fontFamily: "inherit", fontSize: 10,
                  cursor: "pointer", borderRadius: 2,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >✕</button>
            </div>
          </div>
        ))}

        {/* Breakdown */}
        {rows.filter(r => parseFloat(r.value)).length > 0 && (
          <div style={{
            padding: "12px 20px 16px",
            borderTop: "2px dashed #aaa",
            background: "#f0f0f0",
          }}>
            <div style={{ fontSize: 7, letterSpacing: 3, color: "#888", marginBottom: 8, textAlign: "center" }}>
              ─── BREAKDOWN ───
            </div>
            {rows.map(r => {
              const v = parseFloat(r.value) || 0;
              if (!v) return null;
              return (
                <div key={r.id} style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 10, color: "#555", marginBottom: 3,
                }}>
                  <span style={{ maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.note || "item"}
                  </span>
                  <span style={{ color: r.neg ? "#555" : "#111", fontWeight: 700 }}>
                    {r.neg ? "−" : "+"}{fmt(Math.abs(v))}
                  </span>
                </div>
              );
            })}
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 13, letterSpacing: 1,
              borderTop: "1px solid #aaa", marginTop: 8, paddingTop: 8,
              color: "#111", fontWeight: 900,
            }}>
              <span>TOTAL</span>
              <span>{isNeg ? "−" : "+"}{fmt(Math.abs(subtotal))}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="no-print" style={{
        display: "flex",
        borderTop: "2px solid #111",
        background: "#111",
        position: "sticky",
        bottom: 0,
      }}>
        {[
          { label: "CLEAR", action: clearAll },
          { label: "+ ROW", action: addRow, accent: true },
          { label: "SAVE", action: saveData },
          { label: "LOAD", action: loadData },
          { label: "PDF", action: exportPDF },
        ].map((btn, i, arr) => (
          <button
            key={btn.label}
            onClick={btn.action}
            style={{
              flex: btn.accent ? 1.5 : 1,
              padding: "14px 4px",
              background: btn.accent ? "#fff" : "transparent",
              color: btn.accent ? "#111" : "#aaa",
              border: "none",
              borderRight: i < arr.length - 1 ? "1px solid #333" : "none",
              fontFamily: "inherit",
              fontSize: 9,
              letterSpacing: 2,
              cursor: "pointer",
              textTransform: "uppercase",
              fontWeight: btn.accent ? 900 : 400,
            }}
          >{btn.label}</button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 70, left: "50%", transform: "translateX(-50%)",
          background: "#111", color: "#fff",
          padding: "8px 20px", fontSize: 9, letterSpacing: 3,
          fontFamily: "inherit", fontWeight: 700, zIndex: 200,
          border: "1px solid #555",
        }}>
          {toast.toUpperCase()}
        </div>
      )}
    </div>
  );
}
