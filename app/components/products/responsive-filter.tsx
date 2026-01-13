import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { PropsWithChildren, useEffect, useRef, useState } from 'react'

interface ResponsiveFilterProps {
  title: string
  className?: string
}

export const ResponsiveFilter = ({
  title,
  children,
  className,
}: PropsWithChildren<ResponsiveFilterProps>) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      className={cn('lg:border-b-0 px-2 border-b border-gray-300 lg:py-0 py-3 relative lg:w-48 w-full', className)}
    >
      <h3
        className={cn(
          'font-medium text-gray-900 mx-2 cursor-pointer mr-4',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <ChevronDown
          className={cn(
            'inline-block size-5 transition-transform duration-200 lg:top-0.5 top-4 lg:right-0 right-4 absolute',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
        />
      </h3>

      <div
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'lg:w-72 w-full z-40 lg:absolute lg:top-8 lg:mt-0 mt-4 lg:left-0 lg:block lg:opacity-100 lg:max-h-none overflow-hidden transition-all duration-200 ease-in-out',
          'bg-white lg:border lg:border-gray-200 p-2 lg:rounded-md lg:shadow overflow-y-auto transition-discrete',
          'data-[state=open]:opacity-100',
          'data-[state=closed]:scale-95 data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=closed]:-mt-3',
        )}
      >
        {children}
      </div>
    </div>
  )
}
