import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { checkAuth, checkBearerAPI, getSession } from "@/lib/actions";
import path from 'path';
import fs from 'fs/promises';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


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
        homepage_catalogues_text
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
          homepage_catalogues_url: true
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

      

      revalidatePath('/contact');
      revalidatePath('/');
      revalidatePath('/sbaudience');
      revalidatePath('/sbaudience/contact');

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
          updatedAt: new Date(),
          createdAt: new Date(),
          userId: session.userId!,
        },
      })


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
        homepage_catalogues_url: true
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
  
    return NextResponse.json(brand);
  } catch (error) {
    console.log('[BRAND_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
