import prismadb from '@/lib/prismadb';

export default async function BrandChoiceOld() {
  const brandImagesSBAudience = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    },
    select: {
      homepage_brand_choice_url: true,
      homepage_brand_choice_text: true
    }
  })
  const brandImagesSBAutomotive = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID
    },
    select: {
      homepage_brand_choice_url: true,
      homepage_brand_choice_text: true
    }
  })
  if(!brandImagesSBAudience || brandImagesSBAudience.homepage_brand_choice_url === ''){
    return null
  }
  if(!brandImagesSBAutomotive || brandImagesSBAutomotive.homepage_brand_choice_url === ''){
    return null
  }
  return (
    <div
  style={{
    display: "grid",
    gridTemplateColumns: "3fr 2fr",
  }}
>
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      height: "50vh",
    }}
  >
    <h2
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
      }}
    >
      Explore Our Brands: SB Audience
    </h2>

    <div
      style={{
        position: "relative",
        width: "100%",
        height: "50vh",
        display: "flex",
        alignItems: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <img
        src={
          brandImagesSBAudience.homepage_brand_choice_url.startsWith(
            "/uploads/"
          )
            ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImagesSBAudience.homepage_brand_choice_url}`
            : brandImagesSBAudience.homepage_brand_choice_url
        }
        alt="SB Audience"
        width="1000"
        height="1000"
        fetchPriority="high"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "33.333%",
          height: "100%",
          background:
            "linear-gradient(to left, #18181b, transparent)",
        }}
      />

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "100%",
          padding: "0 64px 32px",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            width: "66.667%",
          }}
        >
          <div
            style={{
              width: "100%",
              paddingBottom: "16px",
            }}
          >
            <img
              src="/images/sbacoustics/logo_sbaudience.png"
              alt="SB Audience Logo"
              width="500"
              height="500"
              fetchPriority="high"
              style={{
                width: "50%",
                height: "auto",
              }}
            />
          </div>

          <div
            style={{
              display: "none",
              paddingBottom: "16px",
              color: "#ffffff",
              fontSize: "14px",
              textAlign: "left",
            }}
          >
            {/* {brandImagesSBAudience.homepage_brand_choice_text} */}
          </div>

          <div
            style={{
              paddingBottom: "16px",
              textAlign: "left",
            }}
          >
            <a
              href="/sbaudience"
              style={{
                display: "inline-block",
                padding: "8px 16px",
                color: "#ffffff",
                backgroundColor: "#e6001b",
                textDecoration: "none",
                fontSize: "14px",
                borderRadius: "0.25rem"
              }}
            >
              Go to pro drivers
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    style={{
      position: "relative",
      display: "block",
      overflow: "hidden",
      height: "50vh",
      backgroundColor: "#18181b",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "0 64px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          width: "66.667%",
        }}
      >
        <div
          style={{
            color: "#ffffff",
            fontSize: "14px",
            textAlign: "left",
          }}
        >
          {brandImagesSBAudience.homepage_brand_choice_text}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
