// lib/analytics.ts
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { format, parse } from 'date-fns';

function formatDate(yyyymmdd: string): string {
  const parsed = parse(yyyymmdd, 'yyyyMMdd', new Date());
  return format(parsed, 'dd MMMM yyyy'); // → "23 July 2025"
}

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: 'credentials/service-account.json',
});

export async function getMostVisitedPages() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${process.env.NEXT_PUBLIC_PROPERTY_ID}`,
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
  });


    return response.rows?.map(row => ({
        page: row.dimensionValues?.[0]?.value || '',
        views: Number(row.metricValues?.[0]?.value || 0),
    })) || [];
}

export async function getTrafficbyCountry() {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${process.env.NEXT_PUBLIC_PROPERTY_ID}`,
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }],
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    });

    return response.rows?.map(row => ({
        country: row.dimensionValues?.[0]?.value || '',
        users: Number(row.metricValues?.[0]?.value || 0),
    })) || [];
}

export async function getDeviceUsed() {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${process.env.NEXT_PUBLIC_PROPERTY_ID}`,
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'activeUsers' }],
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    });

    return response.rows?.map(row => ({
        device: row.dimensionValues?.[0]?.value || '',
        users: Number(row.metricValues?.[0]?.value || 0),
    })) || [];
}

export async function getTotalVisitorPerDay() {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${process.env.NEXT_PUBLIC_PROPERTY_ID}`,
        dimensions: [{ name: 'date' }, { name: 'month' }, { name: 'year' }],
        metrics: [{ name: 'activeUsers' }],
        dateRanges: [{ startDate: '730daysAgo', endDate: 'today' }],
        orderBys: [
            { dimension: { dimensionName: 'year' } },
            { dimension: { dimensionName: 'month' } },
            { dimension: { dimensionName: 'date' } }],
    });

    return response.rows?.map(row => ({
        year: row.dimensionValues?.[2]?.value || '',
        month: row.dimensionValues?.[1]?.value || '', // e.g. '01' for January
        date: row.dimensionValues?.[0]?.value ? formatDate(row.dimensionValues?.[0]?.value) : '', // format: 'YYYYMMDD'
        users: Number(row.metricValues?.[0]?.value || 0),
    })) || [];
}

// export async function getTotalVisitorPerMonth() {
//     const [response] = await analyticsDataClient.runReport({
//         property: `properties/${process.env.NEXT_PUBLIC_PROPERTY_ID}`,
//         dimensions: [{ name: 'month' }, { name: 'year' }],
//         metrics: [{ name: 'activeUsers' }],
//         dateRanges: [{ startDate: '730daysAgo', endDate: 'today' }],
//         orderBys: [
//             { dimension: { dimensionName: 'year' } },
//             { dimension: { dimensionName: 'month' } },
//         ],
//     });

//     return response.rows?.map(row => ({
//         year: row.dimensionValues?.[1]?.value || '',
//         month: row.dimensionValues?.[0]?.value || '', // e.g. '01' for January
//         users: Number(row.metricValues?.[0]?.value || 0),
//     })) || [];
// }