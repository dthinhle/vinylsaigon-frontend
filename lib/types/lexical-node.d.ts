type ContentFormat = '' | number
type RootDirection = 'ltr' | 'rtl' | null
type NodeDirection = 'ltr' | 'rtl' | null

export interface BaseNode {
  version: number
  format: ContentFormat
  indent: number
  direction: NodeDirection
}

export interface SkeletonNode {
  type: 'skeleton'
  version: number
}

export interface LinebreakNode {
  type: 'linebreak'
  version: number
}

export interface TextNode extends BaseNode {
  type: 'text'
  text: string
  style: string
  detail: number
  mode: 'normal' | 'token' | 'segmented'
  textStyle: string
}

export interface ImageNode extends BaseNode {
  type: 'image'
  src: string
  width: string | number
  height: string | number
  altText: string
}

export interface LinkNode extends BaseNode {
  type: 'link'
  url: string
  rel: string | null
  target: string | null
  title: string | null
  children: Array<TextNode | ImageNode>
}

export interface ParagraphNode extends BaseNode {
  type: 'paragraph'
  children: Array<TextNode | ImageNode | LinkNode | ParagraphNode | HeadingNode | ListNode>
  textStyle: string
  textFormat: number
}

export interface HeadingNode extends BaseNode {
  type: 'heading'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: Array<TextNode | ImageNode | LinkNode>
}

export interface ListItemNode extends BaseNode {
  type: 'listitem'
  value: number
  children: Array<TextNode | HeadingNode | LinkNode | ParagraphNode>
  listType: 'bullet' | 'number'
  start: number
}

export interface ListNode extends BaseNode {
  type: 'list'
  listType: 'bullet' | 'number'
  start: number
  tag: 'ul' | 'ol'
  children: Array<ListItemNode>
}

export interface VideoNode extends BaseNode {
  type: 'video'
  src: string
}

export interface YouTubeNode extends BaseNode {
  type: 'youtube'
  videoID: string
}

export type ElementNode =
  | ParagraphNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | LinkNode
  | ImageNode
  | VideoNode
  | YouTubeNode
  | SkeletonNode

export interface RootNode {
  type: 'root'
  direction: RootDirection
  format: ContentFormat
  indent: number
  version: number
  children: Array<ElementNode>
}

export interface LexicalContent {
  root: RootNode
}
