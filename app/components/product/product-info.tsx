import { montserrat } from '@/app/fonts'
import { FRONTEND_PATH } from '@/lib/constants'
import { LexicalContent } from '@/lib/types/lexical-node'
import { IProduct, PRODUCT_STOCK_STATUSES, TProductStockStatus } from '@/lib/types/product'
import { IProductVariant } from '@/lib/types/variant'
import { cn } from '@/lib/utils'
import { LexicalContentRenderer } from '@/lib/utils/lexical-renderer'
import Link from 'next/link'

import ProductBadges from './product-badge'
import ProductBundlePromotion from './product-bundle-promotion'
import ProductVariants from './product-variants'

type Props = {
  product: IProduct
  selectedVariant: IProductVariant
  setSelectedVariant: (selectedVariant: IProductVariant) => void
}

const ProductInfo: React.FC<Props> = ({ product, selectedVariant, setSelectedVariant }) => {
  const { name, shortDescription } = product
  const parsedShortDescription = JSON.parse(shortDescription) as LexicalContent

  let productStockStatus: TProductStockStatus = PRODUCT_STOCK_STATUSES.DEFAULT
  if (product.status === 'inactive') {
    productStockStatus = PRODUCT_STOCK_STATUSES.INACTIVE_PRODUCT
  } else if (product.status === 'temporarily_unavailable') {
    productStockStatus = PRODUCT_STOCK_STATUSES.OUT_OF_STOCK
  } else if (product.status === 'discontinued') {
    productStockStatus = PRODUCT_STOCK_STATUSES.DISCONTINUED_PRODUCT
  } else if (product.flags.includes('arrive-soon')) {
    productStockStatus = PRODUCT_STOCK_STATUSES.ARRIVE_SOON
  }

  const warrantyContent = product.warrantyMonths % 12 === 0 ?
    `${product.warrantyMonths / 12} năm` :
    `${product.warrantyMonths} tháng`


  return (
    <div className='lg:px-2 px-3 xl:pr-0 xl:pl-6 flex flex-col lg:gap-4.5 gap-6 sticky top-0 h-fit'>
      <ProductBadges product={product} />

      <h1 className={cn(montserrat.className, 'first:max-lg:mt-3 text-2xl md:text-3xl font-semibold')}>{name}</h1>

      <div className='flex items-baseline pl-2 border-l border-gray-950 gap-2'>
        <span className='text-sm'>Thương hiệu:</span>
        {product.brands.map((brand, index, { length }) => {
          return (
            <div key={brand.slug}>
              <Link
                key={brand.slug}
                href={FRONTEND_PATH.brandDetail(brand.slug)}
                className='font-bold hover:underline'
              >
                {brand.name}
              </Link>
              {length > 1 && index < length - 1 ? <span>,</span> : null}
            </div>
          )
        })}
      </div>

      {product.metaDescription && product.metaDescription.length > 0 && (
        <>
          <div className='flex flex-col gap-1 leading-relaxed tracking-[0.0175em]'>
            <p>{product.metaDescription}</p>
          </div>
          <hr className='border-gray-300' />
        </>
      )}

      <ProductVariants
        product={product}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
        stockStatus={productStockStatus}
      />

      <div className='text-sm md:text-base border-b border-gray-300 leading-relaxed tracking-[0.0175em] not-empty:pb-4 *:last:mb-0'>
        <LexicalContentRenderer content={parsedShortDescription} />
      </div>

      <ProductBundlePromotion bundles={product.productBundles} />

      {product.warrantyMonths && (
        <>
          <div className='flex flex-col gap-1'>
            <p className='font-bold'>Bảo hành</p>
            <p className='text-sm'>{warrantyContent}</p>
          </div>
        </>
      )}
      {
        product.flags.includes('free-shipping') || product.warrantyMonths ? <hr className='border-gray-300' /> : null
      }
      {productStockStatus === PRODUCT_STOCK_STATUSES.DEFAULT && (
        <>
          <div className='flex flex-col gap-1'>
            <p className='font-bold mb-2'>Liên hệ</p>
            <ul className='list-none space-y-3'>
              <li>
                <Link href={'https://zalo.me/0914345357'} target='_blank' className='flex gap-2 items-center font-bold'>
                  <div className="icon-wrapper size-6">
                    <svg id="svg_zalo_icon" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 614.501 613.667">
                      <path fill="currentColor" d="M464.721,301.399c-13.984-0.014-23.707,11.478-23.944,28.312c-0.251,17.771,9.168,29.208,24.037,29.202   c14.287-0.007,23.799-11.095,24.01-27.995C489.028,313.536,479.127,301.399,464.721,301.399z" />
                      <path fill="currentColor" d="M291.83,301.392c-14.473-0.316-24.578,11.603-24.604,29.024c-0.02,16.959,9.294,28.259,23.496,28.502   c15.072,0.251,24.592-10.87,24.539-28.707C315.214,313.318,305.769,301.696,291.83,301.392z" />
                      <path fill="currentColor" d="M310.518,3.158C143.102,3.158,7.375,138.884,7.375,306.3s135.727,303.142,303.143,303.142   c167.415,0,303.143-135.727,303.143-303.142S477.933,3.158,310.518,3.158z M217.858,391.083   c-33.364,0.818-66.828,1.353-100.133-0.343c-21.326-1.095-27.652-18.647-14.248-36.583c21.55-28.826,43.886-57.065,65.792-85.621   c2.546-3.305,6.214-5.996,7.15-12.705c-16.609,0-32.784,0.04-48.958-0.013c-19.195-0.066-28.278-5.805-28.14-17.652   c0.132-11.768,9.175-17.329,28.397-17.348c25.159-0.026,50.324-0.06,75.476,0.026c9.637,0.033,19.604,0.105,25.304,9.789   c6.22,10.561,0.284,19.512-5.646,27.454c-21.26,28.497-43.015,56.624-64.559,84.902c-2.599,3.41-5.119,6.88-9.453,12.725   c23.424,0,44.123-0.053,64.816,0.026c8.674,0.026,16.662,1.873,19.941,11.267C237.892,379.329,231.368,390.752,217.858,391.083z    M350.854,330.211c0,13.417-0.093,26.841,0.039,40.265c0.073,7.599-2.599,13.647-9.512,17.084   c-7.296,3.642-14.71,3.028-20.304-2.968c-3.997-4.281-6.214-3.213-10.488-0.422c-17.955,11.728-39.908,9.96-56.597-3.866   c-29.928-24.789-30.026-74.803-0.211-99.776c16.194-13.562,39.592-15.462,56.709-4.143c3.951,2.619,6.201,4.815,10.396-0.053   c5.39-6.267,13.055-6.761,20.271-3.357c7.454,3.509,9.935,10.165,9.776,18.265C350.67,304.222,350.86,317.217,350.854,330.211z    M395.617,369.579c-0.118,12.837-6.398,19.783-17.196,19.908c-10.779,0.132-17.593-6.966-17.646-19.512   c-0.179-43.352-0.185-86.696,0.007-130.041c0.059-12.256,7.302-19.921,17.896-19.222c11.425,0.752,16.992,7.448,16.992,18.833   c0,22.104,0,44.216,0,66.327C395.677,327.105,395.828,348.345,395.617,369.579z M463.981,391.868   c-34.399-0.336-59.037-26.444-58.786-62.289c0.251-35.66,25.304-60.713,60.383-60.396c34.631,0.304,59.374,26.306,58.998,61.986   C524.207,366.492,498.534,392.205,463.981,391.868z" />
                    </svg>
                  </div>
                  Zalo
                </Link>
              </li>
              <li>
                <Link href={'https://m.me/3kshop'} target='_blank' className='flex gap-2 items-center font-bold'>
                  <div className="icon-wrapper size-6">
                    <svg id="Messenger Logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 502 502">
                      <path fill='currentColor' strokeWidth='0' d="M251,1C110.17,1,1,104.16,1,243.5c0,72.89,29.87,135.86,78.51,179.37,4.09,3.65,6.55,8.78,6.72,14.25l1.36,44.48c.43,14.18,15.09,23.41,28.06,17.68l49.62-21.91c4.21-1.85,8.92-2.2,13.35-.97,22.81,6.27,47.07,9.61,72.37,9.61,140.83,0,250-103.16,250-242.5S391.83,1,251,1ZM405.92,178.79l-87.04,134.52c-4.42,6.83-13.53,8.78-20.36,4.36l-80.63-52.17c-3.12-2.02-7.16-1.96-10.22.15l-90.88,62.68c-13.26,9.14-29.47-6.59-20.72-20.11l87.05-134.52c4.42-6.83,13.53-8.78,20.35-4.36l80.65,52.18c3.12,2.02,7.16,1.96,10.22-.15l90.86-62.67c13.26-9.15,29.47,6.59,20.72,20.11Z"/>
                    </svg>
                  </div>
                  Messenger
                </Link>
              </li>
            </ul>
          </div>
          <hr className='border-gray-300 lg:hidden' />
        </>
      )}
    </div>
  )
}

export default ProductInfo
