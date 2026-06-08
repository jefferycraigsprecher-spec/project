import StatusBadge from '@/components/ui/StatusBadge'

interface ProfessionalStatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

export default function ProfessionalStatusBadge({ status, size = 'md' }: ProfessionalStatusBadgeProps) {
  return <StatusBadge status={status} size={size} />
}
