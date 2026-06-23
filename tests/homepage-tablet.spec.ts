import { test, expect } from '@playwright/test';

test('Has Main Metadata Root Page', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('SB Acoustics | Building Your Sound');
});

test.describe('Featured Product Mobile', () => {
  test('Featured Product Swiper OK', async ({ page }) => {
    await page.goto('/');

    // Swiper exists
    const swiper = page.getByTestId('featured-products-swiper-mobile-overall');
    await expect(swiper).toBeVisible();

    // Slides exist
    const slides = page.getByTestId('featured-products-swiper-mobile-slide');
    const count = await slides.count();
    expect(count).toBeGreaterThan(0);

    // First slide image
    const image = page.getByTestId('featured-products-swiper-mobile-main-image').first();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('src', /.+/);

    // First slide title
    const title = page.getByTestId('featured-products-swiper-mobile-title-1').first();
    await expect(title).toBeVisible();
    await expect(title).toContainText(/\S+/);

    // First slide title
    // const desc = page.getByTestId('featured-products-swiper-mobile-description').first();
    // await expect(desc).toBeVisible();
    // await expect(desc).toContainText(/\S+/);

    // First slide button
    const button = page.getByTestId('featured-products-swiper-mobile-button').first();
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Product Page');

    // Dot navigation works
    // if (count > 1) {
    //   const before = await title.textContent();
    //   await page.getByTestId('featured-products-swiper-mobile-pagination-dot-1').click();

    //   await expect
    //     .poll(async () =>
    //       page.getByTestId('featured-products-swiper-mobile-title-1').first().textContent()
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
