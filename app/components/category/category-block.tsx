import { stylized } from '@/app/fonts'
import { FRONTEND_PATH } from '@/lib/constants'
import { ICategory } from '@/lib/types/category'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  classNamePrefix: 'top' | 'bottom'
  category: ICategory,
  eagerLoad?: boolean
}

const CategoryBoxClasses = {
  top: {
    image: '',
    box: 'w-full lg:w-[calc(50%-.5rem)] relative h-auto overflow-hidden d-block aspect-square xl:aspect-4/3',
    content: 'p-3 grid-rows-[repeat(3,1fr)] grid-cols-[repeat(3,1fr)] lg:pl-[3vw] grid h-full gap-4 p-3',
    title: 'font-medium col-span-2 text-white text-[1.8rem] lg:text-[2.375rem] self-end text-white',
    description: 'self-end grid-cols-[1/-1] row-start-2 col-span-3 max-w-3/5 text-[1.125rem] text-white text-pretty box-shadow',
    link: 'w-36 h-12 text-base hover:text-lg',
    cta: 'row-start-3 content-start self-start',
  },
  bottom: {
    image: 'brightness-75',
    box: 'aspect-square relative h-auto overflow-hidden d-block',
    content: 'p-3 grid-rows-[repeat(3,1fr)] grid-cols-[repeat(3,1fr)] grid h-full gap-4 p-3',
    title: 'font-medium col-span-2 text-white text-[1.75rem] self-end text-white',
    description: 'self-end grid-cols-[1/-1] row-start-2 col-span-3 max-w-3/4 text-[1.125rem] md:text-[0.95rem] text-white text-pretty box-shadow',
    link: 'md:w-30 md:h-10 w-36 h-12 text-base hover:text-lg md:text-sm hover:md:text-base',
    cta: 'row-start-3 content-start self-start',
  },
}

const CategoryBox: React.FC<Props> = ({
  classNamePrefix,
  category: { title, description, thumbnail, slug, buttonText },
  eagerLoad,
}) => {
  const classes = CategoryBoxClasses[classNamePrefix]
  return (
    <div
      className={classes.box}
    >
      <Image
        alt={`category-${slug}`}
        fill
        src={thumbnail.url}
        className={cn(
          classes.image,
          'absolute top-0 left-0 w-full h-full object-cover -z-10',
        )}
        loading={eagerLoad ? 'eager' : 'lazy'}
        fetchPriority={eagerLoad ? 'high' : 'auto'}
      />
      <div className='background-wrapper absolute top-0 left-0 w-full h-full -z-10 bg-linear-to-tr from-black/40 to-black/0'></div>
      <div className={classes.content}>
        <h3
          className={cn(
            stylized.className,
            classes.title,
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(

              classes.description,
            )}
          >
            {description}
          </p>
        )}
        <div className={cn(classes.cta)}>
          <Link
            href={FRONTEND_PATH.productCategory(slug)}
            className={
              cn(
                'grid place-items-center bg-white font-bold cursor-pointer transition-all hover:[&>span]:after:w-full',
                classes.link,
              )
            }
          >
            <span className='relative duration-300 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gray-900 after:transition-width after:duration-300'>
              {`${buttonText || 'Mua ngay'}`}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CategoryBox
