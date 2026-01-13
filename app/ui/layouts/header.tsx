'use client'

import MenuBar from '@/app/components/menu-bar/menu-bar'
import { ISearchSuggestions, ProductMenu } from '@/app/components/menu-bar/menu-data'
import TopHeader from '@/app/components/top-header/top-header'

type HeaderProps = {
  menuData: ProductMenu
  searchSuggestions: ISearchSuggestions
}

const Header = ({ menuData, searchSuggestions }: HeaderProps) => {
  return (
    <>
      <TopHeader />
      <MenuBar menuData={menuData} searchSuggestions={searchSuggestions} />
    </>
  )
}

export default Header
