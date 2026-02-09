
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FilterAccordionProps {
    title: string;
    icon?: React.ReactNode;
    defaultOpen?: boolean;
    count?: number;
    children: React.ReactNode;
}

const FilterAccordion = ({
    title,
    icon,
    defaultOpen = true,
    count,
    children,
}: FilterAccordionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border last:border-0 pb-4 mb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-semibold text-foreground hover:text-accent transition-colors group">
                <div className="flex items-center gap-2">
                    {icon}
                    {title}
                    {count !== undefined && count > 0 && (
                        <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs font-medium">
                            {count}
                        </Badge>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">{children}</CollapsibleContent>
        </Collapsible>
    );
};

export default FilterAccordion;
