export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<div className="relative h-full w-full">
  {/* <div className="absolute inset-0 bg-linear-to-b from-primary/30 to-secondary"></div> */}
  <div className="absolute inset-0 bg-[url('/images/admin/home-admin.png')] bg-cover bg-center ">
  </div>
  <div className="relative z-10 flex items-center justify-center h-full w-full">
    {children}
  </div>
</div>
  );
};
