import { FRONTEND_PATH } from '@/lib/constants'
import staticBanner from '@/public/assets/static-banner.webp'
import { Metadata } from 'next'

import { Banner } from '../components/page'

export const revalidate = 86400

const description = 'Khám phá câu chuyện hình thành và phát triển của Vinyl Sài Gòn - cửa hàng tai nghe và thiết bị âm thanh chuyên nghiệp tại TP.HCM từ năm 2011. Chuyên cung cấp tai nghe cao cấp, mâm đĩa than, DAC/Amp chính hãng với dịch vụ tư vấn chuyên sâu.'
export const metadata: Metadata = {
  title: 'Giới thiệu',
  description,
  openGraph: {
    title: 'Giới thiệu | Vinyl Sài Gòn',
    description,
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/gioi-thieu`,
    images: [
      {
        url: staticBanner.src,
        width: 1200,
        height: 630,
        alt: 'Giới thiệu Vinyl Sài Gòn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giới thiệu | Vinyl Sài Gòn',
    description,
    images: [staticBanner.src],
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://vinylsaigon.vn'}/gioi-thieu`,
  },
}

const Page: React.FC = () => {
  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Giới thiệu',
      link: FRONTEND_PATH.aboutUs,
    },
  ]

  return (
    <div className='w-full'>
      <Banner breadcrumbNodes={breadcrumbNodes} backgroundImage={staticBanner.src} />
      <div className='max-w-screen-lg mx-auto mt-4 lg:mt-6'>
        <div className='container max-w-3xl mx-auto py-8 px-4'>
          <h1 className='text-3xl font-bold mb-6'>Giới thiệu về Vinyl Sài Gòn</h1>
          <div className='page-content'>
            <p className='my-3'>
              Năm 2011, thời điểm mà ở Hồ Chí Minh không có nhiều cửa hàng headphone cũng như nhiều
              mẫu mã để người chơi lựa chọn, đó chính là thời điểm mà Vinyl Sài Gòn đã ra đời. Vinyl Sài Gòn
              được thành lập bởi các những bạn trẻ có niềm đam mê bất tận với âm thanh. Chính niềm
              đam mê đó đã giúp những anh em hội tụ, gắn kết, khao khát mang nhiều mẫu headphone,
              DAC/Amp mới về để trải nghiệm thỏa đam mê chứ không phải mục đích kinh doanh. Ban đầu,
              shop có tên gọi là “TAMK Shop”. T-A-M-K đại diện cho 4 chữ cái đầu tiên của tên những
              người thành lập shop. Tuy nhiên, mọi người gọi trại riết thành Vinyl Sài Gòn và cuối cùng
              anh em cũng quyết định đổi tên thành Vinyl Sài Gòn và năm 2012, đó cũng là lúc mà website
              vinylsaigon.vn ra đời.
            </p>
            <p className='my-3'>
              Thời điểm đầu tiên, Vinyl Sài Gòn chỉ là 1 cửa hàng nhỏ tại nhà số 443/34 Điện Biên Phủ,
              P.1, Q.3, TP. Hồ Chí Minh. Mặc dù là một địa chỉ khá khó kiếm, tuy nhiên lúc nào anh
              em đam mê âm thanh cũng lặn lội ghé thăm và ủng hộ thường xuyên. Ngoài ra còn có vài
              điểm bất tiện như: không có chỗ để xe, không có chỗ ngồi,… nhưng anh em vẫn yêu quý và
              ghé ủng hộ shop.
            </p>
            <p className='my-3'>
              Tháng 6 năm 2012: Vinyl Sài Gòn mở chi nhánh 14 Nguyễn Văn Giai, P. Đa Kao, Q.1.
            </p>
            <p className='my-3'>
              Một trong những điều quan trọng nhất mà Vinyl Sài Gòn mong muốn nhất chính là mang đến những
              sản phẩm có chất lượng tốt; “tốt” ở đây chính là về cả chất âm, độ bền cũng như chế độ
              bảo hành, hậu mãi cho khách hàng. Chính vì vậy, Vinyl Sài Gòn luôn cố gắng làm việc để đem
              đến những sản phẩm chính hãng cùng với giá thành tốt nhất. Các sản phẩm có chất lượng
              không tốt chắc chắn sẽ không bao giờ hiện hữu tại Vinyl Sài Gòn. Đồng thời, các bạn làm việc
              tại Vinyl Sài Gòn luôn mang trong mình niềm đam mê cũng như cố gắng trang bị những kiến thức
              về âm thanh để có thể truyền tải, chia sẻ thú chơi âm thanh với nhiều người hơn nữa.
            </p>
            <p className='my-3'>
              <strong>
                Cảm ơn những người anh, những người bạn, những khách hàng đã luôn sát cánh và ủng hộ
                Vinyl Sài Gòn.
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
