import { stylized } from '@/app/fonts'
import { cn } from '@/lib/utils'

import { HeroProps } from './types'

export const Hero = ({ title, description = [], className }: HeroProps) => {
  return (
    <section
      className={cn(
        'relative w-full md:h-[420px] lg:h-[480px] flex items-center justify-center my-12 overflow-hidden bg-white text-black',
        className,
      )}
    >
      <div className='relative z-20 w-full px-8 mt-20'>
        <h1
          className={cn(
            stylized.className,
            'text-4xl md:text-4xl mb-6 tracking-wide text-left px-8',
          )}
        >
          {title}
        </h1>
        {description.map((paragraph, index) => (
          <p
            key={index}
            className='text-lg md:text-1xl font-light max-w-3xl mx-0 leading-relaxed opacity-90 text-left mt-4 px-8'
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}
