import { montserrat } from '@/app/fonts'
import { LexicalContent } from '@/lib/types/lexical-node'
import { IProduct } from '@/lib/types/product'
import { cn } from '@/lib/utils'
import { LexicalContentRenderer } from '@/lib/utils/lexical-renderer'

type Props = {
  product: IProduct
}

const ProductAdditionalInfo: React.FC<Props> = ({ product }) => {
  const { description, productAttributes } = product
  const parsedDescription = JSON.parse(description) as LexicalContent

  return (
    <div className='lg:px-0 px-4'>
      <div className='gap-2 mb-6'>
        <h3 className={cn(montserrat.className, 'text-xl lg:text-2xl font-medium mb-6')}>
          Thông tin chi tiết
        </h3>
        <div
          className={'mb-8 leading-relaxed tracking-[0.0175em] lg:max-w-6xl mx-auto'}
        >
          <LexicalContentRenderer content={parsedDescription} />
        </div>
      </div>
      {Array.isArray(productAttributes) && productAttributes.length > 0 && (
        <div className='grid grid-cols-1 lg:grid-cols-[auto_1fr] lg:gap-18 mb-6'>
          <p className={cn(montserrat.className, 'text-xl lg:text-2xl font-medium mb-6')}>
            Thông số chi tiết
          </p>
          <div className='flex flex-col gap-3 mt-3'>
            {productAttributes.map((attribute, index) => {
              return (
                <div key={index} className='flex items-start border-b border-gray-400 pb-3'>
                  <p className='w-4/12 font-bold text-sm'>{attribute.label}</p>
                  <p className='w-8/12 whitespace-pre-wrap text-left max-h-50 overflow-auto text-sm'>
                    {attribute.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductAdditionalInfo
