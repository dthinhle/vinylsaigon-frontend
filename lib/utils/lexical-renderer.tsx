import {
  BaseNode,
  type ElementNode,
  type HeadingNode,
  type ImageNode,
  type LexicalContent,
  type LinebreakNode,
  type LinkNode,
  type ListItemNode,
  type ListNode,
  type ParagraphNode,
  type TextNode,
  type VideoNode,
  type YouTubeNode,
} from '@/lib/types/lexical-node'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'

export const FORMAT_CONSTANTS = {
  NORMAL: 0,
  BOLD: 1,
  ITALIC: 2,
  ITALIC_BOLD: 3,
  UNDERLINE_BOLD: 9,
  UNDERLINE_ITALIC: 10,
  UNDERLINE_ITALIC_BOLD: 11,
} as const

function getTextStyle(format?: number | string): string {
  if (!format || typeof format !== 'number') return ''

  switch (format) {
    case FORMAT_CONSTANTS.BOLD:
      return 'font-bold'
    case FORMAT_CONSTANTS.ITALIC:
      return 'italic'
    case FORMAT_CONSTANTS.ITALIC_BOLD:
      return 'font-bold italic'
    case FORMAT_CONSTANTS.UNDERLINE_BOLD:
      return 'font-bold underline'
    case FORMAT_CONSTANTS.UNDERLINE_ITALIC:
      return 'italic underline'
    case FORMAT_CONSTANTS.UNDERLINE_ITALIC_BOLD:
      return 'font-bold italic underline'
    default:
      return ''
  }
}

function renderTextNode(node: TextNode, key: number): ReactNode {
  const className = getTextStyle(node.format)
  return (
    <span key={key} className={className}>
      {node.text}
    </span>
  )
}

function renderImageNode(node: ImageNode, key: number): ReactNode {
  const width = typeof node.width === 'string' ? node.width : `${node.width}px`
  const height = typeof node.height === 'string' ? node.height : `${node.height}px`

  return (
    <Image
      key={key}
      src={node.src}
      alt={node.altText || ''}
      width={node.width === '100%' ? 800 : Number(node.width) || 800}
      height={node.height === 'auto' ? 600 : Number(node.height) || 600}
      className='w-full h-auto'
      style={{
        maxWidth: width === '100%' ? '100%' : width,
        height: height === 'auto' ? 'auto' : height,
      }}
      unoptimized
    />
  )
}

function renderLinkNode(node: LinkNode, key: number): ReactNode {
  return (
    <Link
      key={key}
      href={node.url}
      target={node.target || undefined}
      rel={node.rel || undefined}
      title={node.title || undefined}
      className='text-sea-buckthorn-500 hover:text-sea-buckthorn-700 transition-colors'
    >
      {node.children.map((child, i) => renderInlineNode(child, i))}
    </Link>
  )
}

function renderInlineNode(
  node: TextNode | ImageNode | LinkNode | LinebreakNode,
  key: number,
): ReactNode {
  switch (node.type) {
    case 'text':
      return renderTextNode(node, key)
    case 'image':
      return renderImageNode(node, key)
    case 'link':
      return renderLinkNode(node, key)
    case 'linebreak':
      return <div className={'mb-2'} key={key}></div>
    default:
      return null
  }
}

function renderParagraphNode(node: ParagraphNode, key: number): ReactNode {
  if (node.children.length === 0) {
    return <br key={key} />
  }

  // Check if children are all inline nodes or contains element nodes
  const hasElementChildren = node.children.some(child =>
    ['paragraph', 'heading', 'list'].includes(child.type),
  )

  // If it has element children, render them directly without wrapping in <p>
  if (hasElementChildren) {
    return (
      <div key={key}>
        {node.children.map((child, i) => {
          if (child.type === 'paragraph') {
            return renderParagraphNode(child as ParagraphNode, i)
          } else if (child.type === 'heading') {
            return renderHeadingNode(child as HeadingNode, i)
          } else if (child.type === 'list') {
            return renderListNode(child as ListNode, i)
          } else {
            return renderInlineNode(child as TextNode | ImageNode | LinkNode | LinebreakNode, i)
          }
        })}
      </div>
    )
  }
  const NodeTag = node.children.some(child => child.type !== 'text') ? 'div' : 'p'

  if (node.children.every(n => n.type === 'text' && (n as TextNode).text.trim() === '')) {
    return null
  }

  // Normal paragraph with only inline children
  return (
    <NodeTag key={key} className='mb-4'>
      {node.children.map((child, i) => renderInlineNode(child as TextNode | ImageNode | LinkNode | LinebreakNode, i))}
    </NodeTag>
  )
}

function renderHeadingNode(node: HeadingNode, key: number): ReactNode {
  const Tag = node.tag
  const headingClasses = {
    h1: 'lg:text-4xl text-3xl font-bold mb-6 mt-8',
    h2: 'lg:text-3xl text-2xl font-bold mb-5 mt-7',
    h3: 'lg:text-2xl text-xl font-bold mb-4 mt-6',
    h4: 'lg:text-xl text-lg font-bold mb-3 mt-5',
    h5: 'lg:text-lg text-[17px] font-bold mb-2 mt-4',
    h6: 'lg:text-base font-bold mb-2 mt-3',
  }

  return (
    <Tag key={key} className={headingClasses[node.tag]}>
      {node.children.map((child, i) => renderInlineNode(child, i))}
    </Tag>
  )
}

function renderListItemNode(node: ListItemNode, key: number): ReactNode {
  return (
    <li key={key} className='mb-2'>
      {node.children.map((child, i) => {
        switch (child.type) {
          case 'paragraph':
            return renderParagraphNode(child as ParagraphNode, i)
          case 'heading':
            return renderHeadingNode(child as HeadingNode, i)
        }
        return renderInlineNode(child as TextNode | ImageNode | LinkNode, i)
      })}
    </li>
  )
}

function renderListNode(node: ListNode, key: number): ReactNode {
  const Tag = node.listType === 'bullet' ? 'ul' : 'ol'
  const listClass = node.listType === 'bullet' ? 'list-disc pl-6 mb-4' : 'list-decimal pl-6 mb-4'

  return (
    <Tag key={key} className={listClass}>
      {node.children.map((child, i) => renderListItemNode(child, i))}
    </Tag>
  )
}

function renderVideoNode(node: VideoNode, key: number): ReactNode {
  return (
    <div key={key} className='relative w-full mb-4 aspect-video'>
      <video
        className='absolute top-0 left-0 w-full h-full'
        src={node.src}
        title='YouTube video'
        controls
        controlsList='nodownload'
        preload='metadata'
      />
    </div>
  )
}

function renderYouTubeNode(node: YouTubeNode, key: number): ReactNode {
  return (
    <div key={key} className='relative w-full mb-4 aspect-video'>
      <iframe
        className='absolute top-0 left-0 w-full h-full'
        src={`https://www.youtube.com/embed/${node.videoID}`}
        title='YouTube video'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    </div>
  )
}

const ElementNodeRenderer = ({ node, index }: { node: ElementNode; index: number }) => {
  switch (node.type) {
    case 'paragraph':
      return renderParagraphNode(node, index)
    case 'heading':
      return renderHeadingNode(node, index)
    case 'list':
      return renderListNode(node, index)
    case 'listitem':
      return renderListItemNode(node, index)
    case 'link':
      return renderLinkNode(node, index)
    case 'image':
      return renderImageNode(node, index)
    case 'video':
      return renderVideoNode(node, index)
    case 'youtube':
      return renderYouTubeNode(node, index)
    case 'skeleton':
    default:
      return null
  }
}

const parseContent = (content: string | LexicalContent): LexicalContent => {
  try {
    if (typeof content !== 'string' && 'root' in content) {
      return content
    }
    return JSON.parse(content)
  } catch (error) {
    if (error instanceof SyntaxError) {
       const baseNodePropeties: BaseNode & { version?: number } = {
      format: 0,
      version: 1,
      indent: 0,
      direction: 'ltr',
    }
    return {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: content as string,
                style: 'normal',
                detail: 0,
                mode: 'normal',
                textStyle: 'normal',
                ...baseNodePropeties,
              },
            ],
            textStyle: 'normal',
            textFormat: 0,
            ...baseNodePropeties,
          },
        ],
        ...baseNodePropeties,
      },
    }
    } else {
      console.warn('Failed to parse lexical content:', error)
      throw error
    }
  }
}

export const LexicalContentRenderer = ({ content }: { content: LexicalContent }) => {

  const parsedContent = parseContent(content)
  if (!parsedContent?.root?.children || parsedContent.root.children.length === 0) {
    return null
  }

  return (
    <>
      {parsedContent.root.children.map((node: ElementNode, i: number) => (
        <ElementNodeRenderer node={node} index={i} key={i} />
      ))}
    </>
  )
}

function extractTextFromNode(node: any): string {
  if (node.type === 'text') {
    return node.text
  }
  if (node.type === 'linebreak') {
    return '\n'
  }
  if (node.children && Array.isArray(node.children)) {
    const childrenContent = node.children.map((child: any) => extractTextFromNode(child))
    if (node.type === 'list') {
      return childrenContent.join('\n')
    }
    return childrenContent.join('')
  }
  return ''
}

export const renderToPlainText = (content: LexicalContent | string, type = 'full' as 'full' | 'short'): string => {
  const parsedContent = parseContent(content)
  if (!parsedContent?.root?.children) {
    return ''
  }

 if (type === 'short') {
    return parsedContent.root.children
      .map((node: any) => extractTextFromNode(node))
      .join('\n\n').replace(/\n+/g, ' ').slice(0, 160).trim() + (parsedContent.root.children.length > 160 ? '...' : '')
 } else {
    return parsedContent.root.children
      .map((node: any) => extractTextFromNode(node))
      .join('\n\n')
  }
}

