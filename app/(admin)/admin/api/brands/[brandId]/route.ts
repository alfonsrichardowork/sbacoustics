import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/lib/actions";
import path from 'path';
import fs from 'fs/promises';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { multipleaboutusimages } from "@prisma/client";


export async function PATCH(req: Request, props: { params: Promise<{ brandId: string }> }) {
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
    
    if(!session.isAdmin){
      return NextResponse.json("not_admin")
    }

    const body = await req.json();

    const {
      data: {
        name,
        telephone,
        email,
        address,
        maps,
        cover,
        homepage_brand_choice_url,
        homepage_open_source_kits_url,
        homepage_about_us_url,
        homepage_catalogues_url,
        homepage_brand_choice_text,
        homepage_open_source_kits_text,
        homepage_about_us_text,
        homepage_catalogues_text,
        aboutUsImages,
        brand_desc,
        sbe_desc,
        mission_values_desc
      },
      socials,
    } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }

    if (!session.isLoggedIn) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return new NextResponse("Unauthorized", { status: 405 });
    }
    


    if(params.brandId != 'new'){
      const oldUrl = await prismadb.brand.findFirst({
        where: {
          id: params.brandId
        },
        select:{
          cover: true,
          homepage_brand_choice_url: true,
          homepage_open_source_kits_url: true,
          homepage_about_us_url: true,
          homepage_catalogues_url: true,
          aboutUsImages: true
        }
      })
      //Delete physical files
      if(oldUrl) {
        if(oldUrl.cover != cover) {
          const imgPath = path.join(process.cwd(), oldUrl.cover);
          try {
            await fs.unlink(imgPath);
          } catch (error) {
            console.warn(`Could not delete file ${oldUrl.cover}:`, error);
          }
        }
        if(oldUrl.homepage_brand_choice_url != homepage_brand_choice_url) {
          const imgPath = path.join(process.cwd(), oldUrl.homepage_brand_choice_url);
          try {
            await fs.unlink(imgPath);
          } catch (error) {
            console.warn(`Could not delete file ${oldUrl.homepage_brand_choice_url}:`, error);
          }
        }
        if(oldUrl.homepage_open_source_kits_url != homepage_open_source_kits_url) {
          const imgPath = path.join(process.cwd(), oldUrl.homepage_open_source_kits_url);
          try {
            await fs.unlink(imgPath);
          } catch (error) {
            console.warn(`Could not delete file ${oldUrl.homepage_open_source_kits_url}:`, error);
          }
        }
        if(oldUrl.homepage_about_us_url != homepage_about_us_url) {
          const imgPath = path.join(process.cwd(), oldUrl.homepage_about_us_url);
          try {
            await fs.unlink(imgPath);
          } catch (error) {
            console.warn(`Could not delete file ${oldUrl.homepage_about_us_url}:`, error);
          }
        }
        if(oldUrl.homepage_catalogues_url != homepage_catalogues_url) {
          const imgPath = path.join(process.cwd(), oldUrl.homepage_catalogues_url);
          try {
            await fs.unlink(imgPath);
          } catch (error) {
            console.warn(`Could not delete file ${oldUrl.homepage_catalogues_url}:`, error);
          }
        }
        // if(oldUrl.aboutUsImages != aboutUsImages) {
        //   const aboutImages = await prismadb.multipleaboutusimages.findMany({
        //     where: {
        //       brandId: params.brandId,
        //     },
        //   });
        //   let finalfound : multipleaboutusimages[] = []
        //   aboutImages.forEach((val) => {
        //     const found = aboutUsImages.find((value: multipleaboutusimages) => value.url === val.url);
            
        //     if (found && !finalfound.some((item) => item.url === found.url)) {
        //       finalfound.push(found);
        //     }
        //   });
        //   //DELETE IMAGE CATALOGUES
        //   //Delete physical files
        //   for (const image of aboutImages) {
        //     const isInFinal = finalfound.some((item) => item.url === image.url);
        //     if (isInFinal) continue;

        //     if (image.url) {
        //       const imagePath = path.join(process.cwd(), image.url);

        //       try {
        //         await fs.unlink(imagePath);
        //       } catch (error) {
        //         console.warn(`Could not delete file ${image.url}:`, error);
        //       }
        //     }
        //   }
        //   //Delete Image_catalogues records
        //   await prismadb.multipleaboutusimages.deleteMany({
        //     where: {
        //       brandId: params.brandId,
        //       url: {
        //         notIn: finalfound.map((val) => val.url),
        //       },
        //     },
        //   });
        //   if (aboutUsImages.length !== 0) {
        //     const creations = aboutUsImages.map(async (value: multipleaboutusimages) => {
        //       if(value !== null && value !== undefined){
        //         const alreadyInDB = finalfound.some((val) => val.url === value.url);
        //         if (!alreadyInDB && value.url !== '') {
        //           await prismadb.multipleaboutusimages.create({
        //             data: {
        //               brandId: params.brandId,
        //               type: value.type,
        //               desc: value.desc,
        //               url: value.url,
        //               name: value.name,
        //             }
        //           });
        //         }
        //         else{ //UPDATE NAME
        //           const multiple_about_us_image_Id = await prismadb.multipleaboutusimages.findFirst({
        //             where: {
        //               url: value.url,
        //               brandId: params.brandId
        //             },
        //             select: {
        //               id: true
        //             }
        //           })
        //           if (multiple_about_us_image_Id) {
        //             await prismadb.multipleaboutusimages.update({
        //               where: {
        //                 id: multiple_about_us_image_Id.id
        //               },
        //               data: {
        //                 name: value.name,
        //                 desc: value.desc,
        //                 url: value.url,
        //                 type: value.type,
        //               },
        //             });
        //           }
        //         }
        //       }
        //     });

        //     await Promise.all(creations);
        //   }
        // }
      }

      await prismadb.brand.updateMany({
        where: {
          id: params.brandId
        },
        data: {
          name,
          telephone,
          email,
          address,
          maps,
          cover,
          homepage_brand_choice_url,
          homepage_open_source_kits_url,
          homepage_about_us_url,
          homepage_catalogues_url,
          homepage_brand_choice_text,
          homepage_open_source_kits_text,
          homepage_about_us_text,
          homepage_catalogues_text,
          brand_desc,
          sbe_desc,
          mission_values_desc,
          updatedAt: new Date(),
        },
      })

      await prismadb.socialmedia.deleteMany({
        where: {
          brandId: params.brandId
        }
      })
      
      if(socials && socials.length > 0){
        await prismadb.socialmedia.createMany({
          data: socials.map((social: any) => ({
            brandId: params.brandId,   // ✅ important for relation
            type: social.network,
            value: social.link,
            updatedBy: session.userId,
            createdAt: new Date(),
            updatedAt: new Date()
          })),
        })
      }

      await prismadb.multipleaboutusimages.deleteMany({
        where: {
          brandId: params.brandId
        }
      })
      
      if(aboutUsImages && aboutUsImages.length > 0){
        await prismadb.multipleaboutusimages.createMany({
          data: aboutUsImages.map((val: multipleaboutusimages) => ({
            brandId: params.brandId,   // ✅ important for relation
            type: val.type,
            name: val.name,
            desc: val.desc,
            url: val.url
          })),
        })
      }
      

      revalidatePath('/contact');
      revalidatePath('/');
      revalidatePath('/sbaudience');
      revalidatePath('/sbaudience/contact');
      revalidatePath('/sbautomotive');
      revalidatePath('/sbautomotive/contact');

    }
    else{
      const duplicates = await prismadb.brand.findFirst({
        where:{
          name
        }
      })

      if(duplicates){
        return NextResponse.json("duplicate")
      }

      const newBrand = await prismadb.brand.create({
        data: {
          name,
          telephone,
          email,
          address,
          maps,
          cover,
          homepage_brand_choice_url,
          homepage_open_source_kits_url,
          homepage_about_us_url,
          homepage_catalogues_url,
          homepage_brand_choice_text,
          homepage_open_source_kits_text,
          homepage_about_us_text,
          homepage_catalogues_text,
          brand_desc,
          sbe_desc,
          mission_values_desc,
          updatedAt: new Date(),
          createdAt: new Date(),
          userId: session.userId!,
        },
      })

      

      if(aboutUsImages && aboutUsImages.length > 0){
        await prismadb.multipleaboutusimages.createMany({
          data: aboutUsImages.map((val: multipleaboutusimages) => ({
            brandId: newBrand.id,   // ✅ important for relation
            name: val.name,
            type: val.type,
            url: val.url,
            desc: val.desc
          })),
        })
      }


      if(socials && socials.length > 0){
        await prismadb.socialmedia.createMany({
          data: socials.map((social: any) => ({
            brandId: newBrand.id,   // ✅ important for relation
            type: social.network,
            value: social.link,
            updatedBy: session.userId,
            createdAt: new Date(),
            updatedAt: new Date()
          })),
        })
      }


      revalidatePath('/contact');
      revalidatePath('/');
      revalidatePath('/sbaudience');
      revalidatePath('/sbaudience/contact');
      revalidatePath('/sbautomotive');
      revalidatePath('/sbautomotive/contact');

    }

    await prismadb.roles.updateMany({
      where: {
        brandId: params.brandId
      },
      data: {
        brandName: name,
      }
    });
  
    return NextResponse.json("success");
  } catch (error) {
    console.log('[BRAND_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(req: Request, props: { params: Promise<{ brandId: string }> }) {
  const params = await props.params;
  try {
    const session = await getSession();

    if(!session.isLoggedIn){
      redirect("/admin")
    }

    if (!params.brandId) {
      return new NextResponse("Brand id is required", { status: 400 });
    }
    
    if (!session.isLoggedIn) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    
    if(!(await checkAuth(session.isAdmin!, params.brandId, session.userId!))){
      return new NextResponse("Unauthorized", { status: 405 });
    }
    
  
    const oldUrl = await prismadb.brand.findFirst({
      where: {
        id: params.brandId
      },
      select:{
        cover: true,
        homepage_brand_choice_url: true,
        homepage_open_source_kits_url: true,
        homepage_about_us_url: true,
        homepage_catalogues_url: true,
        aboutUsImages: true
      }
    })
    //Delete physical files
    if(oldUrl) {
      if(oldUrl.cover != '') {
        const imgPath = path.join(process.cwd(), oldUrl.cover);
        try {
          await fs.unlink(imgPath);
        } catch (error) {
          console.warn(`Could not delete file ${oldUrl.cover}:`, error);
        }
      }
      if(oldUrl.homepage_brand_choice_url != '') {
        const imgPath = path.join(process.cwd(), oldUrl.homepage_brand_choice_url);
        try {
          await fs.unlink(imgPath);
        } catch (error) {
          console.warn(`Could not delete file ${oldUrl.homepage_brand_choice_url}:`, error);
        }
      }
      if(oldUrl.homepage_open_source_kits_url != '') {
        const imgPath = path.join(process.cwd(), oldUrl.homepage_open_source_kits_url);
        try {
          await fs.unlink(imgPath);
        } catch (error) {
          console.warn(`Could not delete file ${oldUrl.homepage_open_source_kits_url}:`, error);
        }
      }
      if(oldUrl.homepage_about_us_url != '') {
        const imgPath = path.join(process.cwd(), oldUrl.homepage_about_us_url);
        try {
          await fs.unlink(imgPath);
        } catch (error) {
          console.warn(`Could not delete file ${oldUrl.homepage_about_us_url}:`, error);
        }
      }
      if(oldUrl.homepage_catalogues_url != '') {
        const imgPath = path.join(process.cwd(), oldUrl.homepage_catalogues_url);
        try {
          await fs.unlink(imgPath);
        } catch (error) {
          console.warn(`Could not delete file ${oldUrl.homepage_catalogues_url}:`, error);
        }
      }
      if(oldUrl.aboutUsImages != null){ 
        oldUrl.aboutUsImages.map( async (val) => {
          const imgPath = path.join(process.cwd(), val.url);
          try {
            await fs.unlink(imgPath);
          } catch (error) {
            console.warn(`Could not delete file ${val.url}:`, error);
          } 
        })
      }
    }

    const brand = await prismadb.brand.deleteMany({
      where: {
        id: params.brandId
      }
    });

    await prismadb.socialmedia.deleteMany({
      where: {
        brandId: params.brandId
      }
    })
    await prismadb.multipleaboutusimages.deleteMany({
      where: {
        brandId: params.brandId
      }
    })
  
    return NextResponse.json(brand);
  } catch (error) {
    console.log('[BRAND_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
