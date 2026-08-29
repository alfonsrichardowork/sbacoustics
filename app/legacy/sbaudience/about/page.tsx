
import '@/app/legacy/(sbacoustics)/about/about.css'
import SwiperCarouselAboutUsOld from "../../components/swipercarouselaboutusold";

export default function AboutUsSBAudience() {
  return (
    <>
      
      <div style={{ backgroundColor: "#ffffff" }}>
        <section className="about-us-section about-us-section-white">
          <div className="about-us-container">
            <div className="about-us-two-column about-us-align-center about-us-gap-large">
              <div className="about-us-copy about-us-copy-first">
                <div className="about-us-desktop-heading">
                  <h2 className="about-us-title">SB Audience</h2>
                </div>
                <div className="about-us-text-stack">
                  <h3>
                    SB Audience is a premier professional transducer brand built on the heavy industrial foundation of Sinar Baja Electric. Sitting side by side with sister brand SB Acoustics, SB Audience acts as the group's dedicated professional sound reinforcement division aimed at the global market.
                  </h3>
                  <h3>
                    Backed by over {new Date().getFullYear() - 1981} years of advanced engineering and vertical integration, with almost every part an process made and controlled in house, we provide a robust, competitive alternative to the pro-audio market. Our products are structured into three specialized tiers: Bianco for cost-conscious reliability, Rosso for premium performance value, and Nero for maximum acoustic excellence. Supported by a comprehensive global distribution network spanning Europe, America, Australia, and Asia, SB Audience proudly delivers elite sound reinforcement solutions to major brands worldwide.
                  </h3>
                </div>
              </div>
              <div className="about-us-carousel about-us-carousel-first">
                <div className="about-us-mobile-heading">
                  <div className="about-us-title">SB Audience</div>
                </div>
                <SwiperCarouselAboutUsOld images={[
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
                ]} />
              </div>
            </div>
          </div>
      </section>


        <section className="about-us-section about-us-section-zinc">
          <div className="about-us-container">
            <div className="about-us-two-column about-us-align-center about-us-gap-large">
              <div className="about-us-carousel">
                <div className="about-us-mobile-heading">
                  <div className="about-us-title">Sinar Baja Electric</div>
                </div>
                <SwiperCarouselAboutUsOld images={[
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
                ]} />
              </div>
              <div className="about-us-copy about-us-copy-second">
                <div className="about-us-desktop-heading">
                  <h2 className="about-us-title">Sinar Baja Electric</h2>
                </div>
                <div className="about-us-text-stack">
                  <h3>
                    Founded in 1981, we've grown into a leading name in loudspeaker manufacturing, with a reputation for high-quality products that meet the demands of discerning customers worldwide. Four decades of craftsmanship remain the backbone of everything we build.
                  </h3>
                  <h3>
                    As a privately held group, we stay true to our core values of innovation, quality, and customer satisfaction. We are a preferred OEM/ODM supplier for prestigious brands across the lifestyle hi-fi, high-end, automotive, and professional audio sectors.
                  </h3>
                  <h3>
                    We continue to invest in cutting-edge R&D, quality control, and mass production — pushing the boundaries of what's possible in transducer design and manufacturing.
                  </h3>
                </div>
                <div className="about-us-button-wrap">
                  <a className="about-us-button" href="https://sinarbajaelectric.com/">Learn More About Sinar Baja Electric</a>
                </div>
              </div>
            </div>
          </div>
      </section>

        <section className="about-us-section about-us-section-white">
          <div className="about-us-container">
            <div className="about-us-mission-header">
              <h2 className="about-us-title">Our Mission & Values</h2>
              <p>
                We dedicate passion and purpose to create and deliver high-valued products, where end user and OEM customer expectation are exceeded
              </p>
            </div>

            <div className="about-us-cards">
              {[["Acoustics_excellence.jpg", "Acoustic Excellence", "Combining innovative Danish design expertise with precision Indonesian manufacturing, to create transducers deliver uncompromised acoustic performance"], ["Innovation.jpg", "Innovation", `Over ${new Date().getFullYear() - 1981} years of experience in manufacturing, paired with cutting-edge R&D, enables us to continuously advance technology in transducers and manufacturing`], ["global_reach.jpg", "Global Reach", "Serving prestigious brands worldwide across Europe, Australia, Asia, and the United States through our comprehensive distribution network"]].map(([image, title, text]) => 
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
            )}
            </div>
          </div>
      </section>
    </div>
    </>
  );
}
