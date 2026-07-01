import prismadb from "@/lib/prismadb";
import test, { expect } from "@playwright/test";

const products = await prismadb.product.findMany({
    where: {
        brandId: process.env.NEXT_PUBLIC_SB_AUDIENCE_ID,
        isArchived: false
    },
    select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        cover_img_url: true,
        drawing_img_url: true,
        graph_img_url: true,
        images_catalogues: {
            select: {
                name: true,
                url: true
            },
            orderBy: {
                name: 'asc'
            }
        },
        similarProducts: {
            select: {
                similarProduct: {
                    select: {
                        name: true,
                        slug: true,
                        cover_img_url: true,
                    }
                }
            },
            orderBy: {
                similarProduct: {
                    name: 'asc'
                }
            }
        },
        multipleDatasheetProduct: {
            select: {
                url: true,
                name: true,
            },
            orderBy: {
                name: 'asc'
            }
        },
        multipleFRDZMAFiles: {
            select: {
                url: true,
                name: true,
            },
            orderBy: {
                name: 'asc'
            }
        },
        multiple3DModels: {
            select: {
                url: true,
                name: true,
            },
            orderBy: {
                name: 'asc'
            }
        },
        size: {
            select: {
                name: true,
                value: true,
            }
        }
    },
});
for (const val of products) {
  test(`Product page - ${val.slug}`, async ({ page }) => {
    await page.goto(`/sbaudience/products/${val.slug}`);

    //Main Title
        await expect(
          page.getByTestId('main-title-single-product-page')
        ).toContainText(val.name);
    
        //Main Cover Image
        await expect(
          page.getByTestId('cover-image-single-product-page')
                    .filter({ visible: true })
        ).toHaveAttribute('alt', new RegExp(val.name, 'i'));
    
        // Image catalogues
        for (const [index, imageCatalogue] of val.images_catalogues.entries()) {
          await expect(
            page.getByTestId(`image-catalogues-${index}-single-product-page`)
                    .first()
          ).toHaveAttribute('alt', imageCatalogue.name);
        }
    
        // Drawing image
        if (val.drawing_img_url) {
          await expect(
            page.getByTestId('drawing-image-single-product-page')
                    .first()
          ).toHaveAttribute(
            'alt',
            `${val.name} - Drawing Image`
          );
        }
    
        // Frequency response
        if (val.graph_img_url) {
          await expect(
            page.getByTestId('frequency-response-image-single-product-page')
                    .first()
          ).toHaveAttribute(
            'alt',
            `${val.name} - Frequency Response`
          );
        }
    
        // Multiple Datasheet
        if (val.multipleDatasheetProduct && val.multipleDatasheetProduct.length > 0) {
            for (const [index, datasheet] of val.multipleDatasheetProduct.entries()) {
                await expect(
                    page.getByTestId(`multiple-datasheet-${index}-single-product-page`)
                    .filter({ visible: true })
                ).toContainText(datasheet.name);
                await expect(
                    page.getByTestId(`multiple-datasheet-${index}-single-product-page`)
                    .filter({ visible: true })
                ).toHaveAttribute(
                    'href',
                    `${datasheet.url ?? '/'}`
                );
            }
        }
        
        // FRD ZMA
        if (val.multipleFRDZMAFiles && val.multipleFRDZMAFiles.length > 0) {
            for (const [index, frdzma] of val.multipleFRDZMAFiles.entries()) {
                await expect(
                    page.getByTestId(`multiple-frd-zma-${index}-single-product-page`)
                    .filter({ visible: true })
                ).toContainText(frdzma.name);
                await expect(
                    page.getByTestId(`multiple-frd-zma-${index}-single-product-page`)
                    .filter({ visible: true })
                ).toHaveAttribute(
                    'href',
                    `${frdzma.url ?? '/'}`
                );
            }
        }
        
        // 3D Model
        if (val.multiple3DModels && val.multiple3DModels.length > 0) {
            for (const [index, model] of val.multiple3DModels.entries()) {
                await expect(
                    page.getByTestId(`multiple-3d-model-${index}-single-product-page`)
                    .filter({ visible: true })
                ).toContainText(model.name);
                await expect(
                    page.getByTestId(`multiple-3d-model-${index}-single-product-page`)
                    .filter({ visible: true })
                ).toHaveAttribute(
                    'href',
                    `${model.url ?? '/'}`
                );
            }
        }
        
        // Similar Products
        if (val.similarProducts && val.similarProducts.length > 0) {
            for (const [index, similar] of val.similarProducts.entries()) {
                await expect(
                    page.getByTestId(`similar-product-${index}-single-product-page`)
                    .filter({ visible: true })
                ).toContainText(similar.similarProduct.name);
                await expect(
                    page.getByTestId(`similar-product-${index}-single-product-page`)
                    .filter({ visible: true })
                ).toHaveAttribute(
                    'href',
                    `/sbaudience/products/${similar.similarProduct.slug}`
                );
            }
        }
  });
}