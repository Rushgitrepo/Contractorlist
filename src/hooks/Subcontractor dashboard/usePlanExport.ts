import { useState, useCallback, RefObject } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PlanPin, PIN_TYPES, PIN_STATUSES } from "@/hooks/Subcontractor dashboard/usePlans";
import { PlanAnnotation } from "@/hooks/Subcontractor dashboard/useAnnotations";
import { format } from "date-fns";
import { toast } from "sonner";

export interface ExportOptions {
  includeAnnotations?: boolean;
  includePins?: boolean;
  includeMeasurements?: boolean;
  includeSummary?: boolean;
  planName?: string;
  projectName?: string;
}

interface MeasurementSummary {
  type: "distance" | "area";
  value: number;
  unit: string;
}

export function usePlanExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = useCallback(
    async (
      contentRef: RefObject<HTMLDivElement>,
      options: ExportOptions = {},
      pins: PlanPin[] = [],
      annotations: PlanAnnotation[] = []
    ) => {
      if (!contentRef.current) {
        toast.error("Unable to export: Plan not loaded");
        return;
      }

      setIsExporting(true);
      
      try {
        const {
          includeAnnotations = true,
          includePins = true,
          includeMeasurements = true,
          includeSummary = true,
          planName = "Plan",
          projectName = "Project",
        } = options;

        // Capture the plan viewer as an image
        const canvas = await html2canvas(contentRef.current, {
          useCORS: true,
          allowTaint: true,
          scale: 2, // Higher quality
          backgroundColor: "#ffffff",
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        // Create PDF with proper dimensions
        const pdfWidth = 297; // A4 landscape width in mm
        const pdfHeight = 210; // A4 landscape height in mm
        const margin = 10;
        
        // Calculate image dimensions to fit in PDF
        const maxWidth = pdfWidth - 2 * margin;
        const maxHeight = pdfHeight - 2 * margin - (includeSummary ? 50 : 0);
        
        const scale = Math.min(maxWidth / (imgWidth / 2), maxHeight / (imgHeight / 2));
        const scaledWidth = (imgWidth / 2) * scale;
        const scaledHeight = (imgHeight / 2) * scale;

        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        // Add title header
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(planName, margin, margin + 5);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Project: ${projectName}`, margin, margin + 12);
        pdf.text(`Exported: ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`, margin, margin + 18);

        // Add the plan image
        const imageY = margin + 25;
        pdf.addImage(imgData, "PNG", margin, imageY, scaledWidth, scaledHeight);

        // Collect measurements if available
        const measurements: MeasurementSummary[] = [];
        if (includeMeasurements && annotations.length > 0) {
          annotations.forEach((annotation) => {
            if (
              annotation.annotation_type === "measure_distance" &&
              annotation.measurement_value !== null
            ) {
              measurements.push({
                type: "distance",
                value: annotation.measurement_value,
                unit: annotation.measurement_unit || "ft",
              });
            }
            if (
              annotation.annotation_type === "measure_area" &&
              annotation.measurement_value !== null
            ) {
              measurements.push({
                type: "area",
                value: annotation.measurement_value,
                unit: annotation.measurement_unit || "ft²",
              });
            }
          });
        }

        // Add summary page if requested
        if (includeSummary && (pins.length > 0 || measurements.length > 0 || annotations.length > 0)) {
          pdf.addPage();
          let yPos = margin + 5;

          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text("Plan Summary", margin, yPos);
          yPos += 10;

          // Annotation summary
          if (annotations.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text("Annotations", margin, yPos);
            yPos += 6;

            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            
            const annotationCounts: Record<string, number> = {};
            annotations.forEach((a) => {
              const type = a.annotation_type;
              annotationCounts[type] = (annotationCounts[type] || 0) + 1;
            });

            Object.entries(annotationCounts).forEach(([type, count]) => {
              const label = type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              pdf.text(`• ${label}: ${count}`, margin + 2, yPos);
              yPos += 4;
            });
            yPos += 4;
          }

          // Measurement summary
          if (measurements.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text("Measurements", margin, yPos);
            yPos += 6;

            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            
            const distances = measurements.filter((m) => m.type === "distance");
            const areas = measurements.filter((m) => m.type === "area");

            if (distances.length > 0) {
              pdf.text(`Total Distance Measurements: ${distances.length}`, margin + 2, yPos);
              yPos += 4;
              const totalDistance = distances.reduce((sum, m) => sum + m.value, 0);
              pdf.text(`Combined Length: ${totalDistance.toFixed(2)} ${distances[0].unit}`, margin + 2, yPos);
              yPos += 4;
            }

            if (areas.length > 0) {
              pdf.text(`Total Area Measurements: ${areas.length}`, margin + 2, yPos);
              yPos += 4;
              const totalArea = areas.reduce((sum, m) => sum + m.value, 0);
              pdf.text(`Combined Area: ${totalArea.toFixed(2)} ${areas[0].unit}`, margin + 2, yPos);
              yPos += 4;
            }
            yPos += 4;
          }

          // Pin summary
          if (pins.length > 0) {
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text("Pins", margin, yPos);
            yPos += 6;

            // Pin statistics
            pdf.setFontSize(9);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Total Pins: ${pins.length}`, margin + 2, yPos);
            yPos += 4;

            // Group by status
            const statusCounts: Record<string, number> = {};
            pins.forEach((pin) => {
              const status = pin.status || "open";
              statusCounts[status] = (statusCounts[status] || 0) + 1;
            });

            Object.entries(statusCounts).forEach(([status, count]) => {
              const statusLabel = PIN_STATUSES.find((s) => s.value === status)?.label || status;
              pdf.text(`• ${statusLabel}: ${count}`, margin + 2, yPos);
              yPos += 4;
            });
            yPos += 4;

            // Pin details table
            if (yPos < pdfHeight - 60) {
              pdf.setFontSize(11);
              pdf.setFont("helvetica", "bold");
              pdf.text("Pin Details", margin, yPos);
              yPos += 6;

              // Table headers
              pdf.setFontSize(8);
              pdf.setFont("helvetica", "bold");
              const colWidths = [80, 40, 40, 50, 60];
              const headers = ["Title", "Type", "Status", "Has RFI", "Created"];
              let xPos = margin;
              headers.forEach((header, i) => {
                pdf.text(header, xPos, yPos);
                xPos += colWidths[i];
              });
              yPos += 1;
              pdf.line(margin, yPos, pdfWidth - margin, yPos);
              yPos += 4;

              // Table rows
              pdf.setFont("helvetica", "normal");
              pins.slice(0, 20).forEach((pin) => {
                if (yPos > pdfHeight - 15) {
                  pdf.addPage();
                  yPos = margin + 5;
                }

                const pinType = PIN_TYPES.find((t) => t.value === pin.pin_type)?.label || "General";
                const pinStatus = PIN_STATUSES.find((s) => s.value === pin.status)?.label || "Open";
                const hasRfi = pin.rfi_id ? "Yes" : "No";
                const created = format(new Date(pin.created_at), "MMM d, yyyy");

                xPos = margin;
                // Truncate title if too long
                const title = pin.title.length > 40 ? pin.title.substring(0, 37) + "..." : pin.title;
                pdf.text(title, xPos, yPos);
                xPos += colWidths[0];
                pdf.text(pinType, xPos, yPos);
                xPos += colWidths[1];
                pdf.text(pinStatus, xPos, yPos);
                xPos += colWidths[2];
                pdf.text(hasRfi, xPos, yPos);
                xPos += colWidths[3];
                pdf.text(created, xPos, yPos);
                yPos += 5;
              });

              if (pins.length > 20) {
                yPos += 2;
                pdf.setFont("helvetica", "italic");
                pdf.text(`... and ${pins.length - 20} more pins`, margin, yPos);
              }
            }
          }
        }

        // Generate filename
        const filename = `${planName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${format(new Date(), "yyyy-MM-dd")}.pdf`;
        
        pdf.save(filename);
        toast.success("PDF exported successfully");
      } catch (error) {
        console.error("PDF export failed:", error);
        toast.error("Failed to export PDF");
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return {
    exportToPdf,
    isExporting,
  };
}
