import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'
import { CopySlash, Slash, SlashIcon, SlashSquare } from 'lucide-react'
import * as React from 'react'

export interface BreadcrumbNode {
  label: string
  link: string
}

interface BreadcrumbNavProps {
  nodes: BreadcrumbNode[]
  renderLastSeparator?: boolean
  classNames?: {
    root?: string
    item?: string
    link?: string
  }
}

export const BreadcrumbNav = ({ nodes, classNames, renderLastSeparator }: BreadcrumbNavProps) => {
  return (
    <Breadcrumb className={classNames?.root}>
      <BreadcrumbList>
        {nodes.map((node, idx, { length }) => (
          <React.Fragment key={`${node.label}-${idx}`}>
            <BreadcrumbItem className={cn(classNames?.item)}>
              <BreadcrumbLink
                className={cn(

                  'text-gray-300 hover:text-gray-500 lg:text-base text-sm font-medium invert-30',
                  classNames?.link,
                )}
                href={node.link}
              >
                {node.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {(renderLastSeparator ? idx <= length - 1 : idx < length - 1) && (
              <BreadcrumbSeparator>
                <Slash strokeWidth={2} className='text-gray-300 invert-30' />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
