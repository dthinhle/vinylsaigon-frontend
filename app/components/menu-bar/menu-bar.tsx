'use client'

import { CartButton } from '@/app/components/cart/cart-button'
import { stylized } from '@/app/fonts'
import { useThrottledScroll } from '@/app/hooks/use-throttled-scroll'
import { useAuthStore } from '@/app/store/auth-store'
import { useCartStore } from '@/app/store/cart-store'
import { FRONTEND_PATH } from '@/lib/constants'
import { IUser } from '@/lib/types/user'
import { cn } from '@/lib/utils'
import logo from '@/public/assets/logo.svg'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons'
import { X, Menu, Search, User2Icon } from 'lucide-react'
import { AnimatePresence, Variants, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { ISearchSuggestions, MenuItem, ProductMenu, RightSection } from './menu-data'
import SearchPanel from './search-panel'

interface MenuState {
  menu: boolean
  search: boolean
  user: boolean
}

interface NavLinksProps {
  isOpen?: boolean
  isSearchOpen?: boolean
  isUserOpen?: boolean
  onMenuClick: () => void
  setOpenSearch?: (openStatus: boolean) => void
  setOpenUser?: (openStatus: boolean) => void
}

interface MainMenuItem {
  type: 'products' | 'brands' | 'news' | 'promotions' | 'contact'
  label: string
  path: string
}

interface SignedInMenuProps {
  user: IUser
  loading: boolean
  signOut: () => Promise<void>
}

const MENU: MainMenuItem[] = [
  { type: 'products', label: 'SẢN PHẨM', path: FRONTEND_PATH.products },
  { type: 'brands', label: 'THƯƠNG HIỆU', path: FRONTEND_PATH.brands },
  { type: 'news', label: 'TIN TỨC', path: FRONTEND_PATH.news },
  { type: 'promotions', label: 'KHUYẾN MÃI', path: FRONTEND_PATH.collectionDetail('khuyen-mai') },
  { type: 'contact', label: 'LIÊN HỆ', path: FRONTEND_PATH.contact },
]

const TWO_LAST = ['KHUYẾN MÃI', 'LIÊN HỆ']

const menuBarVariants: Variants = {
  idle: {
    width: 'calc(min(var(--breakpoint-2xl), 100vw))',
    transition: {
      borderRadius: { delay: 0.1 },
    },
  },
  open: {
    width: 'min(var(--breakpoint-2xl), 100vw)',
  },
}

interface IMenuBarProps {
  menuData: ProductMenu
  searchSuggestions: ISearchSuggestions
}

const subMenuVariants: Variants = {
  closed: {
    maxHeight: 0,
    width: 'calc(min(var(--breakpoint-2xl), 100vw))',
    borderRadius: 0,
    transition: {
      duration: 0.15,
      ease: 'linear',
      opacity: {
        ease: 'easeOut',
      },
    },
  },
  open: {
    opacity: 1,
    maxHeight: '100dvh',
    width: 'min(var(--breakpoint-2xl), 100vw)',
    borderRadius: '0 0 8px 8px',
    transition: {
      duration: 0.15,
      type: 'tween',
      delay: 0.15,
    },
  },
}

const HeaderIcons = ({
  onMenuClick,
  setOpenSearch,
  setOpenUser,
  isOpen: open,
  isSearchOpen: openSearch,
  isUserOpen: openUser,
}: NavLinksProps) => (
  <div className={'flex items-center gap-4 max-lg:w-full max-lg:justify-between'}>
    <div className='size-5 block lg:hidden text-white [&_svg]:size-5' onClick={onMenuClick}>
      {open ? <X strokeWidth={2} /> : <Menu strokeWidth={2} />}
    </div>
    <div className="icons-wrapper flex flex-row gap-3">
      <Search
        strokeWidth={2}
        className='cursor-pointer hover:text-gray-400'
        onClick={() => setOpenSearch!(!openSearch)}
      />
      <User2Icon
        strokeWidth={2}
        className='cursor-pointer hover:text-gray-400'
        onClick={() => setOpenUser!(!openUser)}
      />
      <CartButton />
    </div>
  </div>
)

const NavLinks: React.FC<NavLinksProps> = ({ onMenuClick }) => (
  <div className='hidden md:flex gap-1 lg:gap-4 items-center'>
    {MENU.map((item, index) => {
      const ComponentTypeAndProp =
        item.path === FRONTEND_PATH.products
          ? {
              type: 'button' as const,
              onClick: (e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault()
                onMenuClick()
              },
            }
          : {
              type: Link,
              onClick: undefined,
            }
      return (
        <ComponentTypeAndProp.type
          key={index}
          href={item.path}
          onClick={ComponentTypeAndProp.onClick}
          className={cn(
            'cursor-pointer text-white text-base lg:text-lg hover:text-zinc-400 px-1',
            'before:block before:tracking-normal before:content-[attr(data-text)] before:font-bold before:h-0 before:overflow-hidden before:invisible',
            TWO_LAST.includes(item.label) ? 'hidden lg:block' : '',
          )}
          data-text={item.label}
        >
          {item.label}
        </ComponentTypeAndProp.type>
      )
    })}
  </div>
)

const FeaturedProduct = ({
  sectionData,
  className,
}: {
  sectionData: RightSection
  className: string
}) => {
  const { imageSrc, label, link } = sectionData
  return (
    <div className={className}>
      <div className='relative aspect-square w-full overflow-hidden rounded-lg'>
        <Image
          src={imageSrc ?? logo.src}
          alt={label}
          className='object-cover'
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          unoptimized
        />
        <div className='absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent space-y-2 h-48 flex flex-col justify-end'>
          <h4 className={cn(stylized.className, 'text-lg font-bold text-white')}>{label}</h4>
          <div className="link-wrapper">
            <Link href={link} className='inline-block text-white py-2 font-bold text-sm border-b border-white'>
              Mua ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const LeftSection = ({
  sectionItems,
  className,
}: {
  sectionItems: MenuItem[]
  className: string
}) => (
  <div className={className}>
    {sectionItems.map((item, index) =>
      item.type === 'header' ? (
        <div className='mb-4' key={`item-${index}`}>
          <h3
            key={`h3-${index}`}
            className='font-bold text-gray-900 mt-4 first:mt-0 mb-2'
          >
            {item.label}
          </h3>
          {item.subItems?.map((subItem, subIndex) => (
            <a
              key={`subItem-${index}-${subIndex}`}
              href={subItem.link}
              className='block text-gray-600 transition-colors hover:text-gray-900 mb-2'
            >
              {subItem.label}
            </a>
          ))}
        </div>
      ) : (
        <a
          key={`subItem-${index}`}
          href={item.link}
          className='block text-gray-600 transition-colors hover:text-gray-900 mb-4'
        >
          {item.label}
        </a>
      ),
    )}
  </div>
)

const MainSection = ({
  sectionItems,
  className,
}: {
  sectionItems: MenuItem[]
  className: string
}) => {
  // Create 3 columns of items
  const columns = [[], [], []] as MenuItem[][]

  sectionItems.forEach((item, index) => {
    const columnIndex = index % 3
    columns[columnIndex].push(item)
  })

  return (
    <div className={className}>
      <div className='flex gap-8'>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className='flex-1 space-y-6'>
            {column.map((item, index) => {
              if (item.type === 'header') {
                return (
                  <h3 key={`${columnIndex}-${index}`} className='font-bold text-gray-900 mb-4'>
                    {item.label}
                  </h3>
                )
              }
              return (
                <div key={`${columnIndex}-${index}`}>
                  <a
                    href={item.link}
                    className='font-bold text-gray-900 mb-2 block'
                  >
                    {item.label}
                  </a>
                  {item.subItems && item.subItems.length > 0 && (
                    <div className='space-y-2'>
                      {item.subItems.map((subItem, subIndex) => (
                        <a
                          key={`${columnIndex}-${index}-${subIndex}`}
                          href={subItem.link}
                          className='block text-gray-600 transition-colors hover:text-gray-900'
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

const DesktopMenu = ({ menuData }: { menuData: ProductMenu }) => (
  <motion.div
    className={'lg:grid-cols-12 lg:gap-8 gap-0 lg:grid hidden md:border-gray-100   border-t border-gray-300'}
  >
    <LeftSection
      className='lg:col-span-2 py-6 pl-8 pr-0 border-r border-gray-300'
      sectionItems={menuData.leftSection}
    />
    <MainSection className='lg:col-span-6 py-6' sectionItems={menuData.mainSection} />
    <FeaturedProduct className='lg:col-span-4 py-6 pl-0 pr-8' sectionData={menuData.rightSection} />
  </motion.div>
)

const SubMenuPanel = ({
  isOpen,
  closePanel,
  children,
}: React.PropsWithChildren & {
  isOpen: boolean
  closePanel: () => void
}) => {
  return (
    <motion.div
      className='w-full h-full bg-white absolute top-0 left-0 pt-3'
      initial='close'
      animate={isOpen ? 'open' : 'close'}
      variants={{
        close: { translateX: '100%' },
        open: { translateX: 0, transition: { ease: 'easeOut' } },
      }}
    >
      {children}
      <div className='w-full h-24 absolute bottom-0 bg-linear-to-t from-white from-70% to-transparent'>
        <button
          className='size-12 left-1/2 -translate-x-1/2 bottom-10 absolute bg-gray-900 rounded-full'
          onClick={closePanel}
        >
          <ChevronLeftIcon className='h-full w-full text-white p-2' />
        </button>
      </div>
    </motion.div>
  )
}

const ProductsMobileMenuItem = ({
  item,
  onClick,
}: {
  item: MainMenuItem
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => (
  <button onClick={onClick}>
    {item.label}
    <ChevronRightIcon className='size-5 inline-flex ml-2 align-baseline' />
  </button>
)

const MobileMenuItem = ({
  item,
  onClick,
}: {
  item: MainMenuItem
  onClick: React.MouseEventHandler<HTMLAnchorElement>
}) => {
  return (
    <Link href={item.path} onClick={onClick}>
      {item.label}
    </Link>
  )
}

const MobileMenu = ({
  menu,
  menuData,
  isOpen,
  setOpen,
}: {
  menu: MainMenuItem[]
  menuData: ProductMenu
  isOpen: boolean
  setOpen: (openStatus: boolean) => void
}) => {
  const [isProductsOpen, setIsProductsOpen] = React.useState<boolean>(false)
  const [subProductMenuItem, setSubProductMenuItem] = React.useState<MenuItem | null>(null)
  const AllSubMenus = [...menuData.leftSection, ...menuData.mainSection]

  React.useEffect(() => {
    if (isOpen) return

    setIsProductsOpen(false)
    setSubProductMenuItem(null)
  }, [isOpen])

  return (
    <motion.div
      id='mobile-menu-wrapper'
      className='transition-all bg-white lg:hidden h-[max(calc(100dvh-15rem),32rem)] border-t border-gray-300 relative'
    >
      <motion.ul
        className='pt-3'
        initial='hidden'
        animate={isOpen ? 'visible' : 'hidden'}
        exit='hidden'
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.2,
              duration: 0.1,
            },
          },
        }}
      >
        {menu.map((item, index) => (
          <motion.li
            key={`mobile-${index}`}
            className={cn(
              stylized.className,
              'text-gray-950 cursor-pointer font-medium text-2xl hover:text-zinc-400 m-5',
              'before:block before:tracking-normal before:content-[attr(data-text)] before:font-bold before:h-0 before:overflow-hidden before:invisible',
            )}
            variants={{
              hidden: { y: -20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
              exit: { y: 20, opacity: 0 },
            }}
            data-text={item.label}
          >
            {item.path === FRONTEND_PATH.products ? (
              <ProductsMobileMenuItem
                item={item}
                onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  event.preventDefault()
                  setIsProductsOpen(true)
                }}
              />
            ) : (
              <MobileMenuItem item={item} onClick={(_event) => setOpen(false)} />
            )}
          </motion.li>
        ))}

        <div className='w-full h-24 absolute bottom-0 bg-linear-to-t from-white to-transparent'>
          <button
            className='size-12 left-1/2 -translate-x-1/2 bottom-10 absolute bg-gray-900 rounded-full'
            onClick={() => setOpen(false)}
          >
            <X className='h-full w-full text-white p-2' />
          </button>
        </div>
      </motion.ul>
      <SubMenuPanel isOpen={isProductsOpen} closePanel={() => setIsProductsOpen(false)}>
        <h3 className={`text-2xl m-5 font-medium text-gray-900 ${stylized.className}`}>
          Sản Phẩm
        </h3>
        <ul className='h-[calc(100%-7.5rem)] overflow-y-scroll [&>li:last-child]:mb-12 space-y-5'>
          {AllSubMenus.map((subMenu, idx) => {
            const liClassName = cn( 'text-gray-950 cursor-pointer text-lg mx-5')
            if (subMenu.link && (!subMenu.subItems || subMenu.subItems.length == 0)) {
              return (
                <li key={idx} className={liClassName}>
                  <Link href={subMenu.link}>{subMenu.label}</Link>
                </li>
              )
            }

            return (
              <li key={idx} className={liClassName} onClick={() => setSubProductMenuItem(subMenu)}>
                {subMenu.label}
                <ChevronRightIcon className='size-3 inline-flex ml-2 align-baseline' />
              </li>
            )
          })}
        </ul>
      </SubMenuPanel>
      <SubMenuPanel
        isOpen={subProductMenuItem != null}
        closePanel={() => setSubProductMenuItem(null)}
      >
        <h3 className={`text-2xl m-5 font-medium text-gray-900 ${stylized.className}`}>
          {subProductMenuItem?.link ? (
            <Link href={subProductMenuItem?.link}>{subProductMenuItem?.label}</Link>
          ) : (
            subProductMenuItem?.label
          )}
        </h3>
        <ul>
          {subProductMenuItem?.subItems?.map((subItem, subItemIdx) => (
            <li
              key={`subItem-${subItemIdx}`}
              className={'text-gray-950 cursor-pointer text-lg m-5'}
            >
              <Link href={subItem.link}>{subItem.label}</Link>
            </li>
          ))}
        </ul>
      </SubMenuPanel>
    </motion.div>
  )
}

const NotSignedInMenu = () => (
  <motion.div
    className={cn(

      'w-full pb-3 lg:grid-cols-1 gap-0 lg:grid md:border-gray-100 border-t border-gray-300',
    )}
  >
    <div className=''>
      <h3 className={cn(stylized.className, 'font-bold text-gray-900 text-lg p-4 pb-0')}>
        Trang cá nhân
      </h3>
      <hr className='my-4 text-gray-400' />
      <div className='space-y-3.5'>
        <Link href={FRONTEND_PATH.signIn} className='text-gray-900 hover:text-gray-800 transition block px-4'>
          Đăng nhập / Đăng ký
        </Link>
        <Link
          href={FRONTEND_PATH.orderTracking}
          className='text-gray-900 hover:text-gray-800 transition block px-4'
        >
          Theo dõi đơn hàng
        </Link>
      </div>
    </div>
  </motion.div>
)

const SignedInMenu = ({ user, loading, signOut }: SignedInMenuProps) => {
  if (loading) {
    return (
      <div className='flex items-center justify-center h-32'>
        <span className='text-gray-500'>Đang xử lý...</span>
      </div>
    )
  }

  return (
    <motion.div
      className={cn(

        'w-full pb-3 lg:grid-cols-1 gap-0 lg:grid md:border-gray-100 border-t border-gray-300',
      )}
    >
      <div className=''>
        <h3 className={cn(stylized.className, 'font-bold text-gray-900 text-lg p-4 pb-0')}>
          Xin chào, {user.name ? user.name.toLocaleUpperCase() : 'Người dùng'}!
        </h3>
        <hr className='my-4 text-gray-400' />
        <div className='space-y-3.5'>
          <Link
            href={FRONTEND_PATH.viewProfile}
            className='text-gray-900 hover:text-gray-800 transition block px-4'
          >
            Thông tin cá nhân
          </Link>
          <Link
            href={FRONTEND_PATH.orderTracking}
            className='text-gray-900 hover:text-gray-800 transition block px-4'
          >
            Theo dõi đơn hàng
          </Link>
          <button
            type='button'
            className='text-gray-900 hover:text-gray-800 transition block px-4 w-full text-left cursor-pointer'
            onClick={signOut}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const MenuBar = ({ menuData, searchSuggestions }: IMenuBarProps) => {
  const authUser = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)
  const signOut = useAuthStore((state) => state.signOut)
  const clearCart = useCartStore((state) => state.clearCart)
  const initializeCart = useCartStore((state) => state.initializeCart)

  // Local state for user to handle SSR limitations and event-based updates
  const [user, setUser] = React.useState<IUser | null>(authUser)

  const [menuState, setMenuState] = React.useState<MenuState>({
    menu: false,
    search: false,
    user: false,
  })
  const [isChrome, setIsChrome] = React.useState(false)
  const [menuSticky, setMenuSticky] = React.useState<boolean>(false)
  const [mounted, setMounted] = React.useState(false)
  const pathname = usePathname()

  // Handle /index path for homepage
  const renderedPathname = pathname === '/index' ? FRONTEND_PATH.root : pathname

  // Listen for auth state changes via custom events
  React.useEffect(() => {
    const handleAuthStateChange = (event: CustomEvent) => {
      setUser(event.detail.user)
    }

    window.addEventListener('authStateChange', handleAuthStateChange as EventListener)
    return () =>
      window.removeEventListener('authStateChange', handleAuthStateChange as EventListener)
  }, [])

  // Sync with auth context user on mount and when it changes
  React.useEffect(() => {
    setUser(authUser)
  }, [authUser])

  const isAnyOpen = menuState.menu || menuState.search || menuState.user

  const subMenuBarVariants = {
    closed: {
      opacity: mounted && isChrome ? 0 : 1,
      ...subMenuVariants.closed,
    },
    open: {
      opacity: 1,
      ...subMenuVariants.open,
    },
  }

  const handleOpenMenu = (openStatus: boolean) => {
    setMenuState((prev) => ({ ...prev, menu: openStatus, search: false, user: false }))
  }

  const handleOpenSearch = (openStatus: boolean) => {
    setMenuState((prev) => ({ ...prev, search: openStatus, menu: false, user: false }))
  }

  const handleOpenUser = (openStatus: boolean) => {
    setMenuState((prev) => ({ ...prev, user: openStatus, menu: false, search: false }))
  }

  const handleClose = () => {
    setMenuState({ menu: false, search: false, user: false })
  }

  const handleSignOut = async () => {
    try {
      clearCart()
      await signOut()
      await initializeCart(true)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleMenu = () => handleOpenMenu(!menuState.menu)
  const { scrollDir, scrollPosition } = useThrottledScroll(20, 100)
  const menuBarWrapper = React.useRef(null)

  const scrollUpStyling = React.useMemo(() => {
    return isAnyOpen || scrollDir != 'down' || (scrollPosition?.top ?? 0) < 100
      ? 'data-not-root-path:lg:max-h-24'
      : 'data-not-root-path:lg:max-h-0'
  }, [scrollDir, isAnyOpen, scrollPosition?.top])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.chrome !== 'undefined') {
      setIsChrome(true)
    }

    const stickyElm = document.querySelector('#main-menu')
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 1) {
          setMenuSticky(true)
        } else setMenuSticky(false)
      },
      { threshold: [1] },
    )

    if (stickyElm) observer.observe(stickyElm)

    return () => {
      if (stickyElm) observer.unobserve(stickyElm)
    }
  }, [renderedPathname])

  React.useEffect(() => {
    document.body.style.overflow = isAnyOpen ? 'hidden' : ''
  }, [isAnyOpen])

  React.useEffect(() => {
    setMenuState({ menu: false, search: false, user: false })
  }, [renderedPathname])

  return (
    <header id='main-menu' className='h-0 z-50 sticky -top-px'>
      <div
        className={cn('w-full', isAnyOpen ? 'min-h-[calc(100dvh-4rem)]' : '')}
        ref={menuBarWrapper}
        onClick={(e) => e.target === menuBarWrapper.current && handleClose()}
      >
        <AnimatePresence mode='sync'>
          <motion.div
            data-pathname={renderedPathname}
            className={cn(
              'data-not-root-path:lg:w-full data-not-root-path:lg:transition-all data-not-root-path:lg:overflow-hidden data-not-root-path:lg:duration-300 data-not-root-path:lg:ease-in-out lg:bg-white data-not-root-path:lg:shadow',
              scrollUpStyling,
            )}
          >
            <motion.nav
              id='menu-bar-nav'
              data-pathname={renderedPathname}
              className={'flex flex-row max-w-screen-2xl mx-auto transition-all'}
              initial='idle'
              animate={isAnyOpen ? 'open' : 'idle'}
              variants={menuBarVariants}
              transition={{ duration: 0.15, ease: 'easeIn' }}
            >
              <div
                data-sticky={menuSticky ? 'true' : 'false'}
                data-menu-open={isAnyOpen ? 'true' : 'false'}
                className={
                  cn(
                    'flex w-full items-center justify-between px-4 bg-zinc-900 relative lg:h-22 h-20 text-white',
                    'data-[sticky=true]:lg:shadow-none data-[sticky=true]:shadow-md',
                  )
                }
              >
                <Link href='/' className='absolute left-1/2 -translate-x-1/2'>
                  <Image alt='Logo Vinyl Sài Gòn' src={logo} className='lg:h-16 h-12' unoptimized />
                </Link>
                <NavLinks onMenuClick={toggleMenu} />
                <HeaderIcons
                  onMenuClick={toggleMenu}
                  setOpenSearch={handleOpenSearch}
                  setOpenUser={handleOpenUser}
                  isOpen={menuState.menu}
                  isSearchOpen={menuState.search}
                  isUserOpen={menuState.user}
                />
              </div>
            </motion.nav>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>
          <motion.div
            className='transition-all mx-auto overflow-clip shadow z-10'
            variants={subMenuBarVariants}
            initial='closed'
            animate={menuState.menu ? 'open' : 'closed'}
          >
            <motion.div className='w-full max-w-screen-2xl bg-white'>
              <DesktopMenu menuData={menuData} />
              <MobileMenu
                menu={MENU}
                menuData={menuData}
                isOpen={menuState.menu}
                setOpen={handleOpenMenu}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            className='transition-all mx-auto overflow-clip shadow z-10'
            variants={subMenuBarVariants}
            initial='closed'
            animate={menuState.search ? 'open' : 'closed'}
          >
            <motion.div className='w-full max-w-screen-2xl bg-white flex justify-center'>
              <SearchPanel
                isOpen={menuState.search}
                closeSearch={handleClose}
                searchSuggestions={searchSuggestions}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          <motion.div
            className='transition-all mx-auto overflow-clip z-10 rounded-none'
            variants={subMenuBarVariants}
            initial='closed'
            animate={menuState.user ? 'open' : 'closed'}
          >
            <motion.div className='w-full lg:w-[min(100vw,400px)] ml-auto bg-white rounded-b-md border border-gray-200'>
              {user ? (
                <SignedInMenu user={user} loading={loading} signOut={handleSignOut} />
              ) : (
                <NotSignedInMenu />
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </header>
  )
}

export default MenuBar
