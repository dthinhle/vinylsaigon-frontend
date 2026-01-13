import Link from 'next/link'

interface PhoneNumberProps {
  number: string
}

export const PhoneNumber: React.FC<PhoneNumberProps> = ({ number }) => {
  const formattedNumber = number.replace(/\D/g, '')

  return (
    <Link href={`https://zalo.me/${formattedNumber}`} target='_blank' rel='noopener noreferrer'>
      {number}
    </Link>
  )
}
