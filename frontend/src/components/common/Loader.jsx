const Loader = ({ size = 40 }) => (
  <div style={{
    display:        "flex",
    justifyContent: "center",
    alignItems:     "center",
    padding:        "60px",
  }}>
    <div style={{
      width:        `${size}px`,
      height:       `${size}px`,
      border:       "3px solid var(--border)",
      borderTop:    "3px solid var(--accent)",
      borderRadius: "50%",
      animation:    "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Loader;