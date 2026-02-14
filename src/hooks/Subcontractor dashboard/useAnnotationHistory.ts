import { useState, useCallback, useRef } from "react";
import { PlanAnnotation, CreateAnnotationInput } from "@/hooks/Subcontractor dashboard/useAnnotations";

export type HistoryAction = 
  | { type: "create"; annotation: PlanAnnotation }
  | { type: "delete"; annotation: PlanAnnotation }
  | { type: "update"; before: PlanAnnotation; after: PlanAnnotation };

export interface HistoryEntry {
  action: HistoryAction;
  timestamp: number;
  description: string;
}

interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
}

export interface UseAnnotationHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  undoCount: number;
  redoCount: number;
  pastEntries: HistoryEntry[];
  futureEntries: HistoryEntry[];
  recordCreate: (annotation: PlanAnnotation) => void;
  recordDelete: (annotation: PlanAnnotation) => void;
  recordUpdate: (before: PlanAnnotation, after: PlanAnnotation) => void;
  undo: () => HistoryAction | null;
  redo: () => HistoryAction | null;
  undoToIndex: (index: number) => HistoryAction[];
  redoToIndex: (index: number) => HistoryAction[];
  clearHistory: () => void;
}

const MAX_HISTORY_SIZE = 50;

function getActionDescription(action: HistoryAction): string {
  const typeLabels: Record<string, string> = {
    line: "Line",
    arrow: "Arrow",
    rectangle: "Rectangle",
    text: "Text",
    freehand: "Freehand",
    measure_distance: "Distance measurement",
    measure_area: "Area measurement",
  };

  switch (action.type) {
    case "create": {
      const label = typeLabels[action.annotation.annotation_type] || action.annotation.annotation_type;
      return `Draw ${label}`;
    }
    case "delete": {
      const label = typeLabels[action.annotation.annotation_type] || action.annotation.annotation_type;
      return `Delete ${label}`;
    }
    case "update": {
      const label = typeLabels[action.after.annotation_type] || action.after.annotation_type;
      return `Edit ${label}`;
    }
  }
}

export function useAnnotationHistory(): UseAnnotationHistoryReturn {
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  
  // Use ref to avoid stale closures in callbacks
  const historyRef = useRef(history);
  historyRef.current = history;

  const createEntry = (action: HistoryAction): HistoryEntry => ({
    action,
    timestamp: Date.now(),
    description: getActionDescription(action),
  });

  const recordCreate = useCallback((annotation: PlanAnnotation) => {
    const entry = createEntry({ type: "create", annotation });
    setHistory((prev) => ({
      past: [...prev.past.slice(-MAX_HISTORY_SIZE + 1), entry],
      future: [], // Clear redo stack on new action
    }));
  }, []);

  const recordDelete = useCallback((annotation: PlanAnnotation) => {
    const entry = createEntry({ type: "delete", annotation });
    setHistory((prev) => ({
      past: [...prev.past.slice(-MAX_HISTORY_SIZE + 1), entry],
      future: [],
    }));
  }, []);

  const recordUpdate = useCallback((before: PlanAnnotation, after: PlanAnnotation) => {
    const entry = createEntry({ type: "update", before, after });
    setHistory((prev) => ({
      past: [...prev.past.slice(-MAX_HISTORY_SIZE + 1), entry],
      future: [],
    }));
  }, []);

  const undo = useCallback((): HistoryAction | null => {
    const current = historyRef.current;
    if (current.past.length === 0) return null;

    const entry = current.past[current.past.length - 1];
    setHistory({
      past: current.past.slice(0, -1),
      future: [entry, ...current.future],
    });

    return entry.action;
  }, []);

  const redo = useCallback((): HistoryAction | null => {
    const current = historyRef.current;
    if (current.future.length === 0) return null;

    const entry = current.future[0];
    setHistory({
      past: [...current.past, entry],
      future: current.future.slice(1),
    });

    return entry.action;
  }, []);

  // Undo multiple actions to reach a specific index in the past
  const undoToIndex = useCallback((targetIndex: number): HistoryAction[] => {
    const current = historyRef.current;
    const actionsToUndo: HistoryAction[] = [];
    
    // Undo from the end of past down to targetIndex + 1
    for (let i = current.past.length - 1; i > targetIndex; i--) {
      actionsToUndo.push(current.past[i].action);
    }

    if (actionsToUndo.length > 0) {
      const entriesToMove = current.past.slice(targetIndex + 1);
      setHistory({
        past: current.past.slice(0, targetIndex + 1),
        future: [...entriesToMove.reverse(), ...current.future],
      });
    }

    return actionsToUndo;
  }, []);

  // Redo multiple actions to reach a specific index in the future
  const redoToIndex = useCallback((targetIndex: number): HistoryAction[] => {
    const current = historyRef.current;
    const actionsToRedo: HistoryAction[] = [];
    
    // Redo from the start of future up to targetIndex
    for (let i = 0; i <= targetIndex; i++) {
      actionsToRedo.push(current.future[i].action);
    }

    if (actionsToRedo.length > 0) {
      const entriesToMove = current.future.slice(0, targetIndex + 1);
      setHistory({
        past: [...current.past, ...entriesToMove],
        future: current.future.slice(targetIndex + 1),
      });
    }

    return actionsToRedo;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory({ past: [], future: [] });
  }, []);

  return {
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    undoCount: history.past.length,
    redoCount: history.future.length,
    pastEntries: history.past,
    futureEntries: history.future,
    recordCreate,
    recordDelete,
    recordUpdate,
    undo,
    redo,
    undoToIndex,
    redoToIndex,
    clearHistory,
  };
}
