import { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Button } from "@/components/Subcontractor dashboard/ui/button";
import { Input } from "@/components/Subcontractor dashboard/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Subcontractor dashboard/ui/table";
import { BudgetItem, useBudgetMutations } from "@/hooks/Subcontractor dashboard/useBudget";
import { cn } from "@/lib/utils";

interface ScheduleOfValuesProps {
  projectId: string;
  items: BudgetItem[];
  isLoading: boolean;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function ScheduleOfValues({ projectId, items, isLoading }: ScheduleOfValuesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    item_number: "",
    description: "",
    scheduled_value: 0,
    retainage_percent: 10,
  });
  const [editValues, setEditValues] = useState<Partial<BudgetItem>>({});

  const { createBudgetItem, updateBudgetItem, deleteBudgetItem } = useBudgetMutations(projectId);

  const handleAdd = () => {
    if (!newItem.item_number || !newItem.description) return;
    
    createBudgetItem.mutate({
      project_id: projectId,
      item_number: newItem.item_number,
      description: newItem.description,
      scheduled_value: newItem.scheduled_value,
      work_completed_previous: 0,
      work_completed_current: 0,
      materials_stored: 0,
      retainage_percent: newItem.retainage_percent,
      sort_order: items.length,
    });
    
    setNewItem({ item_number: "", description: "", scheduled_value: 0, retainage_percent: 10 });
    setIsAdding(false);
  };

  const handleEdit = (item: BudgetItem) => {
    setEditingId(item.id);
    setEditValues({
      work_completed_current: item.work_completed_current,
      materials_stored: item.materials_stored,
    });
  };

  const handleSaveEdit = (id: string) => {
    updateBudgetItem.mutate({ id, ...editValues });
    setEditingId(null);
    setEditValues({});
  };

  const calculateTotals = () => {
    return items.reduce(
      (acc, item) => {
        const totalCompleted = item.work_completed_previous + item.work_completed_current + item.materials_stored;
        const retainage = totalCompleted * (item.retainage_percent / 100);
        const balance = item.scheduled_value - totalCompleted;
        
        return {
          scheduledValue: acc.scheduledValue + item.scheduled_value,
          previousWork: acc.previousWork + item.work_completed_previous,
          currentWork: acc.currentWork + item.work_completed_current,
          materialsStored: acc.materialsStored + item.materials_stored,
          totalCompleted: acc.totalCompleted + totalCompleted,
          retainage: acc.retainage + retainage,
          balance: acc.balance + balance,
        };
      },
      { scheduledValue: 0, previousWork: 0, currentWork: 0, materialsStored: 0, totalCompleted: 0, retainage: 0, balance: 0 }
    );
  };

  const totals = calculateTotals();

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">Loading schedule of values...</div>;
  }

  return (
    <div className="stat-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Schedule of Values (G703)</h2>
        <Button size="sm" onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-1" /> Add Item
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Item #</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Scheduled Value</TableHead>
              <TableHead className="text-right">Previous Work</TableHead>
              <TableHead className="text-right">This Period</TableHead>
              <TableHead className="text-right">Materials</TableHead>
              <TableHead className="text-right">Total Completed</TableHead>
              <TableHead className="text-right">%</TableHead>
              <TableHead className="text-right">Retainage</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && (
              <TableRow>
                <TableCell>
                  <Input
                    value={newItem.item_number}
                    onChange={(e) => setNewItem({ ...newItem, item_number: e.target.value })}
                    placeholder="001"
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Description"
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={newItem.scheduled_value}
                    onChange={(e) => setNewItem({ ...newItem, scheduled_value: parseFloat(e.target.value) || 0 })}
                    className="w-28 h-8 text-right"
                  />
                </TableCell>
                <TableCell colSpan={7} className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={handleAdd}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
            
            {items.map((item) => {
              const totalCompleted = item.work_completed_previous + item.work_completed_current + item.materials_stored;
              const percentComplete = item.scheduled_value > 0 ? (totalCompleted / item.scheduled_value) * 100 : 0;
              const retainage = totalCompleted * (item.retainage_percent / 100);
              const balance = item.scheduled_value - totalCompleted;
              const isEditing = editingId === item.id;

              return (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => !isEditing && handleEdit(item)}>
                  <TableCell className="font-mono text-xs">{item.item_number}</TableCell>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(item.scheduled_value)}</TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">{formatCurrency(item.work_completed_previous)}</TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.work_completed_current ?? item.work_completed_current}
                        onChange={(e) => setEditValues({ ...editValues, work_completed_current: parseFloat(e.target.value) || 0 })}
                        className="w-24 h-7 text-right"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="font-mono">{formatCurrency(item.work_completed_current)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.materials_stored ?? item.materials_stored}
                        onChange={(e) => setEditValues({ ...editValues, materials_stored: parseFloat(e.target.value) || 0 })}
                        className="w-24 h-7 text-right"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="font-mono">{formatCurrency(item.materials_stored)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">{formatCurrency(totalCompleted)}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "text-xs font-medium",
                      percentComplete >= 100 ? "text-success" : percentComplete >= 50 ? "text-info" : "text-muted-foreground"
                    )}>
                      {percentComplete.toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-warning">{formatCurrency(retainage)}</TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(balance)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end" onClick={(e) => e.stopPropagation()}>
                      {isEditing ? (
                        <>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingId(null)}>
                            <X className="w-3 h-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleSaveEdit(item.id)}>
                            <Save className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => deleteBudgetItem.mutate(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {items.length > 0 && (
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell colSpan={2}>TOTALS</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totals.scheduledValue)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totals.previousWork)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totals.currentWork)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totals.materialsStored)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totals.totalCompleted)}</TableCell>
                <TableCell className="text-right">
                  {totals.scheduledValue > 0 ? ((totals.totalCompleted / totals.scheduledValue) * 100).toFixed(0) : 0}%
                </TableCell>
                <TableCell className="text-right font-mono text-warning">{formatCurrency(totals.retainage)}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(totals.balance)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}

            {items.length === 0 && !isAdding && (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  No budget items yet. Click "Add Item" to create your schedule of values.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
