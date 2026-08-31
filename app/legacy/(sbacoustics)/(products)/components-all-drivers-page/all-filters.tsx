"use client";

import getAllPriorityBySubCategory from "@/app/(frontend)/actions/get-all-priority-by-category";
import { AllFilterProductsOnlyType } from "@/app/(frontend)/types";
import { allproductcategory } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MainProps {
  data: AllFilterProductsOnlyType[];
}

const AllDriversandFiltersProducts: React.FC<MainProps> = ({ data }) => {
  const [activeSlugCompare, setActiveSlugCompare] = useState<string[]>([]);
  const [activeNameCompare, setActiveNameCompare] = useState<string[]>([]);
  const [activeImgUrlCompare, setActiveImgUrlCompare] = useState<string[]>([]);
  const [_1, setRefresh] = useState<string>("");
  const [comparisonText, setComparisonText] = useState<string>("");
  const [timer, setTimer] = useState<boolean>(false)
  const [priority, setPriority] = useState<allproductcategory[]>([]);
  const [priorityLoaded, setPriorityLoaded] = useState(false);
  const [loadFinished, setLoadFinsihed] = useState<boolean>(false)
  const pathname = usePathname()
  const params = pathname.split('/').slice(1);
  const [allFeaturedProducts, setAllFeaturedProducts] = useState<AllFilterProductsOnlyType[]>(data)


  useEffect(() => {
    timer && setTimeout(() => {
        setComparisonText('')
        setTimer(false)
    }, 2000)
  }, [timer]);

  function deleteComparison(slug: string) {
    const tempSlug: string[] = [];
    const tempName: string[] = [];
    const tempImgUrl: string[] = [];
    let tempUrl = "";

    activeSlugCompare.forEach((value, index) => {
      if (value !== slug) {
        tempSlug.push(activeSlugCompare[index] ?? "");
        tempName.push(activeNameCompare[index] ?? "");
        tempImgUrl.push(activeImgUrlCompare[index] ?? "");
        tempUrl = tempUrl.concat(value, ",");
      }
    });

    setActiveSlugCompare(tempSlug);
    setActiveNameCompare(tempName);
    setActiveImgUrlCompare(tempImgUrl);

    localStorage.setItem("selectedComparisonLegacy", tempUrl);
    setRefresh(slug);
  }

  function addComparison(slug: string, name: string, imgUrl: string) {
    if (!activeSlugCompare.includes(slug)) {
      const newSlugs = [...activeSlugCompare, slug];
      const newNames = [...activeNameCompare, name];
      const newImgs = [...activeImgUrlCompare, imgUrl];

      setActiveSlugCompare(newSlugs);
      setActiveNameCompare(newNames);
      setActiveImgUrlCompare(newImgs);

      const tempUrl = newSlugs.join(",") + ",";
      localStorage.setItem("selectedComparisonLegacy", tempUrl);
    }
  }

  const handleComparison = (
    slug: string,
    name: string,
    imgUrl: string
  ) => {
    if (activeSlugCompare.includes(slug)) {
      deleteComparison(slug);
      setComparisonText(`${name} removed from comparison`);
        setTimer(true)
      return;
    }

    if (activeSlugCompare.length < 5) {
      addComparison(slug, name, imgUrl);
      setComparisonText(`${name} added to comparison`);
        setTimer(true)
      return;
    }

    setComparisonText("Maximum 5 items can be compared");
    setTimer(true)
  };

  useEffect(() => {
    const fetchPriority = async () => {
        try {
            const temp = await getAllPriorityBySubCategory(
                pathname,
                params[params.length - 1] ?? ''
            );

            setPriority(temp);
        } catch (error) {
            console.error("Error fetching priority:", error);
        } finally {
            setPriorityLoaded(true);
        }
    };

    fetchPriority();
  }, []);


  
    useEffect(() => {
        const fetchData = async () => {
          try {
            let FinalFeatured: AllFilterProductsOnlyType[] = data
            if (!priorityLoaded) return;
            if(priority.length === 0) {
                FinalFeatured.sort((a, b) => {
                    // Extract the leading number from the name
                    const numA = parseInt(a.products.name.match(/^\d+/)?.[0] || "100", 10);
                    const numB = parseInt(b.products.name.match(/^\d+/)?.[0] || "100", 10);
                
                    if (numA !== numB) {
                    return numA - numB; // Sort numerically first
                    }
                
                    return a.products.name.localeCompare(b.products.name); // Sort alphabetically if numbers are the same
                });
                setAllFeaturedProducts(FinalFeatured)
                setLoadFinsihed(true)
            }
            else{
                FinalFeatured.sort((a, b) => {
                    const priorityA = Number(priority.find((pri) => pri.productId === a.products.id)?.priority ?? 999)
                    const priorityB = Number(priority.find((pri) => pri.productId === b.products.id)?.priority ?? 999)
                    return priorityA - priorityB
                });
                setAllFeaturedProducts(FinalFeatured)
                setLoadFinsihed(true)
            }

          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [priorityLoaded, priority, data]); 


  return (
    <>
      {/* <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      > */}
        {allFeaturedProducts.map((value, index) => {
            const slug = value.products.slug;
            const name = value.products.name;
            const coverImg = value.products.cover_img;
            const isSelected = activeSlugCompare.includes(slug);

            return (
                <div
                key={`${slug}-${index}`}
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    boxSizing: "border-box",
                    padding: "4px",
                }}
                >
                <a
                    href={`/legacy/products/${slug}`}
                    style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "4px",
                    textDecoration: "none",
                    color: "#222222",
                    backgroundColor: "#ffffff",
                    boxSizing: "border-box",
                    }}
                >
                    <div
                    style={{
                        width: "140px",
                        height: "140px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        boxSizing: "border-box",
                    }}
                    >
                    <img
                        src={coverImg}
                        alt={name}
                        style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        display: "block",
                        }}
                    />
                    </div>

                    <div
                    style={{
                        width: "100%",
                        marginTop: "4px",
                        fontSize: "15px",
                        fontWeight: 600,
                        lineHeight: "1.3",
                        wordBreak: "break-word",
                        textAlign: "center",
                    }}
                    >
                    {name}
                    </div>
                </a>

                <div
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    padding: "4px 0 8px",
                    }}
                >
                    <button
                    type="button"
                    onClick={() => handleComparison(slug, name, coverImg)}
                    style={{
                        appearance: "none",
                        border: isSelected ? '0px' : "1px solid #000000",
                        borderRadius: "3px",
                        backgroundColor: isSelected ? "#e6001b" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#000000",
                        padding: "6px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        lineHeight: "1.2",
                        cursor: "pointer",
                        textAlign: "center",
                    }}
                    >
                    {isSelected
                        ? "Remove from Comparison"
                        : "Add to Comparison"}
                    </button>
                </div>

                {/* <hr
                    style={{
                    width: "100%",
                    margin: "0",
                    border: "0",
                    borderTop: "1px solid #dddddd",
                    }}
                /> */}
                </div>
            );
        })}
      {/* </div> */}

      {comparisonText !== "" && (
        <div
          style={{
            position: "fixed",
            right: "20px",
            bottom: "20px",
            zIndex: 1000,
            maxWidth: "320px",
            padding: "10px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            backgroundColor: "#ffffff",
            color: "#222222",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
            fontSize: "14px",
            lineHeight: "1.4",
            textAlign: "left",
          }}
          className="comparison-text-style"
        >
          {comparisonText}
        </div>
      )}

      {activeSlugCompare.length > 0 && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "20px",
            transform: "translateX(-50%)",
            zIndex: 999,
          }}
        >
          <a
            href={`/legacy/comparison`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "150px",
              padding: "12px 24px",
              borderRadius: "5px",
            //   border: "1px solid #222222",
              backgroundColor: "#e6001b",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "1.2",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.2)",
              boxSizing: "border-box",
            }}
          >
            Compare Now
            <span
              style={{
                marginLeft: "8px",
                fontSize: "16px",
              }}
            >
              →
            </span>
          </a>
        </div>
      )}
    </>
  );
};

export default AllDriversandFiltersProducts;