
import '@/app/legacy/(sbacoustics)/about/about.css'
import SwiperCarouselAboutUsOld from "../../components/swipercarouselaboutusold";
import DOMPurify from 'isomorphic-dompurify'; 
import prismadb from "@/lib/prismadb";
import "@/app/css/styles.scss";

export default async function AboutUsSBAudience() {
  const allData = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID
    },
    select: {
      aboutUsImages: true,
      sbe_desc: true,
      brand_desc: true,
      mission_values_desc: true
    }
  })

  if(!allData) {
    return null
  }
  return (
    <>
      
      <div style={{ backgroundColor: "#ffffff" }}>

        
      {/* SB Audience Section */}
      <section className="about-us-section-parent">
        <div>
          <div className="about-us-section-parent-div">
            <div className="about-us-section-child-grid">
              <div className="about-us-section-first-order">
                <div className="about-us-section-first-head">
                  <h2 className="about-us-section-first-head-text">SB Audience</h2>
                </div>
                <div style={{
                  marginBlockStart: '24px',
                  marginBlockEnd: '24px',
                  color: '#475569'
                }}>
                  <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.brand_desc, {
                      ALLOWED_TAGS: [
                          'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                      ],
                      ALLOWED_ATTR: [
                          'href', 'target', 'rel', 'class', 'id', 'style'
                      ],
                  }) }}></h3>
                </div>
              </div>
              <div className="about-us-section-second-relative">
                <div className="about-us-section-second-relative-head">
                  <div className="about-us-section-second-relative-desc">SB Audience</div>
                </div>
                {/* <SwiperCarouselAboutUsOld images={[
                  {
                    src: "/images/sbacoustics/aboutus/SB_Acoustics_1.jpg",
                    alt: "SB Audience About Us 1"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_2.jpg",
                    alt:"SB Audience About Us 2"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_3.jpg",
                    alt:"SB Audience About Us 3"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_4.jpg",
                    alt:"SB Audience About Us 4"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_5.jpg",
                    alt:"SB Audience About Us 5"
                  }
                ]} /> */}
                <SwiperCarouselAboutUsOld 
                  images={allData.aboutUsImages
                    .filter((val) => val.type === 'BRAND').sort((a,b) => Number(a.priority) - Number(b.priority))
                    .map((val, index) => ({
                      src: val.url,
                      alt: `SB Acoustics About Us ${index + 1}`,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sinar Baja Electric Section */}
      <section className="about-us-section-parent-2">
        <div>
          <div className="about-us-section-parent-div">
            <div className="about-us-section-child-grid">
              <div>
                <div className="about-us-section-second-head">
                  <div className="about-us-section-first-head-text">Sinar Baja Electric</div>
                </div>
                {/* <SwiperCarouselAboutUsOld images={[
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_1.jpg",
                    alt:"Sinar Baja Electric About Us 1"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_2.jpg",
                    alt:"Sinar Baja Electric About Us 2"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_3.jpg",
                    alt:"Sinar Baja Electric About Us 3"
                  },
                  {
                    src: "/images/sbacoustics/aboutus/Sinar_baja_electric_4.jpg",
                    alt: "Sinar Baja Electric About Us 4"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_5.jpg",
                    alt:"Sinar Baja Electric About Us 5"
                  }
                ]} /> */}
                
                <SwiperCarouselAboutUsOld 
                  images={allData.aboutUsImages
                    .filter((val) => val.type === 'SBE').sort((a,b) => Number(a.priority) - Number(b.priority))
                    .map((val, index) => ({
                      src: val.url,
                      alt: `Sinar Baja Electric About Us ${index + 1}`,
                    }))
                  }
                />
              </div>
              <div className="about-us-section-second-order">
                <div className="about-us-section-first-head">
                  <h2 className="about-us-section-first-head-text">Sinar Baja Electric</h2>
                </div>
                <div style={{
                  marginBlockStart: '24px',
                  marginBlockEnd: '24px',
                  color: '#475569'
                }}>
                  {/* <h3>
                    Founded in 1981, we've grown into a leading name in loudspeaker manufacturing, with a reputation for high-quality products that meet the demands of discerning customers worldwide. Four decades of craftsmanship remain the backbone of everything we build.
                  </h3>
                  <h3>
                    As a privately held group, we stay true to our core values of innovation, quality, and customer satisfaction. We are a preferred OEM/ODM supplier for prestigious brands across the lifestyle hi-fi, high-end, automotive, and professional audio sectors.
                  </h3>
                  <h3>
                    We continue to invest in cutting-edge R&D, quality control, and mass production — pushing the boundaries of what's possible in transducer design and manufacturing.
                  </h3> */}
                  <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.sbe_desc, {
                    ALLOWED_TAGS: [
                        'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                    ],
                    ALLOWED_ATTR: [
                        'href', 'target', 'rel', 'class', 'id', 'style'
                    ],
                  }) }}></h3>
                </div>
                <div style={{
                  marginTop: '32px'
                }}>
                <div className="about-us-button-wrap">
                  <a className="about-us-button" href="https://sinarbajaelectric.com/">Learn More About Sinar Baja Electric</a>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


        <section>
          <div className="about-us-section-parent-div" style={{ paddingBlock: '24px' }}>
            <div className="about-us-mission-header">
              <h2 className="about-us-title">Our Mission & Values</h2>
              {/* <p>
                We dedicate passion and purpose to create and deliver high-valued products, where end user and OEM customer expectation are exceeded
              </p> */}
              <p className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.mission_values_desc, {
                  ALLOWED_TAGS: [
                      'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                  ],
                  ALLOWED_ATTR: [
                      'href', 'target', 'rel', 'class', 'id', 'style'
                  ],
              }) }}></p>
            </div>

            <div className="about-us-cards">
              {/* {[["Acoustics_excellence.jpg", "Acoustic Excellence", "Combining innovative Danish design expertise with precision Indonesian manufacturing, to create transducers deliver uncompromised acoustic performance"], ["Innovation.jpg", "Innovation", `Over ${new Date().getFullYear() - 1981} years of experience in manufacturing, paired with cutting-edge R&D, enables us to continuously advance technology in transducers and manufacturing`], ["global_reach.jpg", "Global Reach", "Serving prestigious brands worldwide across Europe, Australia, Asia, and the United States through our comprehensive distribution network"]].map(([image, title, text]) => 
              <article className="about-us-card" key={title}>
                <img src={`/images/sbacoustics/aboutus/${image}`} alt={`SB Acoustics About Us ${title}`} width={500} height={400} />
                <div className="about-us-card-content">
                  <h3>
                    {title}
                  </h3>
                  <p>
                    {text}
                  </p>
                </div>
              </article>
            )} */}
              {allData.aboutUsImages
                .filter((val) => val.type === 'VALUES').sort((a,b) => Number(a.priority) - Number(b.priority))
                .map((val, index) => 
                <article className="about-us-card" key={index}>
                  <img src={val.url} alt={`SB Acoustics About Us Mission ${index}`} width={500} height={400} />
                  <div className="about-us-card-content">
                    <h3>
                      {val.name}
                    </h3>
                    <p>
                      {val.desc}
                    </p>
                  </div>
                </article>
              )}
            </div>
          </div>
      </section>
    </div>
    </>
  );
}
