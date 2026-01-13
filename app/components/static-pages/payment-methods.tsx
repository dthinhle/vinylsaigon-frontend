import * as React from 'react'

const PaymentMethods: React.FC = () => {
  const METHODS = [
    { bank: 'Vietcombank (TP.HCM)', bankNumber: '9932017292' },
    { bank: 'Sacombank (PGD Phan Xích Long)', bankNumber: '060135575677' },
    { bank: 'BIDV (Chi nhánh Gia Định)', bankNumber: '13510000825551' },
    { bank: 'ACB (TP.HCM)', bankNumber: '92324339' },
    { bank: 'Agribank (Chi nhánh Phú Nhuận – TP.HCM)', bankNumber: '1604205398272' },
    { bank: 'Đông Á (Chi nhánh Bình Tây – TP.HCM)', bankNumber: '0101798513' },
    { bank: 'Techcombank (Chi nhánh Tân Định)', bankNumber: '19032128241019' },
  ]

  return (
    <div className='container max-w-3xl mx-auto py-8 px-4'>
      <h2 className='text-3xl font-bold mb-6'>Hình thức thanh toán</h2>
      <div className='page-content'>
        <div className='mt-4 mb-6'>
          <h3 className='text-lg my-2'>
            <strong>
              Quý khách hàng có thể thanh toán bằng tiền mặt, thẻ ngân hàng, hoặc chuyển khoản.
            </strong>
          </h3>
          <h3 className='text-lg mb-2'>
            <strong>
              Chủ tài khoản: <span className='text-sea-buckthorn-400'>VO NGOC BAO NGAN</span>
            </strong>
          </h3>
          <ul className='list-decimal ml-6'>
            {METHODS.map((method, index) => {
              return (
                <li key={index} className='mb-2'>
                  <span className='font-bold'>{method.bank}</span>
                  <p>STK: {method.bankNumber}</p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods
