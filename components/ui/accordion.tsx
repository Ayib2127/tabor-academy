import * as React from 'react';

// Context for managing open items
const AccordionContext = React.createContext<{
  openItems: string[];
  setOpenItems: (items: string[]) => void;
  type: 'single' | 'multiple';
} | null>(null);

interface AccordionProps extends React.PropsWithChildren<{}> {
  type?: 'single' | 'multiple';
  value?: string[];
  onValueChange?: (items: string[]) => void;
  className?: string;
}

export function Accordion({
  children,
  type = 'single',
  value,
  onValueChange,
  className = '',
}: AccordionProps) {
  const [internalOpen, setInternalOpen] = React.useState<string[]>(value || []);
  const openItems = value !== undefined ? value : internalOpen;
  const setOpenItems = (items: string[]) => {
    if (onValueChange) onValueChange(items);
    else setInternalOpen(items);
  };
  return (
    <AccordionContext.Provider value={{ openItems, setOpenItems, type }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps extends React.PropsWithChildren<{}> {
  value: string;
  className?: string;
}

export function AccordionItem({ value, children, className = '' }: AccordionItemProps) {
  return <div data-accordion-item="" data-value={value} className={className}>{children}</div>;
}

interface AccordionTriggerProps extends React.PropsWithChildren<{}> {
  className?: string;
}

export function AccordionTrigger({ children, className = '' }: AccordionTriggerProps) {
  const ctx = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemValueContext);
  if (!ctx || !itemValue) throw new Error('AccordionTrigger must be used within AccordionItem inside Accordion');
  const isOpen = ctx.openItems.includes(itemValue);
  const handleClick = () => {
    if (ctx.type === 'single') {
      ctx.setOpenItems(isOpen ? [] : [itemValue]);
    } else {
      ctx.setOpenItems(
        isOpen ? ctx.openItems.filter((v) => v !== itemValue) : [...ctx.openItems, itemValue]
      );
    }
  };
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${itemValue}`}
      className={className}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

const AccordionItemValueContext = React.createContext<string | null>(null);

// Wrap children to provide value context
function AccordionItemProvider({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <AccordionItemValueContext.Provider value={value}>
      {children}
    </AccordionItemValueContext.Provider>
  );
}

// Patch AccordionItem to use the value context
const _AccordionItem = AccordionItem;
AccordionItem = function PatchedAccordionItem(props: AccordionItemProps) {
  return <AccordionItemProvider value={props.value}><_AccordionItem {...props} /></AccordionItemProvider>;
} as typeof AccordionItem;

interface AccordionContentProps extends React.PropsWithChildren<{}> {
  className?: string;
}

export function AccordionContent({ children, className = '' }: AccordionContentProps) {
  const ctx = React.useContext(AccordionContext);
  const itemValue = React.useContext(AccordionItemValueContext);
  if (!ctx || !itemValue) throw new Error('AccordionContent must be used within AccordionItem inside Accordion');
  const isOpen = ctx.openItems.includes(itemValue);
  return (
    <div
      id={`accordion-content-${itemValue}`}
      hidden={!isOpen}
      className={className}
      aria-hidden={!isOpen}
    >
      {children}
    </div>
  );
} 