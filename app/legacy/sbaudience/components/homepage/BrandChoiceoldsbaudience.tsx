import prismadb from '@/lib/prismadb';
import '@/app/legacy/components/style/all-style.css'

export default async function BrandChoiceOldSBAudience() {
  const brandImagesSBAcoustics = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
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
  if(!brandImagesSBAcoustics || brandImagesSBAcoustics.homepage_brand_choice_url === ''){
    return null
  }
  if(!brandImagesSBAutomotive || brandImagesSBAutomotive.homepage_brand_choice_url === ''){
    return null
  }
  return (   
  <div className="brand-choice-parent">
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      height: "50vh",
    }}
  >

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
          brandImagesSBAcoustics.homepage_brand_choice_url.startsWith(
            "/uploads/"
          )
            ? `${process.env.NEXT_PUBLIC_ROOT_URL}${brandImagesSBAcoustics.homepage_brand_choice_url}`
            : brandImagesSBAcoustics.homepage_brand_choice_url
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
            "linear-gradient(to left, #e4e4e7, transparent)",
        }}
      />

      <div className="brand-choice-child"
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              paddingBottom: "16px",
            }}
          >
            <img
              src="/images/sbacoustics/logo_sbacoustics.png"
              alt="SB Acoustics Logo"
              width="500"
              height="500"
              fetchPriority="high"
              style={{
                display: "block",
                width: "50%",
                maxWidth: "250px",
                height: "auto",
              }}
            />
          </div>

          <div
            style={{
              paddingBottom: "16px",
            }}
          >
            <a
              href="/legacy"
              style={{
                display: "inline-block",
                boxSizing: "border-box",
                padding: "8px 16px",
                color: "#ffffff",
                backgroundColor: "#e6001b",
                textDecoration: "none",
                fontSize: "14px",
                borderRadius: "4px",
                whiteSpace: "nowrap",
              }}
            >
              Go to pro drivers
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="brand-choice-child-2-sbaudience"
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
            color: "#000000",
            fontSize: "14px",
            textAlign: "left",
          }}
        >
          {brandImagesSBAcoustics.homepage_brand_choice_text}
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
