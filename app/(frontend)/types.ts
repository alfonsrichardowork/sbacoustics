import { allfinishing, image_catalogues, multipledatasheetproduct, Prisma, sbaudienceapplication } from "@prisma/client";

export interface SubCategoryFilters {
    id: string;
    productId: string;
    categoryId: string;
    type: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}

export interface FeaturedProducts {
    id: string;
    name: string;
    slug: string;
    featuredImgUrl: string;
    featuredDesc: string;
}

export interface Size {
    value: number;
    label: string;
}

export interface Searchbox {
    label: string;
    name: string;
    size: string[];
    cat: string[];
    subcat: string[];
    subsubcat: string[];
    productInKits: string[];
    slug: string;
    url: string;
    info: string;
}

export interface AllCategory {
    id: string;
    singularname?: string;
    name: string;
    slug: string;
}

export interface NavbarCategory {
    name: string;
    type: string;
}

export interface NavbarProducts {
    name: string;
    href: string;
    categories: NavbarCategory[]
    url: string;
    navbarNotes: string;
    priority: string;
    newProduct: boolean;
    tempAllFinished?: boolean;
}

export interface FilesProp{
    name: string
    url: string
    productId: string
}

export type FilesWithOrder = FilesProp & {
  order: number
}

export interface SimpleProdTypes {
    ProductId: string
    image_url: string
    name: string
    href: string
}

export interface NewProduct {
    productId: string
    image_url: string
    name: string
    href: string
    navbarNotes: string
}

export interface SpecificationProp {
  parentname: string
  subparentname: string
  child: ChildSpecificationProp[]
}

export interface ChildSpecificationProp {
  childname: string
  value: string
  slug: string
  notes: string
  unit: string
}

export type SingleProductsType = Prisma.productGetPayload<{
  include: {
    size: true,
    images_catalogues: true,
    allCat: {
      include: {
        category: true
      }
    },
    kitsFinishing: {
      include: {
        finishing: true
      }
    },
    multipleDatasheetProduct: true,
    multipleFRDZMAFiles: true,
    multiple3DModels: true,
    similarProducts: true,
    productsUsedInKits: true,
    connectorSpecifications: true
  };
}>;

export interface SingleProducts {
    coverImg: string;
    size: Size;
    images_Catalogues: FilesProp[];
    drawing: string;
    graph: string;
    categories: AllCategory[];
    sub_categories: AllCategory[];
    sub_sub_categories: AllCategory[];
    kitsFinishing: FilesProp[];
    kitsFinishingPreview?: FilesWithOrder[];
    datasheet: FilesProp[];
    frdzma: FilesProp[];
    models3d: FilesProp[];
    similarProds: SimpleProdTypes[];
    productsinKits: SimpleProdTypes[];
    specification: SpecificationProp[];
    id: string;
    name: string;
    desc: string;
    slug: string;
    isKits: boolean;
}

export interface SingleProductMetadata {
    name: string;
    slug: string;
    coverUrl: string;
    coverAlt: string;
    size: Size;
}

export interface SliderData{
  slug: string
  name: string
  minIndex: number // Index in the data array
  maxIndex: number // Index in the data array
  min_index: number // Minimum possible index
  max_index: number // Maximum possible index
  unit: string
  value: number[] // Array of actual values
}

export interface CheckBoxData{
  name: string;
  slug: string;
  value: string[];
  unit: string;
}

export interface activeSlider{
  parentName: string;
  slug: string;
  bottomVal: number;
  topVal: number;
  bottomRealVal: number;
  topRealVal: number;
  unit: string;
}

export interface activeCheckbox{
  parentName: string;
  slug: string;
  name: string;
  unit: string;
}

export interface NavbarComponents{
  title: string,
  href: string,
  parent: string,
  url: string,
  imageDesc: string,
  priority: string,
  newProd: boolean,
  hasProduct: boolean
  tempAllFinished?: boolean;
}

export interface PriorityMenu{
  priorityId: string,
  productId: string,
  productName: string,
  priority: string,
  menuType: string //["Kits", "Drivers", "Sub Drivers", "Sub Sub Drivers"],
  categoryId: string,
  categoryName: string
}

export interface SingleApplicationSBAudience {
  app: sbaudienceapplication
  datasheet: multipledatasheetproduct[]
  img_catalogues: image_catalogues[]
}

export interface AllProductsJsonType {
  name: string
  id: string
  slug: string
  cover_img: string
};

export interface AllFilterProductsOnlyType {
  products: AllProductsJsonType
  size: {
    name: string
    value: string
  },
  specs: ChildSpecificationProp[]
}