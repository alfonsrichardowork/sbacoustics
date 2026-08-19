import prismadb from "@/lib/prismadb";

const HomeOld = async () => {
   const featuredProducts = await prismadb.product.findMany({
    where: {
      brandId: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID,
      isFeatured: true,
      isArchived: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      slug: true,
      featured_img_url: true,
      featuredDesc: true
    }
  })
return (
     <div
      style={{
        height: '30vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#22c55e',
        textAlign: 'center',
      }}
    >
        {featuredProducts && featuredProducts.length > 0 && <div>{featuredProducts[0]?.name ?? 'No featured product found'}</div>}
    </div>
  );
};

export default HomeOld;
