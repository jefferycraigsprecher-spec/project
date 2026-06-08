type MidwestLogoProps = {
  size?: 'small' | 'medium' | 'large'
}

const sizes = {
  small: 'h-8 w-auto text-2xl',
  medium: 'h-10 w-auto text-3xl',
  large: 'h-12 w-auto text-4xl',
}

export default function MidwestLogo({ size = 'medium' }: MidwestLogoProps) {
  return (
    <div className={`inline-flex items-center font-bold tracking-tight text-slate-900 ${sizes[size]}`}>
      <span className="mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-white text-base font-black">
        M
      </span>
      <span className="text-inherit">Midwest</span>
    </div>
  )
}
