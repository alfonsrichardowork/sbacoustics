import { test, expect } from '@playwright/test';

test('Metadata Homepage', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('SB Acoustics | Building Your Sound');
});

test.describe('Featured Product Desktop', () => {
  test('Featured Product Swiper OK', async ({ page }) => {
    await page.goto('/');

    // Swiper exists
    const swiper = page.getByTestId('featured-products-swiper-desktop-overall');
    await expect(swiper).toBeVisible();

    // Slides exist
    const slides = page.getByTestId('featured-products-swiper-desktop-slide');
    const count = await slides.count();
    expect(count).toBeGreaterThan(0);

    // First slide image
    const image = page.getByTestId('featured-products-swiper-desktop-main-image').first();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', /.+/);

    // First slide title
    const title = page.getByTestId('featured-products-swiper-desktop-title-1').first();
    await expect(title).toBeVisible();
    await expect(title).toContainText(/\S+/);

    // First slide title
    const desc = page.getByTestId('featured-products-swiper-desktop-description').first();
    await expect(desc).toBeVisible();
    await expect(desc).toContainText(/\S+/);

    // First slide button
    const button = page.getByTestId('featured-products-swiper-desktop-button').first();
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Product Page');


    // const slideIndex = Number(
    //   await page.locator('.swiper-slide-active')
    //   .getAttribute('data-index')
    // );
    // const buttonIndex = Number(
    //   await page.locator('.bg-primary.scale-125')
    //     .getAttribute('data-index')
    // );
    // expect(buttonIndex).toBe(slideIndex);




    const dots = page.locator(
      '[data-testid^="featured-products-swiper-desktop-pagination-dot-"]'
    );

    const counts = await dots.count();

    for (let i = 0; i < counts; i++) {
      await dots.nth(i).click();

      const activeSlide = page.locator('.swiper-slide-active');
      // Active slide index
      await expect(
        activeSlide
      ).toHaveAttribute('data-index', i.toString());
      // Active button index
      await expect(
        page.locator('.bg-primary.scale-125')
      ).toHaveAttribute('data-index', i.toString());

      //Title, Image, and Button (Desc is optional so no check)
      await expect(
        activeSlide.locator('[data-testid^="featured-products-swiper-desktop-title-"]')
      ).toBeVisible();

      await expect(
        activeSlide.locator('[data-testid="featured-products-swiper-desktop-main-image"]')
      ).toBeVisible();

      await expect(
        activeSlide.locator('[data-testid="featured-products-swiper-desktop-button"]')
      ).toBeVisible();

    }

    // await page
    //   .getByTestId('featured-products-swiper-desktop-pagination-dot-2')
    //   .click();

    // await expect.poll(async () =>
    //   activeTitle.textContent()
    // ).not.toEqual(before);





    // Dot navigation works
    // if (count > 1) {
    //   const before = await title.textContent();
    //   await page.getByTestId('featured-products-swiper-desktop-pagination-dot-1').click();

    //   await expect
    //     .poll(async () =>
    //       page.getByTestId('featured-products-swiper-desktop-title-1').first().textContent()
    //     )
    //     .not.toEqual(before);
    // }

    // // Product page navigation works
    // const href = await button.getAttribute('href');
    // await button.click();
    // await expect(page).toHaveURL(
    //   new RegExp(href!)
    // );
  });

  // test('categories section OK', async ({ page }) => {
  //   ...
  // });

  // test('footer OK', async ({ page }) => {
  //   ...
  // });
});