import prismadb from "@/lib/prismadb";
import { PriorityForm } from "./components/priority-form";
import { DriversMenu, DriversSBAudienceMenu, DriversSBAutomotiveMenu, KitsMenu, MidrangesSubMenu, MidwoofersSubMenu, OEMMidwoofersSubMenu, OEMSubMenu, SubwoofersDefaultSubMenu, TweetersSubMenu, WidebandersDefaultSubMenu, WoofersSubMenu } from "@/app/(frontend)/utils/navbar-content";
import { NavbarComponents, PriorityMenu } from "@/app/(frontend)/types";


const CategoryPage = async (props: {
    params: Promise<{ brandId: string }>
  }) => {
  const params = await props.params;
  let allSubCat: string[] = []
  let finalData: PriorityMenu[] = []
  let allCat: string[] = []

  if(params.brandId === process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID){
    allCat = ["Kits", "Drivers", "Sub Drivers", "Sub Sub Drivers"]
    const kitsMenu: NavbarComponents[] = KitsMenu.filter((val) => val.hasProduct === true)

    const driverMenu: NavbarComponents[] = DriversMenu.filter((val) => val.hasProduct === true);
    const driversubMenu: NavbarComponents[][] = [
      TweetersSubMenu.filter((val) => val.hasProduct === true),
      MidrangesSubMenu.filter((val) => val.hasProduct === true),
      MidwoofersSubMenu.filter((val) => val.hasProduct === true),
      WoofersSubMenu.filter((val) => val.hasProduct === true),
      OEMSubMenu.filter((val) => val.hasProduct === true),
      WidebandersDefaultSubMenu.filter((val) => val.hasProduct === true),
      SubwoofersDefaultSubMenu.filter((val) => val.hasProduct === true),
    ]
    const driversubsubMenu: NavbarComponents[][] = [
      OEMMidwoofersSubMenu.filter((val) => val.hasProduct === true),
    ]

    allSubCat = [
      ...kitsMenu.map((val) => val.title),
      ...driverMenu.map((val) => val.title),
      ...driversubMenu.flat().map((val) => val.title),
      ...driversubsubMenu.flat().map((val) => val.title),
    ]
    

    const allKitsCat = await prismadb.allproductcategory.findMany({
      where: {
        category: {
          name: {
            in: kitsMenu.map((kit) => kit.title)
          }
        }
      },
      include:{
        category: true
      }
    });
    const allDriversCat = await prismadb.allproductcategory.findMany({
      where: {
        category: {
          name: {
            in: driverMenu.map((driver) =>
              driver.title === 'Widebanders / Full Ranges' ? 'Widebanders' : driver.title
            )
          }
        }
      },
      include:{
        category: true
      }
    });
    const allDriversSubCat = await prismadb.allproductcategory.findMany({
      where: {
        category: {
          name: {
            in: driversubMenu.map((all) => all.map((subdriver) => subdriver.title)).flat()
          }
        }
      },
      include:{
        category: true
      }
    });
    const allDriversSubSubCat = await prismadb.allproductcategory.findMany({
      where: {
        category: {
          name: {
            in: driversubsubMenu.map((all) => all.map((subdriver) => subdriver.title)).flat()
          }
        }
      },
      include:{
        category: true
      }
    });

    const kitsName = await prismadb.product.findMany({
      where: {
        id: {
          in: allKitsCat.map((kit) => kit.productId)
        },
        brandId: params.brandId,
      },
      select:{
        id: true,
        name: true
      }
    })
    const driverName = await prismadb.product.findMany({
      where: {
        id: {
          in: allDriversCat.map((driver) => driver.productId)
        },
        brandId: params.brandId,
      },
      select:{
        id: true,
        name: true
      }
    })
    const driverSubName = await prismadb.product.findMany({
      where: {
        id: {
          in: allDriversSubCat.map((subdriver) => subdriver.productId)
        },
        brandId: params.brandId,
      },
      select:{
        id: true,
        name: true
      }
    })
    const driverSubSubName = await prismadb.product.findMany({
      where: {
        id: {
          in: allDriversSubSubCat.map((subsubdriver) => subsubdriver.productId)
        },
        brandId: params.brandId,
      },
      select:{
        id: true,
        name: true
      }
    })


    const finalKits = await prismadb.menupriority.findMany({
      where: {
        categoryId: {
          in: allKitsCat.map((kit) => kit.categoryId)
        },
        productId: {
          in: allKitsCat.map((kit) => kit.productId)
        }
      }
    })
    const finalDriver = await prismadb.menupriority.findMany({
      where: {
        categoryId: {
          in: allDriversCat.map((driver) => driver.categoryId)
        },
        productId: {
          in: allDriversCat.map((driver) => driver.productId)
        }
      }
    })
    const finalSubDriver = await prismadb.menupriority.findMany({
      where: {
        categoryId: {
          in: allDriversSubCat.map((subdriver) => subdriver.categoryId)
        },
        productId: {
          in: allDriversSubCat.map((subdriver) => subdriver.productId)
        }
      }
    })
    const finalSubSubDriver = await prismadb.menupriority.findMany({
      where: {
        categoryId: {
          in: allDriversSubSubCat.map((subsubdriver) => subsubdriver.categoryId)
        },
        productId: {
          in: allDriversSubSubCat.map((subsubdriver) => subsubdriver.productId)
        }
      }
    })
  

    allKitsCat.map((val) => {
      const found = finalKits.find((value) => value.productId === val.productId && value.categoryId === val.categoryId);
      const name = kitsName.find((value) => value.id === val.productId)

      if (found) {
        let temp : PriorityMenu = {
          priorityId: found.id ?? '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: found.priorityNumber ?? '999',
          menuType: "Kits",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
      else{ //No priority set yet
        let temp : PriorityMenu = {
          priorityId: '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: '999',
          menuType: "Kits",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
    })

    allDriversCat.map((val) => {
      const found = finalDriver.find((value) => value.productId === val.productId && value.categoryId === val.categoryId);
      const name = driverName.find((value) => value.id === val.productId)

      if (found) {
        let temp : PriorityMenu = {
          priorityId: found.id ?? '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: found.priorityNumber ?? '999',
          menuType: "Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
      else{ //No priority set yet
        let temp : PriorityMenu = {
          priorityId: '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: '999',
          menuType: "Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
    })

    allDriversSubCat.map((val) => {
      const found = finalSubDriver.find((value) =>value.productId === val.productId && value.categoryId === val.categoryId);
      const name = driverSubName.find((value) => value.id === val.productId)
      if (found) {
        let temp : PriorityMenu = {
          priorityId: found.id ?? '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: found.priorityNumber ?? '999',
          menuType: "Sub Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
      else{ //No priority set yet
        let temp : PriorityMenu = {
          priorityId: '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: '999',
          menuType: "Sub Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
    })
    
    allDriversSubSubCat.map((val) => {
      const found = finalSubSubDriver.find((value) => value.productId === val.productId && value.categoryId === val.categoryId);
      const name = driverSubSubName.find((value) => value.id === val.productId)    

      if (found) {
        let temp : PriorityMenu = {
          priorityId: found.id ?? '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: found.priorityNumber ?? '999',
          menuType: "Sub Sub Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
      else{ //No priority set yet
        let temp : PriorityMenu = {
          priorityId: '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: '999',
          menuType: "Sub Sub Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
    })
  }
  else if(params.brandId === process.env.NEXT_PUBLIC_SB_AUDIENCE_ID) {
    allCat = ["Drivers"]
    const driverMenu: NavbarComponents[] = DriversSBAudienceMenu.filter((val) => val.hasProduct === true);

    allSubCat = [
      ...driverMenu.map((val) => val.title),
    ]
    
    const allDriversCat = await prismadb.allproductcategory.findMany({
      where: {
        category: {
          name: {
            in: driverMenu.map((driver) => driver.title
            )
          }
        }
      },
      include:{
        category: true
      }
    });
    
    const driverName = await prismadb.product.findMany({
      where: {
        id: {
          in: allDriversCat.map((driver) => driver.productId)
        },
        brandId: params.brandId,
      },
      select:{
        id: true,
        name: true
      }
    })
    const finalDriver = await prismadb.menupriority.findMany({
      where: {
        categoryId: {
          in: allDriversCat.map((driver) => driver.categoryId)
        },
        productId: {
          in: allDriversCat.map((driver) => driver.productId)
        }
      }
    })
    
    allDriversCat.map((val) => {
      const found = finalDriver.find((value) => value.productId === val.productId && value.categoryId === val.categoryId);
      const name = driverName.find((value) => value.id === val.productId)

      if (found) {
        let temp : PriorityMenu = {
          priorityId: found.id ?? '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: found.priorityNumber ?? '999',
          menuType: "Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
      else{ //No priority set yet
        let temp : PriorityMenu = {
          priorityId: '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: '999',
          menuType: "Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
    })
  }
  else{
    allCat = ["Drivers"]
    const driverMenu: NavbarComponents[] = DriversSBAutomotiveMenu.filter((val) => val.hasProduct === true);

    allSubCat = [
      ...driverMenu.map((val) => val.title),
    ]
    
    const allDriversCat = await prismadb.allproductcategory.findMany({
      where: {
        category: {
          name: {
            in: driverMenu.map((driver) => driver.title
            )
          }
        }
      },
      include:{
        category: true
      }
    });
    
    const driverName = await prismadb.product.findMany({
      where: {
        id: {
          in: allDriversCat.map((driver) => driver.productId)
        },
        brandId: params.brandId,
      },
      select:{
        id: true,
        name: true
      }
    })
    const finalDriver = await prismadb.menupriority.findMany({
      where: {
        categoryId: {
          in: allDriversCat.map((driver) => driver.categoryId)
        },
        productId: {
          in: allDriversCat.map((driver) => driver.productId)
        }
      }
    })
    
    allDriversCat.map((val) => {
      const found = finalDriver.find((value) => value.productId === val.productId && value.categoryId === val.categoryId);
      const name = driverName.find((value) => value.id === val.productId)

      if (found) {
        let temp : PriorityMenu = {
          priorityId: found.id ?? '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: found.priorityNumber ?? '999',
          menuType: "Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
      else{ //No priority set yet
        let temp : PriorityMenu = {
          priorityId: '',
          productId: name?.id ?? '',
          productName: name?.name ?? '',
          priority: '999',
          menuType: "Drivers",
          categoryId: val.categoryId ?? '',
          categoryName: val.category?.name ?? ''
        }
        finalData.push(temp)
      }
    })
  }

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PriorityForm 
          initialData = {finalData}
          allCat = {allCat}
          allSubCat = {allSubCat}
          // allprodCat={perProdArray}
          // priorityNum={priorityNum}
        />
      </div>
    </div>
  );
}

export default CategoryPage;
