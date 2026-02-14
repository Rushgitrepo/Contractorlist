import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Subcontractor dashboard/ui/card";
import { Badge } from "@/components/Subcontractor dashboard/ui/badge";
import { Separator } from "@/components/Subcontractor dashboard/ui/separator";
import { ScrollArea } from "@/components/Subcontractor dashboard/ui/scroll-area";
import { Ruler, Square, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/Subcontractor dashboard/ui/collapsible";
import { PlanAnnotation } from "@/hooks/Subcontractor dashboard/useAnnotations";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MeasurementLegendProps {
  annotations: PlanAnnotation[];
  onClose: () => void;
}

interface MeasurementSummary {
  type: "distance" | "area";
  layer: string;
  color: string;
  count: number;
  totalValue: number;
  unit: string;
  items: {
    id: string;
    value: number;
    unit: string;
  }[];
}

export default function MeasurementLegend({ annotations, onClose }: MeasurementLegendProps) {
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(["default"]));

  const measurementData = useMemo(() => {
    // Filter only measurement annotations with values
    const measurements = annotations.filter(
      (a) =>
        (a.annotation_type === "measure_distance" || a.annotation_type === "measure_area") &&
        a.measurement_value !== null
    );

    // Group by layer and type
    const grouped = new Map<string, MeasurementSummary>();

    measurements.forEach((annotation) => {
      const type = annotation.annotation_type === "measure_distance" ? "distance" : "area";
      const key = `${annotation.layer}-${type}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          type,
          layer: annotation.layer,
          color: annotation.color,
          count: 0,
          totalValue: 0,
          unit: annotation.measurement_unit || (type === "distance" ? "ft" : "ft²"),
          items: [],
        });
      }

      const summary = grouped.get(key)!;
      summary.count++;
      summary.totalValue += annotation.measurement_value!;
      summary.items.push({
        id: annotation.id,
        value: annotation.measurement_value!,
        unit: annotation.measurement_unit || summary.unit,
      });
    });

    return Array.from(grouped.values());
  }, [annotations]);

  // Calculate overall totals
  const totals = useMemo(() => {
    const distances = measurementData.filter((m) => m.type === "distance");
    const areas = measurementData.filter((m) => m.type === "area");

    const totalDistance = distances.reduce((sum, m) => sum + m.totalValue, 0);
    const totalArea = areas.reduce((sum, m) => sum + m.totalValue, 0);
    const distanceUnit = distances[0]?.unit || "ft";
    const areaUnit = areas[0]?.unit || "ft²";

    return {
      distances: { total: totalDistance, count: distances.reduce((s, m) => s + m.count, 0), unit: distanceUnit },
      areas: { total: totalArea, count: areas.reduce((s, m) => s + m.count, 0), unit: areaUnit },
    };
  }, [measurementData]);

  // Group by layer for display
  const layerGroups = useMemo(() => {
    const groups = new Map<string, MeasurementSummary[]>();

    measurementData.forEach((summary) => {
      if (!groups.has(summary.layer)) {
        groups.set(summary.layer, []);
      }
      groups.get(summary.layer)!.push(summary);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => {
      if (a === "default") return -1;
      if (b === "default") return 1;
      return a.localeCompare(b);
    });
  }, [measurementData]);

  const toggleLayer = (layer: string) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  };

  const hasMeasurements = measurementData.length > 0;

  return (
    <Card className="absolute right-4 top-16 w-72 z-20 shadow-lg bg-background/95 backdrop-blur">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          Measurement Summary
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="p-0">
        {!hasMeasurements ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No measurements on this plan.
            <br />
            <span className="text-xs">Use the Distance or Area tools to add measurements.</span>
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            {/* Grand Totals */}
            <div className="p-3 bg-muted/50 border-b">
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Totals
              </div>
              <div className="grid grid-cols-2 gap-3">
                {totals.distances.count > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30">
                      <Ruler className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {totals.distances.total.toFixed(2)} {totals.distances.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {totals.distances.count} line{totals.distances.count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                )}
                {totals.areas.count > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-green-100 dark:bg-green-900/30">
                      <Square className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">
                        {totals.areas.total.toFixed(2)} {totals.areas.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {totals.areas.count} area{totals.areas.count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Layer Breakdown */}
            <div className="p-2">
              {layerGroups.map(([layer, summaries]) => (
                <Collapsible
                  key={layer}
                  open={expandedLayers.has(layer)}
                  onOpenChange={() => toggleLayer(layer)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between px-2 py-1.5 h-auto text-sm font-medium hover:bg-muted"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: summaries[0]?.color || "#6b7280" }}
                        />
                        <span className="capitalize">{layer === "default" ? "Default Layer" : layer}</span>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5">
                          {summaries.reduce((s, m) => s + m.count, 0)}
                        </Badge>
                      </div>
                      {expandedLayers.has(layer) ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-5 pr-2 py-1 space-y-1.5">
                      {summaries.map((summary) => (
                        <div
                          key={`${summary.layer}-${summary.type}`}
                          className="flex items-center justify-between text-sm py-1 px-2 rounded bg-muted/40"
                        >
                          <div className="flex items-center gap-2">
                            {summary.type === "distance" ? (
                              <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                            ) : (
                              <Square className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <span className="text-muted-foreground capitalize">{summary.type}</span>
                          </div>
                          <div className="font-medium">
                            {summary.totalValue.toFixed(2)} {summary.unit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
