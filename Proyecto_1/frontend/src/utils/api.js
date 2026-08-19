import cases from "../assets/mocks/cases.json";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    let detail = "Error de comunicación con el servidor";
    try { detail = (await response.json()).error || detail; } catch (_) { /* noop */ }
    throw new Error(detail);
  }
  return response.json();
}

export async function getCases() {
  try { return await request("/cases"); }
  catch (_) { await delay(150); return cases; }
}

export async function getCaseById(id) {
  try { return await request(`/cases/${id}`); }
  catch (_) {
    await delay(100);
    const c = cases.find((item) => item.id === id);
    if (!c) throw new Error("Case not found");
    return c;
  }
}

export async function getSuspects(caseId) {
  const c = await getCaseById(caseId);
  return c.suspects;
}

export async function getEvidence(caseId) {
  const c = await getCaseById(caseId);
  return c.evidence;
}

export async function getPlaces(caseId) {
  const c = await getCaseById(caseId);
  return c.places;
}

export async function getTimeline(caseId) {
  const c = await getCaseById(caseId);
  return c.timeline;
}

export async function getContradictions(caseId) {
  const c = await getCaseById(caseId);
  return c.contradictions;
}

export async function getAlibis(caseId) { return request(`/cases/${caseId}/alibis`); }
export async function getWitnesses(caseId) { return request(`/cases/${caseId}/witnesses`); }
export async function getCameras(caseId) { return request(`/cases/${caseId}/cameras`); }
export async function getAccessRecords(caseId) { return request(`/cases/${caseId}/access`); }
export async function getTestimonies(caseId) { return request(`/cases/${caseId}/testimonies`); }
export async function getClues(caseId) { return request(`/cases/${caseId}/clues`); }

export async function getHint(caseId) {
  const clues = await getClues(caseId);
  if (!clues.length) return "Revisa las coartadas y compáralas con los registros de acceso.";
  const clue = clues[Math.floor(Math.random() * clues.length)];
  return `Pista: revisa el evento de las ${clue.time}: ${clue.clue}`;
}

export async function interrogate(caseId, suspectId) {
  const testimonies = await getTestimonies(caseId);
  const mine = testimonies.filter((t) => t.suspectId === suspectId);
  return {
    suspect: mine[0]?.suspectName || suspectId,
    response: mine.map((t) => t.statement),
  };
}

export async function accuse(caseId, suspectId) {
  return request(`/cases/${caseId}/accuse`, {
    method: "POST",
    body: JSON.stringify({ suspectId }),
  });
}

export async function getExplanation(caseId, suspectId) {
  return request(`/cases/${caseId}/explanation/${suspectId}`);
}

export async function registerAction(caseId, action) {
  try {
    return await request("/log", {
      method: "POST",
      body: JSON.stringify({ caseId, action }),
    });
  } catch (_) {
    return { ok: false, timestamp: new Date().toISOString() };
  }
}

export async function getInvestigationLog(caseId) {
  try { return await request(`/log/${caseId}`); }
  catch (_) { return []; }
}
