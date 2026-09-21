import { Skeleton } from "@/components/ui/skeleton"

export function ProductSkeleton() {
  return (
    <main className="2xl:px-60 xl:px-40 xl:py-8 lg:px-12 lg:py-6 px-8 py-4">
      <div className="block gap-8 md:flex">
        {/* Image column */}
        <section className="block w-full md:flex md:w-1/2 md:justify-center">
          <div className="hidden w-full flex-col pr-10 md:flex">
            <Skeleton className="aspect-square max-h-[750px] w-full rounded-lg" />
            <Skeleton className="mt-4 aspect-square max-h-[750px] w-full rounded-lg" />
            <Skeleton className="mt-4 aspect-square max-h-[750px] w-full rounded-lg" />
            <div className="pt-8">
              <Skeleton className="aspect-square max-h-[400px] w-full rounded-lg" />
              <Skeleton className="mt-4 h-[70px] w-full rounded-lg" />
            </div>
          </div>

          <div className="w-full pb-4 md:hidden">
            <Skeleton className="aspect-square max-h-[400px] w-full rounded-lg" />
          </div>
        </section>

        {/* Product information column */}
        <section className="block w-full md:flex md:w-1/2 md:justify-center">
          <div className="flex w-full flex-col">
            <Skeleton className="h-10 w-3/4 rounded-md" />

            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-5 w-24 rounded" />
              <Skeleton className="h-5 w-28 rounded" />
              <Skeleton className="h-5 w-32 rounded" />
            </div>

            <div className="mt-8 space-y-3">
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-11/12 rounded" />
              <Skeleton className="h-5 w-4/5 rounded" />
              <Skeleton className="h-5 w-10/12 rounded" />
            </div>

            <Skeleton className="mt-8 h-7 w-40 rounded" />
            <div className="mt-3 space-y-3">
              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-5 w-1/2 rounded" />
            </div>

            <div className="mt-8 space-y-4">
              <Skeleton className="h-12 w-64 rounded-md" />
              <Skeleton className="h-12 w-72 rounded-md" />
              <Skeleton className="h-12 w-60 rounded-md" />
            </div>

            <Skeleton className="mt-8 h-64 w-full rounded-lg" />
          </div>
        </section>
      </div>
    </main>
  )
}