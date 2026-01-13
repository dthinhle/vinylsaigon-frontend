import { FRONTEND_PATH } from '@/lib/constants'
import ogImage from '@/public/assets/og-image.jpg'
import staticBanner from '@/public/assets/static-banner.webp'
import { Metadata } from 'next'

import { Banner } from '../components/page'
import { chunk } from 'lodash'
import { PhoneNumber } from '../components/phone-number'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Liên Hệ',
  description:
    'Liên hệ với Vinyl Sài Gòn - chuyên cung cấp tai nghe, DAC/Amp chất lượng cao. Tư vấn chuyên nghiệp và hỗ trợ khách hàng tận tâm.',
  openGraph: {
    title: 'Liên Hệ | Vinyl Sài Gòn',
    description:
      'Liên hệ với Vinyl Sài Gòn - chuyên cung cấp tai nghe, DAC/Amp chất lượng cao. Tư vấn chuyên nghiệp và hỗ trợ khách hàng tận tâm.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/lien-he`,
    images: [
      {
        url: ogImage.src,
        width: 2048,
        height: 1366,
        alt: 'Liên Hệ Vinyl Sài Gòn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Liên Hệ | Vinyl Sài Gòn',
    description:
      'Liên hệ với Vinyl Sài Gòn - chuyên cung cấp tai nghe, DAC/Amp chất lượng cao. Tư vấn chuyên nghiệp và hỗ trợ khách hàng tận tâm.',
    images: [ogImage.src],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/lien-he`,
  },
}

export default function ContactPage() {
  const contactInfo = [
    {
      label: 'Điện thoại',
      value: <>
        (028) 38 202 909 – <PhoneNumber number='0914 345 357' />
      </>,
    },
    {
      label: 'Thời gian làm việc từ',
      value: '8h30 - 20h00 (từ T2 đến T7)',
    },
    {
      label: 'Chủ nhật làm việc từ',
      value: '8h30 - 19h00',
    },
    {
      label: 'Nhận bảo hành & sửa chữa từ',
      value: '10h00 - 18h30',
    },
  ]

  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Liên hệ',
      link: FRONTEND_PATH.contact,
    },
  ]

  const locations = [
    {
      name: 'Chi nhánh Nguyễn Văn Giai',
      address: '14 Nguyễn Văn Giai, Đa Kao, Quận 1, Thành phố Hồ Chí Minh',
      mapEmbed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2496251678062!2d106.6945641752448!3d10.792183489357546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528ca55ac5da5%3A0x1410453b172f2b20!2s3K%20Shop%20HCM%20-%20Branch%201!5e0!3m2!1sen!2s!4v1766253181175!5m2!1sen!2s',
    },
    {
      name: 'Chi nhánh Đinh Bộ Lĩnh',
      address: '6B Đinh Bộ Lĩnh, Phường 14, Bình Thạnh, Thành phố Hồ Chí Minh',
      mapEmbed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d979.77448938515!2d106.70893236958013!3d10.803809099334167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529303597d311%3A0x7704e3e536b1693f!2zVmlueWwgU8OgaSBHw7Ju!5e0!3m2!1sen!2s!4v1766253243119!5m2!1sen!2s',
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Vinyl Sài Gòn chuyên cung cấp những sản phẩm gì?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vinyl Sài Gòn chuyên cung cấp các sản phẩm tai nghe, DAC/Amp chất lượng cao. Chúng tôi tập trung vào các sản phẩm âm thanh chính hãng với chất lượng tốt về cả chất âm, độ bền và chế độ bảo hành cho khách hàng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Số điện thoại liên hệ với Vinyl Sài Gòn là gì?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bạn có thể liên hệ với Vinyl Sài Gòn qua số điện thoại: (028) 38 202 909 hoặc 0914 345 357. Đây là các số điện thoại chính thức của cửa hàng để hỗ trợ khách hàng.',
        },
      },
      {
        '@type': 'Question',
        name: 'Thời gian làm việc của Vinyl Sài Gòn như thế nào?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Thời gian làm việc của Vinyl Sài Gòn: Từ thứ 2 đến thứ 7: 8h30 – 20h00. Chủ nhật: 8h30 – 19h00. Thời gian nhận bảo hành & sửa chữa: 10h00 – 18h30.',
        },
      },
      {
        '@type': 'Question',
        name: 'Vinyl Sài Gòn có hỗ trợ bảo hành sản phẩm không?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Có, Vinyl Sài Gòn có hỗ trợ nhận bảo hành và sửa chữa sản phẩm. Thời gian nhận bảo hành & sửa chữa là từ 10h00 – 18h30 hàng ngày.',
        },
      },
      {
        '@type': 'Question',
        name: 'Tại sao nên chọn mua hàng tại Vinyl Sài Gòn?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vinyl Sài Gòn cam kết chỉ bán hàng chính hãng với chất lượng tốt nhất, bao gồm cả chất âm, độ bền và chế độ bảo hành. Chúng tôi được thành lập bởi những người trẻ có niềm đam mê với âm thanh, luôn cố gắng mang đến những sản phẩm tốt nhất với giá thành hợp lý.',
        },
      },
    ],
  }

  return (
    <>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={staticBanner.src} />

      <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <section className='py-12 lg:py-16'>
          <div className='mb-16'>
            <h2 className='text-2xl font-bold text-gray-900 mb-8'>Giới thiệu về Vinyl Sài Gòn</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
              <div className='text-gray-700 text-sm leading-relaxed'>
                <p className='mb-4 text-pretty text-justify'>
                  Vinyl Sài Gòn được thành lập bởi các những bạn trẻ có niềm đam mê bất tận với âm thanh,
                  chính niềm đam mê đó đã giúp những anh em hội tụ, gắn kết, khao khát mang nhiều mẫu
                  headphone, DAC/Amp mới về để trải nghiệm thỏa đam mê chứ không phải mục đích kinh
                  doanh.
                </p>
              </div>
              <div className='text-gray-700 text-sm leading-relaxed'>
                <p className='mb-4 text-pretty text-justify'>
                  Một trong những điều quan trọng nhất mà Vinyl Sài Gòn mong muốn nhất chính là mang đến
                  những sản phẩm có chất lượng tốt; tốt ở đây chính là về cả chất âm, độ bền cũng như
                  chế độ bảo hành cho khách hàng.
                </p>
              </div>
              <div className='text-gray-700 text-sm leading-relaxed'>
                <p className='mb-4 text-pretty text-justify'>
                  Chính vì vậy, Vinyl Sài Gòn luôn cố gắng làm việc để có những sản phẩm chính hãng tốt
                  nhất, cùng với giá thành tốt nhất. Các sản phẩm có chất lượng không tốt chắc chắn sẽ
                  không bao giờ hiện hữu tại Vinyl Sài Gòn.
                </p>
              </div>
            </div>
          </div>

          <section className='mb-16'>
            <h2 className='text-2xl font-bold text-gray-900 mb-8'>Thông tin liên hệ</h2>
            <div className='space-y-8'>
              {chunk(contactInfo, 2).map((infoGroup, index) => (
                <div key={`info-group-${index}`} className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  {infoGroup.map((info) => (
                    <div key={`info-${info.label}`}>
                      <h3 className='text-gray-500 uppercase text-xs font-semibold tracking-wide mb-2'>
                        {info.label}
                      </h3>
                      <p className='text-lg text-gray-900'>{info.value}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className='mb-16'>
            <h2 className='text-2xl font-bold text-gray-900 mb-8'>Hệ thống cửa hàng</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {locations.map((location) => (
                <div key={location.name}>
                  <div className='mb-4'>
                    <iframe
                      title={`Map showing ${location.name}`}
                      src={location.mapEmbed}
                      width='100%'
                      height='300'
                      style={{ border: 0 }}
                      allowFullScreen
                      loading='lazy'
                      referrerPolicy='no-referrer-when-downgrade'
                      className='rounded'
                    />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1'>{location.name}</h3>
                  <p className='text-gray-600 text-sm'>{location.address}</p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>

      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
