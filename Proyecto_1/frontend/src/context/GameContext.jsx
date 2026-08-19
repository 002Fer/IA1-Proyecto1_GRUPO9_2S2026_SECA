import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getCases } from "../utils/api.js";

const GameContext = createContext(null);

const initialState = {
  cases: [],
  selectedCase: null,
  log: [],
  suspicionData: {},
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CASES":
      return { ...state, cases: action.payload };
    case "SELECT_CASE":
      return { ...state, selectedCase: action.payload, log: [] };
    case "LOG_ACTION":
      return {
        ...state,
        log: [
          { id: Date.now(), timestamp: new Date().toLocaleTimeString(), text: action.payload },
          ...state.log,
        ],
      };
    case "SET_SUSPICION":
      return {
        ...state,
        suspicionData: { ...state.suspicionData, [action.suspectId]: action.level },
      };
    case "CLEAR_LOG":
      return { ...state, log: [] };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getCases().then((data) => dispatch({ type: "SET_CASES", payload: data })).catch(() => {});
  }, []);

  const logAction = (text) => dispatch({ type: "LOG_ACTION", payload: text });
  const selectCase = (c) => dispatch({ type: "SELECT_CASE", payload: c });
  const setSuspicion = (suspectId, level) =>
    dispatch({ type: "SET_SUSPICION", suspectId, level });

  return (
    <GameContext.Provider value={{ ...state, dispatch, logAction, selectCase, setSuspicion }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
