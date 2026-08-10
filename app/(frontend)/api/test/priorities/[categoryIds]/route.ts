import prismadb from "@/lib/prismadb"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: Request,
  props: { params: Promise<{ categoryIds: string }> }
) {
    const params = await props.params;
    try {
        const categoryId = params.categoryIds
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        const x = await prismadb.menupriority.findMany({     
            where: { 
                categoryId: { in: categoryId } 
            },   
        })
        return NextResponse.json(x)
    } catch (error) {
      console.error('[categories] Failed to build category hierarchy', error)
      return NextResponse.json({ error: 'Unable to load categories' }, { status: 500 })
    }
  }
  