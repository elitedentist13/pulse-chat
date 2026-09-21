import { cn } from "@/lib/utils"
import type { Pet } from "@/lib/types"

const sizes = {
  sm: "size-8 rounded-xl",
  md: "size-12 rounded-2xl",
  lg: "size-16 rounded-[1.4rem]",
  xl: "size-28 rounded-[2rem]",
}

export function PetAvatar({
  pet,
  size = "md",
  className,
}: {
  pet: Pet
  size?: keyof typeof sizes
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-[#efe8dc]",
        sizes[size],
        className
      )}
      style={{ background: pet.color }}
      aria-hidden
    >
      {pet.portrait ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={pet.portrait} alt="" className="size-full object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center font-heading text-white">
          {pet.initials}
        </span>
      )}
    </div>
  )
}
