import { useState } from "react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/Subcontractor dashboard/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/Subcontractor dashboard/ui/tooltip";
import { History, Undo2, Redo2, Circle, Trash2 } from "lucide-react";
import { HistoryEntry } from "@/hooks/Subcontractor dashboard/useAnnotationHistory";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface HistoryDropdownProps {
  pastEntries: HistoryEntry[];
  futureEntries: HistoryEntry[];
  onUndoToIndex: (index: number) => void;
  onRedoToIndex: (index: number) => void;
  onClearHistory: () => void;
}

export default function HistoryDropdown({
  pastEntries,
  futureEntries,
  onUndoToIndex,
  onRedoToIndex,
  onClearHistory,
}: HistoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasHistory = pastEntries.length > 0 || futureEntries.length > 0;

  const getActionIcon = (type: string) => {
    switch (type) {
      case "create":
        return <Circle className="h-2 w-2 fill-primary text-primary" />;
      case "delete":
        return <Circle className="h-2 w-2 fill-destructive text-destructive" />;
      case "update":
        return <Circle className="h-2 w-2 fill-accent-foreground text-accent-foreground" />;
      default:
        return <Circle className="h-2 w-2" />;
    }
  };

  const formatTime = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  // Show last 10 past entries (reversed to show newest first) and first 5 future entries
  const displayPast = [...pastEntries].reverse().slice(0, 10);
  const displayFuture = futureEntries.slice(0, 5);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 relative"
              disabled={!hasHistory}
            >
              <History className="h-4 w-4" />
              {hasHistory && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[10px] font-medium bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  {pastEntries.length + futureEntries.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>History</TooltipContent>
      </Tooltip>

      <DropdownMenuContent 
        align="end" 
        className="w-64 max-h-80 overflow-y-auto z-50 bg-popover border shadow-lg"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Action History</span>
          {hasHistory && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                onClearHistory();
                setIsOpen(false);
              }}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Future entries (redo stack) */}
        {displayFuture.length > 0 && (
          <>
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Redo2 className="h-3 w-3" />
              Redo ({futureEntries.length})
            </div>
            {displayFuture.map((entry, index) => (
              <DropdownMenuItem
                key={`future-${index}`}
                className="flex items-center gap-2 cursor-pointer opacity-60 hover:opacity-100"
                onClick={() => {
                  onRedoToIndex(index);
                  setIsOpen(false);
                }}
              >
                {getActionIcon(entry.action.type)}
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{entry.description}</div>
                  <div className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</div>
                </div>
                <Redo2 className="h-3 w-3 text-muted-foreground" />
              </DropdownMenuItem>
            ))}
            {futureEntries.length > 5 && (
              <div className="px-2 py-1 text-xs text-muted-foreground text-center">
                +{futureEntries.length - 5} more
              </div>
            )}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Current state marker */}
        <div className="px-2 py-1.5 flex items-center gap-2 bg-muted/50">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs font-medium">Current State</span>
        </div>

        {/* Past entries (undo stack) */}
        {displayPast.length > 0 ? (
          <>
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Undo2 className="h-3 w-3" />
              Undo ({pastEntries.length})
            </div>
            {displayPast.map((entry, displayIndex) => {
              // Convert display index back to actual past array index
              const actualIndex = pastEntries.length - 1 - displayIndex;
              return (
                <DropdownMenuItem
                  key={`past-${actualIndex}`}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    displayIndex === 0 && "bg-accent/50"
                  )}
                  onClick={() => {
                    // Undo to the state before this action (actualIndex - 1)
                    onUndoToIndex(actualIndex - 1);
                    setIsOpen(false);
                  }}
                >
                  {getActionIcon(entry.action.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{entry.description}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</div>
                  </div>
                  <Undo2 className="h-3 w-3 text-muted-foreground" />
                </DropdownMenuItem>
              );
            })}
            {pastEntries.length > 10 && (
              <div className="px-2 py-1 text-xs text-muted-foreground text-center">
                +{pastEntries.length - 10} more
              </div>
            )}
          </>
        ) : (
          <div className="px-2 py-4 text-sm text-muted-foreground text-center">
            No history yet
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
