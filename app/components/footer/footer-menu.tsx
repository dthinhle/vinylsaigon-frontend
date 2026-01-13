'use client'

import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useState } from 'react'

type MenuItem = {
  label: string
  url: string
}

type FooterMenuProps = {
  title: string
  items: MenuItem[]
}

const FooterMenu: React.FC<FooterMenuProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='footer-menu w-full lg:w-auto'>
      <div
        className='flex justify-between items-center cursor-pointer lg:cursor-default py-2 lg:py-0 mb-0 lg:mb-4'
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className='text-xl font-bold'>{title}</h3>
        <div className='size-6 text-black font-bold [&_svg]:size-6 lg:hidden'>
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
      </div>

      <div
        className={`${isOpen ? 'max-h-96' : 'max-h-0 lg:max-h-96'} overflow-hidden transition-all duration-300 ease-in-out lg:block lg:border-b-0 border-b border-gray-200`}
      >
        <ul className='space-y-2 mb-3'>
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.url}
                className='relative inline-block text-black after:absolute after:bottom-0 after:left-0 after:h-[1px]
                  after:w-0 after:bg-gray-900 after:transition-width after:duration-300 hover:after:w-full'
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default FooterMenu
