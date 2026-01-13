import FooterMenu from '@/app/components/footer/footer-menu'
import NewsletterSignup from '@/app/components/newsletter/newsletter-signup'
import { PhoneNumber } from '@/app/components/phone-number'
import { montserrat } from '@/app/fonts'
import { FOOTER_MENUS } from '@/lib/constants/footer'
import { IStore } from '@/lib/types/global'
import { cn } from '@/lib/utils'
import dathongbaoCongThuong from '@/public/assets/dathongbao.png'
import logoBlack from '@/public/assets/logo-black.svg'
import facebookBlack from '@/public/icons/facebook-black.svg'
import instagramBlack from '@/public/icons/instagram-black.svg'
import youtubeBlack from '@/public/icons/youtube-black.svg'
import Image from 'next/image'
import Link from 'next/link'

import SocialLinks from './social-links'

const Footer = ({ globalData }: { globalData: IStore }) => {
  const { facebookUrl, instagramUrl, youtubeUrl } = globalData
  const links = [
    { icon: facebookBlack, url: facebookUrl },
    { icon: instagramBlack, url: instagramUrl },
    { icon: youtubeBlack, url: youtubeUrl },
  ]

  return (
    <footer className='py-[2rem]'>
      <div className='lg:max-w-screen-2xl lg:mx-auto lg:px-12 px-4 mb-4 border-t border-gray-300'>
        <div className='flex flex-col lg:flex-row items-start justify-between my-5'>
          <Image
            src={logoBlack}
            alt='Logo 3K Shop - Chuyên tai nghe và thiết bị âm thanh'
            className='w-35 lg:w-55 h-auto lg:pr-8 lg:my-0 my-3'
            unoptimized
          />
          <FooterMenu {...FOOTER_MENUS.aboutUs} />
          <FooterMenu {...FOOTER_MENUS.help} />
          <FooterMenu {...FOOTER_MENUS.myAccount} />
          <div className='hidden xl:block'>
            <h3 className='text-xl font-bold py-2 lg:py-0 mb-0 lg:mb-4'>Hồ Chí Minh</h3>
            <ul className='space-y-2 mb-3'>
              <li>
                <Link
                  href={'https://maps.app.goo.gl/p8g4VwmG9WadD3Vh9'}
                  target='_blank'
                  className='relative inline-block text-black after:absolute after:bottom-0 after:left-0 after:h-[1px]
                    after:w-0 after:bg-gray-900 after:transition-width after:duration-300 hover:after:w-full'
                >
                  14 Nguyễn Văn Giai, P. Đa Kao, Q.1
                </Link>
                <p>(028) 38 202 909 – <PhoneNumber number='0914 345 357' /></p>
              </li>
              <li>
                <Link
                  href={'https://maps.app.goo.gl/LNCo5krNtub6rD326'}
                  target='_blank'
                  className='relative inline-block text-black after:absolute after:bottom-0 after:left-0 after:h-[1px]
                    after:w-0 after:bg-gray-900 after:transition-width after:duration-300 hover:after:w-full'
                >
                  6B Đinh Bộ Lĩnh, P.24, Q. Bình Thạnh
                </Link>
                <p>(028) 38 202 909 – <PhoneNumber number='0914 345 357' /></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className='w-full bg-black text-white lg:py-16 lg:px-8 p-6'>
        <div className='lg:max-w-screen-2xl mx-auto subcribe-mail-wrapper flex flex-col lg:flex-row'>
          <div className='flex flex-col gap-3 max-w-lg mb-4 lg:mb-0'>
            <h3
              className={cn(montserrat.className, 'text-xl lg:text-2xl font-semibold text-balance')}
            >
              Đăng ký để nhận thêm thông tin mỗi tuần
            </h3>
            <p className='text-sm lg:text-base lg:max-w-full max-w-3/4 text-pretty'>
              Thông tin về sản phẩm mới, ưu đãi độc quyền, sự kiện và nhiều hơn nữa sẽ được gửi trực
              tiếp đến hộp thư của bạn.
            </p>
          </div>
          <div className='w-full flex items-center justify-end'>
            <NewsletterSignup />
          </div>
        </div>
      </div>
      <div className='justify-between items-center'>
        <div className='end-footer-wrapper lg:justify-between items-center gap-4 lg:max-w-screen-2xl flex flex-col-reverse lg:gap-2 lg:flex-row mx-auto px-4 pt-2'>
          <div className='flex flex-col items-center gap-2'>
            <h3 className='font-light text-sm uppercase md:hidden'>Theo dõi chúng tôi tại</h3>
            <SocialLinks links={links} />
          </div>
          <div>
            <Link href='http://online.gov.vn/Home/WebDetails/10706' target='_blank' rel='noopener noreferrer'>
              <Image
                alt='Đã thông báo với Bộ Công Thương'
                src={dathongbaoCongThuong}
                className='h-15 w-auto'
                unoptimized
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
