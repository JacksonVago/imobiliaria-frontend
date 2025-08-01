import * as React from 'react'

import { cn } from '@/lib/utils'
export interface InputProps extends React.ComponentProps<'input'> {
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, helperText, ...props }, ref) => {
    const hasError = !!helperText?.length
    return (
      <>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
            {
              'border-red-500': hasError
            }
          )}
          ref={ref}
          {...props}
        />
        {hasError && (
          <div>
            <p className="text-body14 text-redAlert font-proximaNova mt-1 font-medium">
              {helperText}
            </p>
          </div>
        )}
      </>
    )
  }
)
Input.displayName = 'Input'

export { Input }
