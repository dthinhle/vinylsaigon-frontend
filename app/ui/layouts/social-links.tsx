import Image from 'next/image'
import Link from 'next/link'

const SocialLinks = ({ links }: { links: Array<{ icon: string; url: string; name?: string }> }) => {
  return (
    <div className='flex flex-row gap-3'>
      {links.map((social, index) => {
        return (
          <Link key={index} href={social.url || '/'} target='_blank'>
            <Image
              src={social.icon}
              alt={social.name || `Liên kết mạng xã hội ${index + 1}`}
              className='w-8 h-8'
              unoptimized
            />
          </Link>
        )
      })}
    </div>
  )
}

export default SocialLinks
