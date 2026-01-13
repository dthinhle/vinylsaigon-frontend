import Link from 'next/link'
import * as React from 'react'

const ShipingPolicy: React.FC = () => {
  return (
    <div className='container max-w-3xl mx-auto py-8 px-4'>
      <h2 className='text-3xl font-bold mb-6'>Chính sách vận chuyển</h2>
      <div className='page-content'>
        <h3 className='text-xl'>
          <strong>3Kshop vận chuyển hàng hóa đến mọi miền đất nước</strong>
        </h3>
        <div className='mt-4 mb-6'>
          <p>
            <strong>1. Đối với khách hàng tại TP.Hồ Chí Minh:</strong>
          </p>
          <ul>
            <li style={{ listStyleType: 'none' }}>
              <ul className='list-disc ml-6'>
                <li>
                  <strong>
                    Các quận nội thành (1, 3, 4, 5, 6, 8, 10, 11, Gò Vấp, Bình Thạnh, Phú Nhuận, Tân
                    Bình, Tân Phú):
                  </strong>
                  <ul className='ml-6' style={{ listStyleType: 'circle' }}>
                    <li>
                      Miễn phí vận chuyển tiêu chuẩn cho các đơn hàng có giá trị từ 1.000.000 trở
                      lên (không áp dụng với đơn hàng đã áp giá Khuyến Mãi)
                    </li>
                    <li>Các đơn hàng dưới 1.000.000 sẽ tính phí vận chuyển tuỳ vào khoảng cách.</li>
                  </ul>
                </li>
                <li>
                  <strong>Các quận, huyện ngoại thành:</strong> Phí vận chuyển sẽ được tính theo
                  khoảng cách.
                </li>
                <li>
                  <strong>
                    <em>Lưu ý:</em>{' '}
                    <span className='text-sea-buckthorn-500'>
                      Đơn hàng thanh toán theo phương thức COD sẽ có thêm phí thu hộ. Quý khách hàng
                      có nhu cầu trải nghiệm sản phẩm, xin vui lòng đến cửa hàng, chúng tôi không hỗ
                      trợ việc trải nghiệm sản phẩm ngoài khu vực cửa hàng.
                    </span>
                  </strong>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className='mb-6'>
          <p>
            <strong>2. Đối với khách hàng ở các tỉnh khác:</strong>
          </p>
          <ul className='list-disc ml-6'>
            <li>
              Khách hàng vui lòng tìm hiểu kĩ về sản phẩm mong muốn đặt hàng, sau đó chuyển khoản
              trước cho chúng tôi qua{' '}
              <span className='text-blue-500'>
                <Link href='/payment-methods'>tài khoản ngân hàng</Link>
              </span>
              .
            </li>
            <li>
              <strong>
                Quý khách lưu ý, khi chuyển khoản vui lòng điền tên và nội dung mặt hàng cần mua
              </strong>{' '}
              để đơn hàng có thể được xác nhận và xử lý nhanh nhất có thể.
            </li>
            <li>
              Sau khi chuyển khoản xong quý khách nhắn tin, gọi điện hoặc gửi qua email để thông báo
              mặt hàng cần lấy và cung cấp đầy đủ thông tin số điện thoại, địa chỉ người nhận hàng.
            </li>
            <li>
              Chúng tôi sẽ có trách nhiệm chuyển hàng cho quý khách qua dịch vụ chuyển phát nhanh
              như: GHTK, J&amp;T, Viettel Post, EMS, Tín Thành,…
            </li>
            <li>Thời gian nhận hàng: từ 1 đến 5 ngày tùy thuộc từng khu vực.</li>
            <li>
              Vui lòng liên hệ trực tiếp với nhân viên kinh doanh để có thông tin mua hàng tốt nhất.
            </li>
            <li>
              <strong>
                <em>Lưu ý:</em>{' '}
                <span className='text-sea-buckthorn-500'>
                  Đơn hàng thanh toán theo phương thức COD sẽ có thêm phí thu hộ. Quý khách hàng có
                  nhu cầu trải nghiệm sản phẩm, xin vui lòng đến cửa hàng, chúng tôi không hỗ trợ
                  việc trải nghiệm sản phẩm ngoài khu vực cửa hàng.
                </span>
              </strong>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ShipingPolicy
