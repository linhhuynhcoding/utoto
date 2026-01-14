import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// Since we might not have @radix-ui/react-label installed, we'll make a simple implementation if it fails, 
// but checking package.json earlier, we only saw avatar, separator, slot. 
// Ideally we should install it, but user asked for simple implementations. 
// Let's check if we can just use a span/label element directly to avoid adding deps if possible, 
// OR just assume standard label usage. 
// Given the prompt "Mock thành page riêng... tái sử dụng...", and I saw `package.json` didn't have `@radix-ui/react-label`.
// I will implement a standard Label HTML wrapper to avoid install errors.

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(labelVariants(), className)}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
