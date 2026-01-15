
export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export const API_QUERY_URL = API_URL + '/api/query'
export const ACCESS_TOKEN_KEY_NAME = 'jwtToken'

export const FRONTEND_PATH = {
  root: '/',
  products: '/san-pham',
  productDetail: (slug: string) => `/san-pham/${slug}`,
  brands: '/thuong-hieu',
  brandDetail: (slug: string) => `/thuong-hieu/${slug}`,
  brandCategoryDetail: (slug: string, categorySlug: string) =>
    `/thuong-hieu/${slug}/${categorySlug}`,
  collections: '/bo-suu-tap',
  collectionDetail: (slug: string) => `/bo-suu-tap/${slug}`,
  collectionCategoryDetail: (slug: string, categorySlug: string) =>
    `/bo-suu-tap/${slug}/${categorySlug}`,
  news: '/tin-tuc',
  newsDetail: (slug: string) => `/tin-tuc/${slug}`,
  productCategory: (slug: string) => `/danh-muc/${slug}`,
  searchResult: (query: string) => `/ket-qua-tim-kiem?query=${encodeURI(query)}`,

  // Auth related paths
  signIn: '/dang-nhap',
  signUp: '/dang-ky',
  completeAccount: '/hoan-tat-dang-ky',
  forgotPassword: '/quen-mat-khau',
  cart: '/gio-hang',
  orderTracking: '/tra-cuu-don-hang',
  viewProfile: '/tai-khoan',
  editProfile: '/tai-khoan/chinh-sua-ho-so',
  orders: '/tai-khoan/don-hang',
  orderDetail: (orderNumber: string) => `/tai-khoan/don-hang/${orderNumber}`,
  myReturns: '/tai-khoan/tra-hang',

  // Static pages
  contact: '/lien-he',
  aboutUs: '/gioi-thieu',
  guarantee: '/cam-ket-hang-hoa',
  privacyPolicy: '/bao-mat-thong-tin-ca-nhan',
  paymentMethods: '/hinh-thuc-thanh-toan',
  installmentGuide: '/huong-dan-mua-tra-gop',
  shippingPolicy: '/chinh-sach-van-chuyen',
  notFound: '/khong-tim-thay-trang',

  // Top header links
  newArrivals: '/bo-suu-tap/hang-moi-ve',
  promotions: '/bo-suu-tap/khuyen-mai',
} as const

export const ROOT_CATEGORIES_FOR_LAYOUT = {
  top: ['tai-nghe', 'dac-amp'],
  middle: ['loa', 'nguon-phat', 'phu-kien'],
  bottom: ['home-studio', 'tin-tuc'],
}

export const CATEGORY_TITLE_SORTS = [
  'Tai nghe',
  'DAC/AMP',
  'Loa',
  'Nguồn phát',
  'Home Studio',
  'Phụ kiện',
  'Desktop DAC/AMP',
  'Over-Ear',
  'In-Ear',
  'Không dây',
  'Earbud',
  'Loa Bookshelf',
  'Loa Hi-Fi',
  'Loa Di Động',
  'Mâm đĩa than',
  'Soundcard',
  'Eartip/Earpad',
  'Portable DAC/AMP',
  'Loa Subwoofer',
  'Bluetooth DAC/AMP',
  'Hộp đựng',
  'Camera',
  'Speaker Amplifier',
  'Dây Tai nghe',
  'Dây USB-OTG',
  'Phono stage',
  'Kim đĩa than',
  'Máy nghe CD',
  'Máy nghe nhạc',
  'On-Ear',
  'Soundbar',
  'Microphone',
  'Hệ thống loa',
  'Máy cát sét',
  'Phụ kiện mâm đĩa than',
  'Đèn',
  'Capture Card',
  'Stream Deck',
  'Phụ kiện khác',
  'Thiết bị khác',
]

export const CART_NAME = '3KShopingCart'

export const vietnamProvinces = [
  'Hà Nội',
  'Hồ Chí Minh',
  'An Giang',
  'Bắc Ninh',
  'Cà Mau',
  'Cần Thơ',
  'Cao Bằng',
  'Đà Nẵng',
  'Đắk Lắk',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Tĩnh',
  'Hải Phòng',
  'Huế',
  'Hưng Yên',
  'Khánh Hòa',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Nghệ An',
  'Ninh Bình',
  'Phú Thọ',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sơn La',
  'Tây Ninh',
  'Thái Nguyên',
  'Thanh Hoá',
  'Tuyên Quang',
  'Vĩnh Long',
]

export const DEFAULT_VARIANT_NAME = 'Default'
