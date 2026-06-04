export default function ProductLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return(
        <>
            <div className=" w-full items-end justify-start pt-16 bg-white">
                {children}
            </div>
        </>
    )
}