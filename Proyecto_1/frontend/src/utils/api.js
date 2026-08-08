import cases from "../assets/mocks/cases.json";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function getCases() {
  await delay(300);
  return cases;
}

export async function getCaseById(id) {
  await delay(200);
  const c = cases.find((c) => c.id === id);
  if (!c) throw new Error("Case not found");
  return c;
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

export async function getHint(caseId) {
  await delay(400);
  const hints = [
    "Busca contradicciones entre las declaraciones y las evidencias fisicas.",
    "El registro del ascensor revela movimientos que algunos niegan.",
    "Las coartadas invalidas son la clave. Verifica quien miente.",
    "Examina las motivaciones economicas de cada sospechoso.",
    "Busca quien tenia los medios tecnicos para cometer el crimen.",
  ];
  return hints[Math.floor(Math.random() * hints.length)];
}

export async function interrogate(caseId, suspectId) {
  await delay(500);
  const c = await getCaseById(caseId);
  const suspect = c.suspects.find((s) => s.id === suspectId);
  if (!suspect) throw new Error("Suspect not found");
  const randomStatement =
    suspect.statements[Math.floor(Math.random() * suspect.statements.length)];
  return { suspect: suspect.name, response: randomStatement };
}

export async function accuse(caseId, suspectId) {
  await delay(600);
  const c = await getCaseById(caseId);
  const correct = c.culprit === suspectId;
  const culprit = c.suspects.find((s) => s.id === c.culprit);
  return {
    correct,
    culprit: culprit.name,
    message: correct
      ? "Felicitaciones. Has resuelto el caso correctamente."
      : `Incorrecto. El verdadero culpable era ${culprit.name}.`,
    explanation: c.rules,
  };
}

export async function getExplanation(caseId) {
  const c = await getCaseById(caseId);
  return c.rules;
}
