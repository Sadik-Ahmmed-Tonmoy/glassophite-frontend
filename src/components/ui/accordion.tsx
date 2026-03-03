"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        "transition-colors duration-300",
        isDark ? "border-white/10" : "border-neutral-200",
        className
      )}
      {...props}
    />
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const triggerProps = props as React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { 'data-state'?: 'open' | 'closed' };

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all duration-300 group",
      
   isDark 
            ? "!text-white hover:text-white data-[state=open]:text-white" 
            : "text-neutral-600 hover:text-neutral-900 data-[state=open]:text-neutral-900",
          className
        )}
        {...props}
      >
        {children}
        <motion.div
         animate={{ rotate: triggerProps['data-state'] === 'open' ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className={cn(
            "h-4 w-4 transition-colors duration-300",
             "group-data-[state=open]:rotate-180",
            isDark ? "text-neutral-500 group-hover:text-[#007C74]" : "text-neutral-400 group-hover:text-[#007C74]"
          )} />
        </motion.div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        isDark ? "text-neutral-400" : "text-neutral-600",
        className
      )}
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
})

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }