'use client'

import MenuBar from '@/app/components/menu-bar/menu-bar'
import { ISearchSuggestions, ProductMenu } from '@/app/components/menu-bar/menu-data'

type HeaderProps = {
  menuData: ProductMenu
  searchSuggestions: ISearchSuggestions
}

const Header = ({ menuData, searchSuggestions }: HeaderProps) => {
  return (
    <>
      <MenuBar menuData={menuData} searchSuggestions={searchSuggestions} />
    </>
  )
}

export default Header
