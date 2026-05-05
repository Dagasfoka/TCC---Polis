import { useEffect, useState } from "react";

import BrazilMapSvg from "./components/BrazilMapSvg.jsx";

const MATCHES_URL = "http://127.0.0.1:8000/matches";

export default function MatchMapTest() {
  const [matchState, setMatchState] = useState(null);
  const [selectedTerritory, setSelectedTerritory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function createMatch() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(MATCHES_URL, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`Erro ao criar partida: ${response.status}`);
        }

        const data = await response.json();
        setMatchState(data);
      } catch (err) {
        setError(err.message || "Erro inesperado ao criar partida.");
      } finally {
        setLoading(false);
      }
    }

    createMatch();
  }, []);

  if (loading) {
    return <main style={styles.page}>Carregando partida...</main>;
  }

  if (error) {
    return (
      <main style={styles.page}>
        <h1>Teste do mapa</h1>
        <p style={styles.error}>{error}</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Teste do mapa</h1>

      <section style={styles.layout}>
        <div style={styles.mapArea}>
          <BrazilMapSvg
            territories={matchState.territories}
            selectedTerritoryId={selectedTerritory?.territory_id}
            onSelectTerritory={setSelectedTerritory}
          />
        </div>

        <aside style={styles.panel}>
          <h2>Partida #{matchState.match_id}</h2>

          {selectedTerritory ? (
            <>
              <Info label="Nome" value={selectedTerritory.name} />
              <Info label="ID" value={selectedTerritory.territory_id} />
              <Info label="Região" value={selectedTerritory.region} />
              <Info label="Influência base" value={selectedTerritory.base_influence} />
              <Info label="Influência atual" value={selectedTerritory.current_influence} />
              <Info label="Dono" value={selectedTerritory.owner_id ?? "nenhum"} />
            </>
          ) : (
            <p>Clique em um território no mapa.</p>
          )}
        </aside>
      </section>
    </main>
  );
}

function Info({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong> {String(value)}
    </p>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: "#f7f3ed",
    color: "#211c18",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginTop: 0,
  },
  layout: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  mapArea: {
    width: "760px",
    maxWidth: "100%",
    border: "1px solid #ccc",
    background: "#fff",
  },
  panel: {
    width: "300px",
    padding: "16px",
    border: "1px solid #d8cfc2",
    borderRadius: "8px",
    background: "#fffaf4",
  },
  error: {
    padding: "12px",
    border: "1px solid #d07060",
    borderRadius: "8px",
    background: "#fff1ee",
    color: "#8a2f24",
  },
};