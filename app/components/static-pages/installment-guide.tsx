import Image from 'next/image'
import * as React from 'react'
import { PhoneNumber } from '@/app/components/phone-number'

type PolicySection = {
  title?: string
  content: React.ReactNode
}

const SECTIONS: PolicySection[] = [
  {
    content: (
      <>
        <p>
          Hình thức mua hàng <strong>trả góp</strong> ngày càng được ưa chuộng, bởi nó giúp khách
          hàng có cơ hội sở hữu sản phẩm công nghệ dễ dàng mà không cần mất thời gian dài tích lũy
          tài chính. So với các phương thức trả góp truyền thống, trả góp tại 3K cho phép rút ngắn
          mọi quy trình xét duyệt hồ sơ cũng như lượt bỏ các thủ tục rườm rà mang đến cho khách hàng
          sự tiện lợi và đơn giản hơn hết. Thông qua bài viết này, 3K Shop muốn chia sẻ đến bạn 3
          cách mua hàng trả góp tại hệ thống cửa hàng và website{' '}
          <a href='https://www.vinylsaigon.vn' target='_blank' rel='noopener'>
            www.vinylsaigon.vn
          </a>
          .
        </p>
        <div className='flex justify-center my-4'>
          <Image
            src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-01.jpg'
            alt='trả góp vinylsaigon.vn'
            width={676}
            height={459}
            unoptimized
          />
        </div>
        <p className='text-center italic'>
          Hình thức trả góp qua thẻ tín dụng giúp khách hàng sở hữu sản phẩm dễ dàng hơn
        </p>
      </>
    ),
  },
  {
    title: '1. Mua hàng trả góp qua thẻ tín dụng bằng dịch vụ mPos',
    content: (
      <>
        <p className='mb-1'>
          MPOS là một hệ thống thanh toán an toàn, tiện lợi, nhanh chóng, với tất cả các loại thẻ
          đang có của hơn 20 ngân hàng trên thị trường. Để thực hiện giao dịch mua hàng{' '}
          <strong>trả góp qua thẻ tín dụng</strong> bằng dịch vụ mPOs, quý khách hàng thực hiện theo
          quy trình sau:
        </p>
        <ul>
          <li>
            <strong>Bước 1:</strong> Khách hàng lựa chọn sản phẩm cần mua tại cửa hàng 3K Shop ở một
            trong hai địa chỉ sau:
            <ul className='list-disc ml-4'>
              <li>
                <span>14 Nguyễn Văn Giai, P. Đa Kao, Q.1</span>
                <p>(028) 38 202 909 – <PhoneNumber number='0914 345 357' /></p>
              </li>
              <li>
                <span>6B Đinh Bộ Lĩnh, P.24, Q. Bình Thạnh</span>
                <p>(028) 38 202 909 – <PhoneNumber number='0914 345 357' /></p>
              </li>
            </ul>
          </li>
          <li>
            <strong>Bước 2:</strong> Sử dụng loại thẻ tín dụng ngân hàng phù hợp với các ngân hàng
            mà MPOS liên kết
          </li>
          <li>
            <strong>Bước 3:</strong> Cung cấp thông tin cần thiết mà nhân viên yêu cầu (thông tin
            chủ thẻ, số thẻ, thời hạn sử dụng thẻ,…)
          </li>
          <li>
            <strong>Bước 4:</strong> Tiến hành thanh toán. Nhân viên thu ngân sẽ tiến hành thanh
            toán số tiền mà khách hàng yêu cầu nhưng không thấp hơn số tiền tối thiểu mà ngân hàng
            quy định (Tối thiểu 3.000.000 đồng). Giao dịch của khách hàng sẽ được chuyển đổi từ 7-10
            ngày, khách hàng không cần phải thao tác gì thêm.
          </li>
        </ul>
        <div className='flex justify-center my-4'>
          <Image
            src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-02.jpg'
            alt='Ngân hàng liên kết mPOS'
            width={782}
            height={466}
            style={{ maxWidth: '100%', height: 'auto' }}
            unoptimized
          />
        </div>
        <p className='text-center italic'>
          Các ngân hàng liên kết dịch vụ trả góp qua thẻ tín dụng với mPOS
        </p>
      </>
    ),
  },
  {
    title: '2. Mua hàng trả góp qua công ty tài chính HD Saigon',
    content: (
      <>
        <p>
          Mua hàng <strong>trả góp</strong> qua công ty tài chính HD Saigon là hình thức khách hàng
          vay tiền để mua sản phẩm bằng uy tín của mình, không cần phải thế chấp tài sản, không công
          chứng giấy tờ và không chứng minh tài chính.
        </p>
        <div className='flex justify-center my-4'>
          <Image
            src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-03.jpg'
            alt='HD Saigon'
            width={1600}
            height={600}
            style={{ maxWidth: '100%', height: 'auto' }}
            unoptimized
          />
        </div>
        <p className='text-center italic'>
          Chương trình trả góp ưu đãi từ HD Saigon dành riêng cho khách hàng 3K Shop
        </p>
        <strong>Thông tin chung</strong>
        <ul className='list-disc ml-4 mb-4'>
          <li>Khu vực áp dụng: Trả góp khi mua tại cửa hàng</li>
          <li>Đối tượng áp dụng: Khách hàng từ 19 tuổi</li>
          <li>Tổng đài hỗ trợ: 1900 55 88 54</li>
        </ul>
        <strong>Thông tin khoản vay</strong>
        <ul className='list-disc ml-4 mb-4'>
          <li>Khoản vay tối thiểu: 3 triệu</li>
          <li>Khoản vay tối đa: 20 triệu</li>
          <li>Mức trả trước tối thiểu: 30%</li>
          <li>Phí bảo hiểm: Tuỳ thuộc vào khoản vay</li>
        </ul>
        <strong>Thủ tục cần có</strong>
        <ul className='list-disc ml-4 mb-4'>
          <li>Đối với khoản vay dưới 10 triệu: CMND + Giấy phép lái xe</li>
          <li>Đối với khoản vay trên 10 triệu: CMND + Hộ khẩu + Hóa đơn điện/nước</li>
        </ul>
        <strong>Quy trình</strong>
        <ul className='list-disc ml-4 mb-4'>
          <li>Bước 1: Khách hàng chọn sản phẩm cần mua và liên hệ với 3kshop trước nhé.</li>
          <li>
            Bước 2: Nhân viên HDsaison sẽ liên hệ khách qua số điện thoại để xác minh và xét duyệt
            hồ sơ
          </li>
          <li>
            Bước 3: Đợi nhân viên xét duyệt hồ sơ khoảng 30 – 45 phút (nếu quý khách lần đầu mua trả
            góp)
          </li>
          <li>Bước 4: Tiến hành thanh toán khoản trả trước (nếu có) và hoàn tất quy trình.</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Mua hàng trả góp qua thẻ tín dụng tại website 3K Shop',
    content: (
      <>
        <p>
          Để mua hàng tại website của 3K Shop, bạn truy cập vào địa chỉ{' '}
          <a href='https://www.vinylsaigon.vn' target='_blank' rel='noopener'>
            www.vinylsaigon.vn
          </a>{' '}
          và chọn tab sản phẩm ở thanh menu để lướt xem các sản phẩm.
        </p>
        <div className='flex justify-center my-4'>
          <Image
            src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-04.jpg'
            alt='Giao diện sản phẩm'
            width={804}
            height={459}
            style={{ maxWidth: '100%', height: 'auto' }}
            unoptimized
          />
        </div>
        <p className='text-center italic'>
          Giao diện trang sản phẩm của 3K Shop được phân loại rõ ràng theo từng nhóm
        </p>
        <p>
          Bên cạnh đó, bạn cũng có thể tìm kiếm nhanh sản phẩm cần mua bằng khung tìm kiếm ở góc
          trên bên trái màn hình.
        </p>
        <div className='flex justify-center my-4'>
          <Image
            src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-05.jpg'
            alt='Kết quả tìm kiếm'
            width={804}
            height={459}
            style={{ maxWidth: '100%', height: 'auto' }}
            unoptimized
          />
        </div>
        <p className='text-center italic'>
          Kết quả tìm kiếm hiển thị sản phẩm và tin tức chứa từ khóa
        </p>
        <section className='mt-4 mb-6'>
          <strong>Bước 1: Tìm hiểu về sản phẩm và thêm vào giỏ hàng</strong>
          <p>
            Nhấp vào sản phẩm bạn quan tâm để đến trang thông tin về sản phẩm. Tại đây, bạn có thể
            dễ dàng tìm hiểu các thông tin chi tiết cũng như cách sử dụng hay các thông số kỹ thuật
            của sản phẩm. Nếu đúng là sản phẩm cần mua, bạn nhấp vào biểu tượng “Bỏ vào giỏ hàng”
            bên cạnh.
          </p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-06.jpg'
              alt='Thông tin sản phẩm'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>
            Trang thông tin cung cấp đầy đủ các đặc điểm của sản phẩm
          </p>
        </section>

        <section className='mt-4 mb-6'>
          <strong>Bước 2: Điền đầy đủ thông tin người mua hàng</strong>
          <p>
            Sau khi chọn xong các sản phẩm cần mua, bạn chuyển đến trang thanh toán bằng cách nhấp
            vào biểu tượng xe đẩy ở góc trên bên phải.
          </p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-07.jpg'
              alt='Giao diện thanh toán'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>Giao diện trang thanh toán</p>
          <p>
            Kiểm tra lại giỏ hàng của bạn, nếu chính xác về mẫu mã và số lượng, bạn chuyển đến bước
            nhập thông tin người mua.
          </p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-08.jpg'
              alt='Thông tin người nhận'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>
            Những mục thông tin bắt buộc cần điền đầy đủ và chính xác
          </p>
          <p>Thực hiện nhập đầy đủ thông tin người nhận và mã giảm giá nếu có.</p>
        </section>

        <section className='mt-4 mb-6'>
          <strong>Bước 3: Chọn phương thức thanh toán</strong>
          <p>Khách hàng chọn phương thức thanh toán cổng quốc tế (trả góp)</p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-09.jpg'
              alt='Phương thức thanh toán'
              width={782}
              height={466}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>
            Khi mua hàng tại 3K Shop bạn có thể thanh toán bằng nhiều hình thức khác nhau
          </p>
          <p>
            Trước chọn thanh toán trả góp, bạn nên xem qua chính sách mua{' '}
            <strong>trả góp qua thẻ tín dụng</strong> tại 3K Shop và chính sách của ngân hàng phát
            hành thẻ tín dụng của bạn. Sau đó, nhấp vào nút “Thanh toán ngay” ở bên phải.
          </p>
        </section>

        <section className='mt-4 mb-6'>
          <strong>Bước 4: Tiến hành thanh toán</strong>
          <p>Chọn ngân hàng phát hành thẻ tín dụng của bạn tại cổng thanh toán</p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-10.jpg'
              alt='Chọn ngân hàng'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>
            3K Shop hỗ trợ thanh toán trả góp qua thẻ tín dụng của hầu hết ngân hàng Việt Nam
          </p>
          <p>Chọn loại thẻ Visa hoặc Mastercard</p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-11.jpg'
              alt='Chọn loại thẻ'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>
            Sau khi chọn ngân hàng phát hành thẻ, bạn tiếp tục loại thẻ cung cấp dịch vụ tín dụng
          </p>
          <p>
            Chọn thời hạn <strong>trả góp</strong> tương ứng, số tiền phải trả mỗi tháng cũng được
            hiển thị chính xác để bạn có thể lựa chọn thời hạn phù hợp nhất.
          </p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-12.jpg'
              alt='Chọn thời hạn trả góp'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>
            Bạn có thể lựa chọn 1 trong 4 thời hạn trả góp khác nhau – 3, 6, 9 hoặc 12 tháng
          </p>
          <p>Nhập đầy đủ thông tin thẻ ở phần tiếp theo.</p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-13.jpg'
              alt='Nhập thông tin thẻ'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>Thông tin thẻ cần được nhập đầy đủ và chính xác</p>
          <p>Kiểm tra lại thông tin thanh toán ở khung nội dung bên phải.</p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-14.jpg'
              alt='Khung thông tin thanh toán'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>
            Khung thông tin thể hiện đầy đủ tổng số tiền, thời hạn trả góp và số tiền phải trả mỗi
            tháng
          </p>
          <p>Thực hiện thanh toán bằng cách nhấp vào nút “Pay Now”</p>
          <div className='flex justify-center my-4'>
            <Image
              src='https://vinylsaigon.vn/wp-content/uploads/2020/03/tra-gop-15.jpg'
              alt='Bước cuối cùng'
              width={804}
              height={459}
              style={{ maxWidth: '100%', height: 'auto' }}
              unoptimized
            />
          </div>
          <p className='text-center italic'>Bước cuối cùng để thanh toán</p>
          <p>
            Hoàn tất quy trình mua hàng <strong>trả góp qua thẻ tín dụng</strong>.
          </p>
        </section>
      </>
    ),
  },
  {
    title: 'Một số lưu ý khi mua hàng trả góp online tại 3K Shop',
    content: (
      <>
        <ul>
          <li>
            Khách hàng cần đọc kỹ thể lệ chương trình <strong>trả góp</strong> của ngân hàng trước
            khi thực hiện thanh toán.
          </li>
          <li>Để được mua trả góp, tổng giá trị đơn hàng phải từ 3.000.000đ trở lên</li>
          <li>
            Mỗi khách hàng được tham gia mua trả góp nhiều lần miễn sao tổng giá trị các đơn hàng
            không vượt quá hạn mức thẻ tín dụng.
          </li>
          <li>
            Khách hàng không được hủy đơn hàng sau khi đã chuyển đổi giao dịch sang phương thức trả
            góp.
          </li>
          <li>
            Đơn hàng tham gia chương trình <strong>trả góp qua thẻ tín dụng</strong> sẽ không được
            đổi trả.
          </li>
          <li>Thông tin thanh toán của khách hàng sẽ được bảo mật tuyệt đối.</li>
        </ul>
        <p>
          Khi cần được tư vấn cụ thể hay có bất cứ thắc mắc nào, bạn hãy liên hệ đến hotline{' '}
          <strong>(028) 38 202 909</strong> hoặc <strong><PhoneNumber number='0914 345 357' /></strong> để được hỗ trợ nhé!
        </p>
      </>
    ),
  },
]

const InstallmentGuide = () => {
  return (
    <section className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>
        <a
          href='https://vinylsaigon.vn/huong-dan-mua-hang-tra-gop-tai-3kshop/'
          target='_blank'
          rel='noopener'
        >
          Hướng dẫn mua hàng trả góp tại vinylsaigon.vn
        </a>
      </h1>
      <div className='space-y-8'>
        {SECTIONS.map((section, idx) => (
          <div key={idx}>
            {section.title && <h2 className='text-xl font-semibold mb-2'>{section.title}</h2>}
            <div className='prose max-w-none'>{section.content}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default InstallmentGuide
