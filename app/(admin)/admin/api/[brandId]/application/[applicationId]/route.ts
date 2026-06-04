import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/lib/actions";
import { image_catalogues,  multipledatasheetproduct } from "@prisma/client";
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

export async function GET(req: Request, props: { params: Promise<{ applicationId: string, brandId: string }> }) {
  const params = await props.params;
  try {
    if (!params.applicationId) {
      return new NextResponse("Application id is required", { status: 400 });
    }

    const app = await prismadb.sbaudienceapplication.findUnique({
      where: {
        id: params.applicationId,
        brandId: params.brandId
      },
      include: {
        images_catalogues: true,
        datasheet: true
      }
    });
  
    return NextResponse.json(app);
  } catch (error) {
    console.log('[SINGLE_APPLICATION_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ applicationId: string, brandId: string }> }
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

    if (!params.applicationId) {
      return new NextResponse("Application id is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    //DELETE

    const oldCover = await prismadb.sbaudienceapplication.findFirst({
      where: {
        id: params.applicationId
      },
      select:{ 
        cover_img_url: true
      }
    })
    if(oldCover){
      const imagePath = path.join(process.cwd(), oldCover.cover_img_url);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.warn(`Could not delete file ${oldCover.cover_img_url}:`, error);
      }
    }
      

    //DELETE IMAGE CATALOGUES
    const cataloguesImages = await prismadb.image_catalogues.findMany({
      where: {
        applicationId: params.applicationId,
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
        applicationId: params.applicationId,
      },
    });


    //DELETE MULTIPLE DATASHEET
    const multipleDatasheet = await prismadb.multipledatasheetproduct.findMany({
      where: {
        applicationId: params.applicationId,
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
        applicationId: params.applicationId,
      },
    });

    const deletedApp = await prismadb.sbaudienceapplication.findFirst({
      where: {
        id: params.applicationId,
        brandId: params.brandId
      }
    })

    deletedApp && revalidatePath(`/sbaudience/application/${deletedApp.slug}`);

    await prismadb.sbaudienceapplication.deleteMany({
      where: { 
        id: params.applicationId,
        brandId: params.brandId
      },
    });

    return NextResponse.json({ message: 'Application deleted successfully' }, { status: 200 });
    
  } catch (error: any) {
    console.error('[SINGLE_APPLICATION_DELETE]', error?.message || error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ applicationId: string, brandId: string }> }
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

    const { name, author, description, images_catalogues, datasheet, cover_img_url } = body;

    if (!params.applicationId) {
      return new NextResponse("Application id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return NextResponse.json("unauthorized");
    }    

    const initial = await prismadb.sbaudienceapplication.findFirst({
      where:{
        id: params.applicationId,
        brandId: params.brandId
      },
      select:{
        name: true,
        cover_img_url: true
      }
    })

    if(initial){
      if(initial.name ===  name){

        if (initial.cover_img_url !== cover_img_url) {
          const coverImgPath = path.join(process.cwd(), initial.cover_img_url);
          try {
            await fs.unlink(coverImgPath);
          } catch (error) {
            console.warn(`Could not delete file ${initial.cover_img_url}:`, error);
          }
        }

        //IMAGE CATALOGUES
        const cataloguesImages = await prismadb.image_catalogues.findMany({
          where: {
            applicationId: params.applicationId,
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
            applicationId: params.applicationId,
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
                    productId: '',
                    applicationId: params.applicationId,
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
                    applicationId: params.applicationId
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
            applicationId: params.applicationId,
          },
        });
        let finalfoundDatashset : multipledatasheetproduct[] = []
        datasheetOld.forEach((val) => {
          const found = datasheet.find((value: multipledatasheetproduct) => value.url === val.url);
          
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
            applicationId: params.applicationId,
            url: {
              notIn: finalfoundDatashset.map((val) => val.url),
            },
          },
        });
        if (datasheet.length !== 0) {
          const creations = datasheet.map(async (value: multipledatasheetproduct) => {
            if(value !== null && value !== undefined){
              const alreadyInDB = finalfoundDatashset.some((val) => val.url === value.url);
              if (!alreadyInDB && value.url !== '') {
                await prismadb.multipledatasheetproduct.create({
                  data: {
                    productId: '',
                    applicationId: params.applicationId,
                    url: value.url,
                    name: value.name,
                  }
                });
              }
              else{ //UPDATE NAME
                const datasheet_Id = await prismadb.multipledatasheetproduct.findFirst({
                  where: {
                    url: value.url,
                    applicationId: params.applicationId
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




        // PRODUCT OVERALL
        const updatedApp = await prismadb.sbaudienceapplication.update({
          where: {
            id: params.applicationId,
            brandId: params.brandId
          },
          data: {
            name,
            author,
            slug: slugify(name),
            cover_img_url,
            description,
            updatedAt: new Date(),
            updatedBy: session.name,
          },
        });


        revalidatePath(`/sbaudience/application/${updatedApp.slug}`);
        return NextResponse.json("same")
      }
    }

    const duplicates = await prismadb.sbaudienceapplication.findFirst({
      where:{
        name,
        brandId: params.brandId
      }
    })

    if(duplicates){
      revalidatePath(`/sbaudience/application/${duplicates.slug}`);
      return NextResponse.json("duplicate")
    }





    //IMAGE CATALOGUES
    const cataloguesImages = await prismadb.image_catalogues.findMany({
      where: {
        applicationId: params.applicationId,
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
        applicationId: params.applicationId,
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
                productId: '',
                applicationId: params.applicationId,
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
                applicationId: params.applicationId
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
        applicationId: params.applicationId,
      },
    });
    let finalfoundDatashset : multipledatasheetproduct[] = []
    datasheetOld.forEach((val) => {
      const found = datasheet.find((value: multipledatasheetproduct) => value.url === val.url);
      
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
        applicationId: params.applicationId,
        url: {
          notIn: finalfoundDatashset.map((val) => val.url),
        },
      },
    });
    if (datasheet.length !== 0) {
      const creations = datasheet.map(async (value: multipledatasheetproduct) => {
        if(value !== null && value !== undefined){
          const alreadyInDB = finalfoundDatashset.some((val) => val.url === value.url);
          if (!alreadyInDB && value.url !== '') {
            await prismadb.multipledatasheetproduct.create({
              data: {
                productId: '',
                applicationId: params.applicationId,
                url: value.url,
                name: value.name,
              }
            });
          }
          else{ //UPDATE NAME
            const datasheet_Id = await prismadb.multipledatasheetproduct.findFirst({
              where: {
                url: value.url,
                applicationId: params.applicationId
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


    // PRODUCT OVERALL
    const updatedApp = await prismadb.sbaudienceapplication.update({
      where: {
        id: params.applicationId,
        brandId: params.brandId
      },
      data: {
        name,
        author,
        slug: slugify(name),
        cover_img_url,
        description,
        updatedAt: new Date(),
        updatedBy: session.name
      },
    });

    
    revalidatePath(`/sbaudience/application/${updatedApp.slug}`);

   
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SINGLE_APPLICATION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};