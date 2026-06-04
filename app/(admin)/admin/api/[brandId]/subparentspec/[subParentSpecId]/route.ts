import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { checkBearerAPI, getSession } from "@/lib/actions";

const slugify = (str: string): string => {
  const normalizedStr = str.replace(/["“”‟″‶〃״˝ʺ˶ˮײ]/g, "'");
  const strAfterQuote = normalizedStr.includes("'") ? normalizedStr.split("'")[1] : normalizedStr;
  const strBeforeSlash = strAfterQuote?.includes('/') ? strAfterQuote.split('/')[0] : strAfterQuote;
  return strBeforeSlash?.toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/(^-|-$)+/g, '') ?? '';
};

export async function GET(req: Request, props: { params: Promise<{ subParentSpecId: string }> }) {
  const params = await props.params;
  try {
    if (!params.subParentSpecId) {
      return new NextResponse("Sub Parent Spec id is required", { status: 400 });
    }

    const subparentspec = await prismadb.dynamicspecificationsubparent.findUnique({
      where: {
        id: params.subParentSpecId,
      },
    });
  
    return NextResponse.json(subparentspec);
  } catch (error) {
    console.log('[SINGLE_DYNAMIC_SUB_PARENT_SPEC_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  props: { params: Promise<{ subParentSpecId: string }> }
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

    if (!params.subParentSpecId) {
      return new NextResponse("Sub Parent Specification id is required", { status: 400 });
    }
    
    const stillused = await prismadb.specificationconnector.findMany({
      where: {
        dynamicspecificationSubParentId: params.subParentSpecId
      }
    })

    if(stillused.length!=0){
      return NextResponse.json("stillused")
    }

    await prismadb.dynamicspecificationsubparent.deleteMany({
      where: { 
        id: params.subParentSpecId
      },
    });

    return NextResponse.json({ message: 'Sub Parent Specification deleted successfully' }, { status: 200 });
    
  } catch (error: any) {
    console.error('[SINGLE_DYNAMIC_SUB_PARENT_SPEC_DELETE]', error?.message || error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  props: { params: Promise<{ subParentSpecId: string }> }
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

    const { name } = body;

    if (!params.subParentSpecId) {
      return new NextResponse("Sub Parent Specification id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const initial = await prismadb.dynamicspecificationsubparent.findFirst({
      where:{
        id: params.subParentSpecId
      }
    })

    if(initial){
      if(initial.name ===  name){
        await prismadb.dynamicspecificationsubparent.update({
          where: {
            id: params.subParentSpecId
          },
          data: {
            name,
            slug: slugify(name),
            updatedAt: new Date(),
            updatedBy: session.name,
          },
        });

        return NextResponse.json("same")
      }
    }

    const duplicates = await prismadb.dynamicspecificationsubparent.findFirst({
      where:{
        name
      }
    })

    if(duplicates){
      return NextResponse.json("duplicate")
    }

    // PRODUCT OVERALL
    await prismadb.dynamicspecificationsubparent.update({
      where: {
        id: params.subParentSpecId
      },
      data: {
        name,
        slug: slugify(name),
        updatedAt: new Date(),
        updatedBy: session.name
      },
    });

     
    return NextResponse.json("success");
  } catch (error) {
    console.log('[SINGLE_DYNAMIC_SUB_PARENT_SPEC_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};