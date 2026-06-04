import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/lib/actions";
import { image_catalogues, multiple3dmodels, multipledatasheetproduct, multiplefrdzmafiles } from "@prisma/client";
import path from 'path';
import fs from 'fs/promises';
import { revalidatePath } from "next/cache";

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote?.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  const strWithoutSatori = strBeforeSlash?.replace(/SATORI/gi, '');
  return strWithoutSatori?.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '') ?? '';
};

export async function GET(req: Request, props: { params: Promise<{ productId: string, brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
        brandId: params.brandId
      },
      include: {
        allCat: true,
        images_catalogues: true,
        size: true,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ productId: string, brandId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getSession();

    if(!session.isLoggedIn){
      return NextResponse.json("expired_session")
    }

    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    //DELETE

    //DELETE COVER IMAGE
    const oldImages = await prismadb.product.findFirst({
      where: {
        id: params.productId,
      },
      select: {
        cover_img_url: true,
        drawing_img_url: true,
        graph_img_url: true,
        featured_img_url: true
      }
    });

    if (oldImages) {
      const coverimagePath = path.join(process.cwd(), oldImages.cover_img_url);
      try {
        await fs.unlink(coverimagePath);
      } catch (error) {
        console.warn(`Could not delete file ${oldImages.cover_img_url}:`, error);
      }
      const drawingimagePath = path.join(process.cwd(), oldImages.drawing_img_url);
      try {
        await fs.unlink(drawingimagePath);
      } catch (error) {
        console.warn(`Could not delete file ${oldImages.drawing_img_url}:`, error);
      }
      const graphimagePath = path.join(process.cwd(), oldImages.graph_img_url);
      try {
        await fs.unlink(graphimagePath);
      } catch (error) {
        console.warn(`Could not delete file ${oldImages.graph_img_url}:`, error);
      }
      const featuredimagePath = path.join(process.cwd(), oldImages.featured_img_url);
      try {
        await fs.unlink(featuredimagePath);
      } catch (error) {
        console.warn(`Could not delete file ${oldImages.featured_img_url}:`, error);
      }
    }

    //DELETE IMAGE CATALOGUES
    const cataloguesImages = await prismadb.image_catalogues.findMany({
      where: {
        productId: params.productId,
      },
    });
    //Delete physical files
    for (const image of cataloguesImages) {
      if (image.url) {
        const imagePath = path.join(process.cwd(), image.url);

        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.warn(`Could not delete file ${image.url}:`, error);
        }
      }
    }
    //Delete Image_catalogues records
    await prismadb.image_catalogues.deleteMany({
      where: {
        productId: params.productId,
      },
    });


    //DELETE MULTIPLE DATASHEET
    const multipleDatasheet = await prismadb.multipledatasheetproduct.findMany({
      where: {
        productId: params.productId,
      },
    });
    //Delete physical files
    for (const pdf of multipleDatasheet) {
      if (pdf.url) {
        const pdfPath = path.join(process.cwd(), pdf.url);

        try {
          await fs.unlink(pdfPath);
        } catch (error) {
          console.warn(`Could not delete file ${pdf.url}:`, error);
        }
      }
    }
    //Delete multipleDatasheetProduct records
    await prismadb.multipledatasheetproduct.deleteMany({
      where: {
        productId: params.productId,
      },
    });


    //DELETE MULTIPLE FRD ZMA
    const multipleFRDZMA = await prismadb.multiplefrdzmafiles.findMany({
      where: {
        productId: params.productId,
      },
    });
    //Delete physical files
    for (const files of multipleFRDZMA) {
      if (files.url) {
        const filesPath = path.join(process.cwd(), files.url);

        try {
          await fs.unlink(filesPath);
        } catch (error) {
          console.warn(`Could not delete file ${files.url}:`, error);
        }
      }
    }
    //Delete multipleFRDZMAFiles records
    await prismadb.multiplefrdzmafiles.deleteMany({
      where: {
        productId: params.productId,
      },
    });


    //DELETE MULTIPLE 3D Models
    const multiple3DModels = await prismadb.multiple3dmodels.findMany({
      where: {
        productId: params.productId,
      },
    });
    //Delete physical files
    for (const files of multiple3DModels) {
      if (files.url) {
        const filesPath = path.join(process.cwd(), files.url);

        try {
          await fs.unlink(filesPath);
        } catch (error) {
          console.warn(`Could not delete file ${files.url}:`, error);
        }
      }
    }
    //Delete multiple3DModel records
    await prismadb.multiple3dmodels.deleteMany({
      where: {
        productId: params.productId,
      },
    });



    //Delete allproductcategory
    await prismadb.allproductcategory.deleteMany({
      where: {
        productId: params.productId,
      },
    });
    //Delete kitsfinishing
    await prismadb.kitsfinishing.deleteMany({
      where: {
        productId: params.productId,
      },
    });
    //Delete menupriority
    await prismadb.menupriority.deleteMany({
      where: {
        productId: params.productId,
      },
    });
    //Delete similarproducts
    await prismadb.similarproducts.deleteMany({
      where: {
        productId: params.productId,
      },
    });
    //Delete specificationconnector
    await prismadb.specificationconnector.deleteMany({
      where: {
        productId: params.productId,
        brandId: params.brandId
      },
    });
    

    const deletedProd = await prismadb.product.findFirst({
      where: {
        id: params.productId,
        brandId: params.brandId
      }
    })

    deletedProd && revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/products/${deletedProd.slug}`);

    await prismadb.product.deleteMany({
      where: { 
        id: params.productId,
        brandId: params.brandId
      },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    
  } catch (error: any) {
    console.error('[PRODUCT_DELETE]', error?.message || error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ productId: string, brandId: string }> }
) {
  const params = await props.params;
  try {
    const session = await getSession();

    if(!session.isLoggedIn || !session){
      return NextResponse.json("expired_session")
    }

    if(!(await checkBearerAPI(session))){
      session.destroy();
      return NextResponse.json("invalid_token")
    }

    const body = await req.json();

    const { name, description, isFeatured, isArchived, isKits, isNewProduct, sizeId, images_catalogues, multipleDatasheetProduct, multipleFRDZMAFiles, multiple3DModels, cover_img_url, drawing_img_url, graph_img_url, navbarNotes, searchbox_desc, tempAllFinished } = body;

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const initial = await prismadb.product.findFirst({
      where:{
        id: params.productId,
        brandId: params.brandId
      },
      select:{
        name: true
      }
    })


    if(initial){
      if(initial.name ===  name){

        //IMAGE CATALOGUES
        const cataloguesImages = await prismadb.image_catalogues.findMany({
          where: {
            productId: params.productId,
          },
        });
        let finalfound : image_catalogues[] = []
        cataloguesImages.forEach((val) => {
          const found = images_catalogues.find((value: image_catalogues) => value.url === val.url);
          
          if (found && !finalfound.some((item) => item.url === found.url)) {
            finalfound.push(found);
          }
        });
        //DELETE IMAGE CATALOGUES
        //Delete physical files
        for (const image of cataloguesImages) {
          const isInFinal = finalfound.some((item) => item.url === image.url);
          if (isInFinal) continue;

          if (image.url) {
            const imagePath = path.join(process.cwd(), image.url);

            try {
              await fs.unlink(imagePath);
            } catch (error) {
              console.warn(`Could not delete file ${image.url}:`, error);
            }
          }
        }
        //Delete Image_catalogues records
        await prismadb.image_catalogues.deleteMany({
          where: {
            productId: params.productId,
            url: {
              notIn: finalfound.map((val) => val.url),
            },
          },
        });
        if (images_catalogues.length !== 0) {
          const creations = images_catalogues.map(async (value: image_catalogues) => {
            if(value !== null && value !== undefined){
              const alreadyInDB = finalfound.some((val) => val.url === value.url);
              if (!alreadyInDB && value.url !== '') {
                await prismadb.image_catalogues.create({
                  data: {
                    productId: params.productId,
                    url: value.url,
                    name: value.name,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }
                });
              }
              else{ //UPDATE NAME
                const image_catalogues_Id = await prismadb.image_catalogues.findFirst({
                  where: {
                    url: value.url,
                    productId: params.productId
                  },
                  select: {
                    id: true
                  }
                })
                if (image_catalogues_Id) {
                  await prismadb.image_catalogues.update({
                    where: {
                      id: image_catalogues_Id.id
                    },
                    data: {
                      name: value.name,
                      updatedAt: new Date()
                    },
                  });
                }
              }
            }
          });

          await Promise.all(creations);
        }


        //DATASHEET
        const datasheetOld = await prismadb.multipledatasheetproduct.findMany({
          where: {
            productId: params.productId,
          },
        });
        let finalfoundDatashset : multipledatasheetproduct[] = []
        datasheetOld.forEach((val) => {
          const found = multipleDatasheetProduct.find((value: multipledatasheetproduct) => value.url === val.url);
          
          if (found && !finalfoundDatashset.some((item) => item.url === found.url)) {
            finalfoundDatashset.push(found);
          }
        });
        //DELETE DATASHEET
        //Delete physical files
        for (const datasheet of datasheetOld) {
          const isInFinal = finalfoundDatashset.some((item) => item.url === datasheet.url);
          if (isInFinal) continue;

          if (datasheet.url) {
            const datasheetPath = path.join(process.cwd(), datasheet.url);

            try {
              await fs.unlink(datasheetPath);
            } catch (error) {
              console.warn(`Could not delete file ${datasheet.url}:`, error);
            }
          }
        }
        //Delete oldDatasheet records
        await prismadb.multipledatasheetproduct.deleteMany({
          where: {
            productId: params.productId,
            url: {
              notIn: finalfoundDatashset.map((val) => val.url),
            },
          },
        });
        if (multipleDatasheetProduct.length !== 0) {
          const creations = multipleDatasheetProduct.map(async (value: multipledatasheetproduct) => {
            if(value !== null && value !== undefined){
              const alreadyInDB = finalfoundDatashset.some((val) => val.url === value.url);
              if (!alreadyInDB && value.url !== '') {
                await prismadb.multipledatasheetproduct.create({
                  data: {
                    productId: params.productId,
                    url: value.url,
                    name: value.name,
                  }
                });
              }
              else{ //UPDATE NAME
                const datasheet_Id = await prismadb.multipledatasheetproduct.findFirst({
                  where: {
                    url: value.url,
                    productId: params.productId
                  },
                  select: {
                    id: true
                  }
                })
                if (datasheet_Id) {
                  await prismadb.multipledatasheetproduct.update({
                    where: {
                      id: datasheet_Id.id
                    },
                    data: {
                      name: value.name,
                    },
                  });
                }
              }
            }
          });

          await Promise.all(creations);
        }


        //FRD ZMA
        const FRDZMAOld = await prismadb.multiplefrdzmafiles.findMany({
          where: {
            productId: params.productId,
          },
        });
        let finalfoundFRDZMA : multiplefrdzmafiles[] = []
        FRDZMAOld.forEach((val) => {
          const found = multipleFRDZMAFiles.find((value: multiplefrdzmafiles) => value.url === val.url);
          
          if (found && !finalfoundFRDZMA.some((item) => item.url === found.url)) {
            finalfoundFRDZMA.push(found);
          }
        });
        //DELETE FRD ZMA
        //Delete physical files
        for (const FRDZMA of FRDZMAOld) {
          const isInFinal = finalfoundFRDZMA.some((item) => item.url === FRDZMA.url);
          if (isInFinal) continue;

          if (FRDZMA.url) {
            const FRDZMAPath = path.join(process.cwd(), FRDZMA.url);

            try {
              await fs.unlink(FRDZMAPath);
            } catch (error) {
              console.warn(`Could not delete file ${FRDZMA.url}:`, error);
            }
          }
        }
        //Delete oldFRDZMA records
        await prismadb.multiplefrdzmafiles.deleteMany({
          where: {
            productId: params.productId,
            url: {
              notIn: finalfoundFRDZMA.map((val) => val.url),
            },
          },
        });
        if (multipleFRDZMAFiles.length !== 0) {
          const creations = multipleFRDZMAFiles.map(async (value: multiplefrdzmafiles) => {
            if(value !== null && value !== undefined){
              const alreadyInDB = finalfoundFRDZMA.some((val) => val.url === value.url);
              if (!alreadyInDB && value.url !== '') {
                await prismadb.multiplefrdzmafiles.create({
                  data: {
                    productId: params.productId,
                    url: value.url,
                    name: value.name,
                  }
                });
              }
              else{ //UPDATE NAME
                const frdzma_Id = await prismadb.multiplefrdzmafiles.findFirst({
                  where: {
                    url: value.url,
                    productId: params.productId
                  },
                  select: {
                    id: true
                  }
                })
                if (frdzma_Id) {
                  await prismadb.multiplefrdzmafiles.update({
                    where: {
                      id: frdzma_Id.id
                    },
                    data: {
                      name: value.name,
                    },
                  });
                }
              }
            }
          });

          await Promise.all(creations);
        }



        //3D Models
        const modelsOld = await prismadb.multiple3dmodels.findMany({
          where: {
            productId: params.productId,
          },
        });
        let finalfound3DModels : multiple3dmodels[] = []
        modelsOld.forEach((val) => {
          const found = multiple3DModels.find((value: multiple3dmodels) => value.url === val.url);
          
          if (found && !finalfound3DModels.some((item) => item.url === found.url)) {
            finalfound3DModels.push(found);
          }
        });
        //DELETE 3d Models
        //Delete physical files
        for (const model of modelsOld) {
          const isInFinal = finalfound3DModels.some((item) => item.url === model.url);
          if (isInFinal) continue;

          if (model.url) {
            const modelPath = path.join(process.cwd(), model.url);

            try {
              await fs.unlink(modelPath);
            } catch (error) {
              console.warn(`Could not delete file ${model.url}:`, error);
            }
          }
        }
        //Delete oldModel records
        await prismadb.multiple3dmodels.deleteMany({
          where: {
            productId: params.productId,
            url: {
              notIn: finalfound3DModels.map((val) => val.url),
            },
          },
        });
        if (multiple3DModels.length !== 0) {
          const creations = multiple3DModels.map(async (value: multiple3dmodels) => {
            if(value !== null && value !== undefined){
              const alreadyInDB = finalfound3DModels.some((val) => val.url === value.url);
              if (!alreadyInDB && value.url !== '') {
                await prismadb.multiple3dmodels.create({
                  data: {
                    productId: params.productId,
                    url: value.url,
                    name: value.name,
                  }
                });
              }
              else{ //UPDATE NAME
                const model_Id = await prismadb.multiple3dmodels.findFirst({
                  where: {
                    url: value.url,
                    productId: params.productId
                  },
                  select: {
                    id: true
                  }
                })
                if (model_Id) {
                  await prismadb.multiple3dmodels.update({
                    where: {
                      id: model_Id.id
                    },
                    data: {
                      name: value.name,
                    },
                  });
                }
              }
            }
          });

          await Promise.all(creations);
        }




        const oldUrl = await prismadb.product.findFirst({
          where: {
            id: params.productId
          },
          select:{
            cover_img_url: true,
            drawing_img_url: true,
            graph_img_url: true
          }
        })

        
        //Delete physical files
        if(oldUrl && oldUrl.cover_img_url && oldUrl.cover_img_url !== cover_img_url) {
          const ImgPath = path.join(process.cwd(), oldUrl.cover_img_url);
          try {
            await fs.unlink(ImgPath);
          } catch (error) {
            console.warn(`Could not delete file ${oldUrl.cover_img_url}:`, error);
          }
        }
        //Delete physical files
        if(oldUrl && oldUrl.drawing_img_url && oldUrl.drawing_img_url !== drawing_img_url) {
          const ImgPath = path.join(process.cwd(), oldUrl.drawing_img_url);
          try {
            await fs.unlink(ImgPath);
          } catch (error) {
            console.warn(`Could not delete file ${oldUrl.drawing_img_url}:`, error);
          }
        }
        //Delete physical files
        if(oldUrl && oldUrl.graph_img_url && oldUrl.graph_img_url !== graph_img_url) {
          const ImgPath = path.join(process.cwd(), oldUrl.graph_img_url);
          try {
            await fs.unlink(ImgPath);
          } catch (error) {
            console.warn(`Could not delete file ${oldUrl.graph_img_url}:`, error);
          }
        }


        // PRODUCT OVERALL
        const updatedProduct = await prismadb.product.update({
          where: {
            id: params.productId,
            brandId: params.brandId
          },
          data: {
            name,
            slug: slugify(name),
            cover_img_url,
            drawing_img_url,
            graph_img_url,
            isFeatured,
            isArchived,
            isKits,
            isNewProduct,
            navbarNotes,
            searchbox_desc,
            sizeId,
            description: description,
            updatedAt: new Date(),
            updatedBy: session.name,
            tempAllFinished
          },
        });


        const kitsId = process.env.NEXT_PUBLIC_KITS_CATEGORY_ID ?? ''
        if (isKits) { //isKits is checked
          const checkKits = await prismadb.allproductcategory.findFirst({ //is There already a 'Kits' inside this product category?
            where: {
              productId: params.productId,
              categoryId: kitsId
            },
            include:{
              category: true
            }
          })
          if (!checkKits) {  //no, then add a 'Kits' category for this product
            const kits = await prismadb.allcategory.findFirst({ //check if Kits is inside allCategory
              where: {
                brandId: params.brandId,
                id: kitsId
              },
            })
            if (kits){
              await prismadb.allproductcategory.create({ //Create 'Kits' Category for this product
                data: {
                  productId: params.productId,
                  categoryId: kits.id,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
              });
            }
          }
        }
        else{ // This is in fact, not a kits product. Then delete 'Kits' inside this product category
          try {
            const kitsCategory = await prismadb.allproductcategory.findFirst({ // Find if there is an active 'Kits' Category
              where: {
                productId: params.productId,
                categoryId: kitsId
              },
              include:{
                category: true
              }
            });
            if (kitsCategory) {
              await prismadb.allproductcategory.deleteMany({ // Delete 'Kits' category
                where: {
                  id: kitsCategory.id
                }
              });
            }
          } catch (error) {
            // Ignore if not found
          }
        }
        revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/products/${updatedProduct.slug}`);
        return NextResponse.json("same")
      }
    }

    const duplicates = await prismadb.product.findFirst({
      where:{
        name,
        brandId: params.brandId
      }
    })

    if(duplicates){
      revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/products/${duplicates.slug}`);
      return NextResponse.json("duplicate")
    }



    //IMAGE CATALOGUES
    const cataloguesImages = await prismadb.image_catalogues.findMany({
      where: {
        productId: params.productId,
      },
    });
    let finalfound : image_catalogues[] = []
    cataloguesImages.forEach((val) => {
      const found = images_catalogues.find((value: image_catalogues) => value.url === val.url);
      
      if (found && !finalfound.some((item) => item.url === found.url)) {
        finalfound.push(found);
      }
    });
    //DELETE IMAGE CATALOGUES
    //Delete physical files
    for (const image of cataloguesImages) {
      const isInFinal = finalfound.some((item) => item.url === image.url);
      if (isInFinal) continue;

      if (image.url) {
        const imagePath = path.join(process.cwd(), image.url);

        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.warn(`Could not delete file ${image.url}:`, error);
        }
      }
    }
    //Delete Image_catalogues records
    await prismadb.image_catalogues.deleteMany({
      where: {
        productId: params.productId,
        url: {
          notIn: finalfound.map((val) => val.url),
        },
      },
    });
    if (images_catalogues.length !== 0) {
      const creations = images_catalogues.map(async (value: image_catalogues) => {
        if(value !== null && value !== undefined){
          const alreadyInDB = finalfound.some((val) => val.url === value.url);
          if (!alreadyInDB && value.url !== '') {
            await prismadb.image_catalogues.create({
              data: {
                productId: params.productId,
                url: value.url,
                name: value.name,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          }
          else{ //UPDATE NAME
            const image_catalogues_Id = await prismadb.image_catalogues.findFirst({
              where: {
                url: value.url,
                productId: params.productId
              },
              select: {
                id: true
              }
            })
            if (image_catalogues_Id) {
              await prismadb.image_catalogues.update({
                where: {
                  id: image_catalogues_Id.id
                },
                data: {
                  name: value.name,
                  updatedAt: new Date()
                },
              });
            }
          }
        }
      });

      await Promise.all(creations);
    }


    //DATASHEET
    const datasheetOld = await prismadb.multipledatasheetproduct.findMany({
      where: {
        productId: params.productId,
      },
    });
    let finalfoundDatashset : multipledatasheetproduct[] = []
    datasheetOld.forEach((val) => {
      const found = multipleDatasheetProduct.find((value: multipledatasheetproduct) => value.url === val.url);
      
      if (found && !finalfoundDatashset.some((item) => item.url === found.url)) {
        finalfoundDatashset.push(found);
      }
    });
    //DELETE DATASHEET
    //Delete physical files
    for (const datasheet of datasheetOld) {
      const isInFinal = finalfoundDatashset.some((item) => item.url === datasheet.url);
      if (isInFinal) continue;

      if (datasheet.url) {
        const datasheetPath = path.join(process.cwd(), datasheet.url);

        try {
          await fs.unlink(datasheetPath);
        } catch (error) {
          console.warn(`Could not delete file ${datasheet.url}:`, error);
        }
      }
    }
    //Delete oldDatasheet records
    await prismadb.multipledatasheetproduct.deleteMany({
      where: {
        productId: params.productId,
        url: {
          notIn: finalfoundDatashset.map((val) => val.url),
        },
      },
    });
    if (multipleDatasheetProduct.length !== 0) {
      const creations = multipleDatasheetProduct.map(async (value: multipledatasheetproduct) => {
        if(value !== null && value !== undefined){
          const alreadyInDB = finalfoundDatashset.some((val) => val.url === value.url);
          if (!alreadyInDB && value.url !== '') {
            await prismadb.multipledatasheetproduct.create({
              data: {
                productId: params.productId,
                url: value.url,
                name: value.name,
              }
            });
          }
          else{ //UPDATE NAME
            const datasheet_Id = await prismadb.multipledatasheetproduct.findFirst({
              where: {
                url: value.url,
                productId: params.productId
              },
              select: {
                id: true
              }
            })
            if (datasheet_Id) {
              await prismadb.multipledatasheetproduct.update({
                where: {
                  id: datasheet_Id.id
                },
                data: {
                  name: value.name,
                },
              });
            }
          }
        }
      });

      await Promise.all(creations);
    }



    //FRD ZMA
    const frdzmaOld = await prismadb.multiplefrdzmafiles.findMany({
      where: {
        productId: params.productId,
      },
    });
    let finalfoundFRDZMA : multiplefrdzmafiles[] = []
    frdzmaOld.forEach((val) => {
      const found = multipleFRDZMAFiles.find((value: multiplefrdzmafiles) => value.url === val.url);
      
      if (found && !finalfoundFRDZMA.some((item) => item.url === found.url)) {
        finalfoundFRDZMA.push(found);
      }
    });
    //DELETE FRD ZMA
    //Delete physical files
    for (const frdzma of frdzmaOld) {
      const isInFinal = finalfoundFRDZMA.some((item) => item.url === frdzma.url);
      if (isInFinal) continue;

      if (frdzma.url) {
        const FRDZMAPath = path.join(process.cwd(), frdzma.url);

        try {
          await fs.unlink(FRDZMAPath);
        } catch (error) {
          console.warn(`Could not delete file ${frdzma.url}:`, error);
        }
      }
    }
    //Delete oldFRDZMA records
    await prismadb.multiplefrdzmafiles.deleteMany({
      where: {
        productId: params.productId,
        url: {
          notIn: finalfoundFRDZMA.map((val) => val.url),
        },
      },
    });
    if (multipleFRDZMAFiles.length !== 0) {
      const creations = multipleFRDZMAFiles.map(async (value: multiplefrdzmafiles) => {
        if(value !== null && value !== undefined){
          const alreadyInDB = finalfoundFRDZMA.some((val) => val.url === value.url);
          if (!alreadyInDB && value.url !== '') {
            await prismadb.multiplefrdzmafiles.create({
              data: {
                productId: params.productId,
                url: value.url,
                name: value.name,
              }
            });
          }
          else{ //UPDATE NAME
            const frdzma_Id = await prismadb.multiplefrdzmafiles.findFirst({
              where: {
                url: value.url,
                productId: params.productId
              },
              select: {
                id: true
              }
            })
            if (frdzma_Id) {
              await prismadb.multiplefrdzmafiles.update({
                where: {
                  id: frdzma_Id.id
                },
                data: {
                  name: value.name,
                },
              });
            }
          }
        }
      });

      await Promise.all(creations);
    }



    


    //3D Models
    const modelsOld = await prismadb.multiple3dmodels.findMany({
      where: {
        productId: params.productId,
      },
    });
    let finalfound3DModels : multiple3dmodels[] = []
    modelsOld.forEach((val) => {
      const found = multiple3DModels.find((value: multiple3dmodels) => value.url === val.url);
      
      if (found && !finalfound3DModels.some((item) => item.url === found.url)) {
        finalfound3DModels.push(found);
      }
    });
    //DELETE 3D Models
    //Delete physical files
    for (const models of modelsOld) {
      const isInFinal = finalfound3DModels.some((item) => item.url === models.url);
      if (isInFinal) continue;

      if (models.url) {
        const modelsPath = path.join(process.cwd(), models.url);

        try {
          await fs.unlink(modelsPath);
        } catch (error) {
          console.warn(`Could not delete file ${models.url}:`, error);
        }
      }
    }
    //Delete oldModels records
    await prismadb.multiple3dmodels.deleteMany({
      where: {
        productId: params.productId,
        url: {
          notIn: finalfound3DModels.map((val) => val.url),
        },
      },
    });
    if (multiple3DModels.length !== 0) {
      const creations = multiple3DModels.map(async (value: multiple3dmodels) => {
        if(value !== null && value !== undefined){
          const alreadyInDB = finalfound3DModels.some((val) => val.url === value.url);
          if (!alreadyInDB && value.url !== '') {
            await prismadb.multiple3dmodels.create({
              data: {
                productId: params.productId,
                url: value.url,
                name: value.name,
              }
            });
          }
          else{ //UPDATE NAME
            const models_Id = await prismadb.multiple3dmodels.findFirst({
              where: {
                url: value.url,
                productId: params.productId
              },
              select: {
                id: true
              }
            })
            if (models_Id) {
              await prismadb.multiple3dmodels.update({
                where: {
                  id: models_Id.id
                },
                data: {
                  name: value.name,
                },
              });
            }
          }
        }
      });

      await Promise.all(creations);
    }



    const oldUrl = await prismadb.product.findFirst({
      where: {
        id: params.productId
      },
      select:{
        cover_img_url: true,
        drawing_img_url: true,
        graph_img_url: true
      }
    })

    
    //Delete physical files
    if(oldUrl && oldUrl.cover_img_url && oldUrl.cover_img_url !== cover_img_url) {
      const ImgPath = path.join(process.cwd(), oldUrl.cover_img_url);
      try {
        await fs.unlink(ImgPath);
      } catch (error) {
        console.warn(`Could not delete file ${oldUrl.cover_img_url}:`, error);
      }
    }
    //Delete physical files
    if(oldUrl && oldUrl.drawing_img_url && oldUrl.drawing_img_url !== drawing_img_url) {
      const ImgPath = path.join(process.cwd(), oldUrl.drawing_img_url);
      try {
        await fs.unlink(ImgPath);
      } catch (error) {
        console.warn(`Could not delete file ${oldUrl.drawing_img_url}:`, error);
      }
    }
    //Delete physical files
    if(oldUrl && oldUrl.graph_img_url && oldUrl.graph_img_url !== graph_img_url) {
      const ImgPath = path.join(process.cwd(), oldUrl.graph_img_url);
      try {
        await fs.unlink(ImgPath);
      } catch (error) {
        console.warn(`Could not delete file ${oldUrl.graph_img_url}:`, error);
      }
    }

    // PRODUCT OVERALL
    const updatedProduct = await prismadb.product.update({
      where: {
        id: params.productId,
        brandId: params.brandId
      },
      data: {
        name,
        slug: slugify(name),
        drawing_img_url,
        cover_img_url,
        graph_img_url,
        isFeatured,
        isArchived,
        isKits,
        isNewProduct,
        navbarNotes,
        searchbox_desc,
        sizeId,
        tempAllFinished,
        description: description,
      },
    });


    const kitsId = process.env.NEXT_PUBLIC_KITS_CATEGORY_ID ?? ''
    if (isKits) { //isKits is checked
      const checkKits = await prismadb.allproductcategory.findFirst({ //is There already a 'Kits' inside this product category?
        where: {
          productId: params.productId,
          categoryId: kitsId
        },
        include:{
          category: true
        }
      })
      if (!checkKits) {  //no, then add a 'Kits' category for this product
        const kits = await prismadb.allcategory.findFirst({ //check if Kits is inside allCategory
          where: {
            brandId: params.brandId,
            id: kitsId
          },
        })
        if (kits){
          await prismadb.allproductcategory.create({ //Create 'Kits' Category for this product
            data: {
              productId: params.productId,
              categoryId: kits.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          });
        }
      }
    }
    else{ // This is in fact, not a kits product. Then delete 'Kits' inside this product category
      try {
        const kitsCategory = await prismadb.allproductcategory.findFirst({ // Find if there is an active 'Kits' Category
          where: {
            productId: params.productId,
            categoryId: kitsId
          },
          include:{
            category: true
          }
        });
        if (kitsCategory) {
          await prismadb.allproductcategory.deleteMany({ // Delete 'Kits' category
            where: {
              id: kitsCategory.id
            }
          });
        }
      } catch (error) {
        // Ignore if not found
      }
    }
    
    revalidatePath(`${params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID ? '/sbaudience': params.brandId === process.env.NEXT_PUBLIC_SB_AUTOMOTIVE_ID ? '/sbautomotive' : ''}/products/${updatedProduct.slug}`);

   
    return NextResponse.json("success");
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};