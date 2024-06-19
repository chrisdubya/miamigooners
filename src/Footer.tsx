import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center py-8 text-gooner-red gap-2">
      <div>© {new Date().getFullYear()} Miami Gooners</div>
      <div>
        <Link
          href={'mailto:info@miamigooners.com'}
          className="hover:text-white transition-colors"
        >
          info@miamigooners.com
        </Link>
      </div>
    </footer>
  )
}
