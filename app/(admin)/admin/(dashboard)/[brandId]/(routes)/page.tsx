'use client';

import { Heading } from "@/app/(admin)/admin/components/ui/heading";
import { useEffect, useState } from "react";
import { MostVisited } from "./components/most-visited-card";
import { LiveVisitor } from "./components/live-visitor-card";
import { Card } from "@/app/(admin)/admin/components/ui/card";
import { CountryVisitor } from "./components/visitor-by-country-card";
import { VisitorDevice } from "./components/visitor-device";
import { Button } from "@/app/(admin)/admin/components/ui/button";
import { Separator } from "@/app/(admin)/admin/components/ui/separator";
import { getSession } from "@/lib/actions";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { VisitorDeviceSmall } from "./components/visitor-device-card-small";
import { VisitorByCountrySmall } from "./components/visitor-by-country-card-small";
import { MostVisitorSmall } from "./components/most-visited-card-small";
import { LiveVisitorSmall } from "./components/live-visitor-card-small";

function getLastMonths(data: { year: string, month: string, date: string, users: number }[], count: number) {
  const result: typeof data = [];
  const seenMonths = new Set<string>();

  // Go backwards
  for (let i = data.length - 1; i >= 0; i--) {
    const item = data[i];
    if(item){
      const key = `${item.year}-${item.month}`;

      result.unshift(item); // insert at beginning
      seenMonths.add(key);

      if (seenMonths.size >= count) break;
    }
  }

  return result;
}

function DashboardPage () {
  const [mostVisitedPageReport, setMostVisitedPageReport] = useState<{ page: string; views: number }[]>([]);
  const [trafficByCountry, setTrafficByCountry] = useState<{ country: string; users: number }[]>([]);
  const [deviceUsed, setDeviceUsed] = useState<{ device: string; users: number }[]>([]);
  const [totalVisitorPerDay, setTotalVisitorPerDay] = useState<{ year: string, month: string, date: string; users: number }[]>([]);
  const [totalVisitor, setTotalVisitor] = useState<{ year: string, month: string, date: string; users: number }[]>([]);
  const [counterMonth, setCounterMonth] = useState<number>(0);
  const [visitorConstraint, setVisitorConstraint] = useState<string>('Weekly')
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const session = await getSession();
        if(!session.isLoggedIn){
          redirect("/admin")
        }
        session.isAdmin && setIsAdmin(true)
      } catch (error) {
        console.error('Error fetching data:', error);
        document.body.style.overflow = '';
      }
    };

    fetchData();
    fetch('/admin/api/analytics')
      .then(res => res.json())
      .then(data => [setMostVisitedPageReport(data.mostvisited || []), setTrafficByCountry(data.trafficbycountry || []), setDeviceUsed(data.deviceused || []), setTotalVisitor(data.totalvisitorperday || []), setLoading(false)])

  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 py-4">
        {/* <Heading title="Overview" description="" /> */}
        {/* <Separator /> */}



        {isAdmin &&
          <>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
              <div className="col-span-1">
                {loading ? 
                  <div className="w-full bg-background rounded-xl border min-h-36 transition duration-300">
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                :
                <LiveVisitorSmall LiveVisitor={getLastMonths(totalVisitor, 14)}/>
                }
              </div>
              <div className="col-span-1">
                {loading ? 
                  <div className="w-full bg-background rounded-xl border min-h-36 transition duration-300">
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                :
                <MostVisitorSmall pageReports={mostVisitedPageReport}/>
                }
              </div>
              <div className="col-span-1">
                {loading ? 
                  <div className="w-full bg-background rounded-xl border min-h-36 transition duration-300">
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                :
                <VisitorByCountrySmall LiveVisitor={trafficByCountry}/>
                }
              </div>
              <div className="col-span-1">
                {loading ? 
                  <div className="w-full bg-background rounded-xl border min-h-36 transition duration-300">
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                :
                <VisitorDeviceSmall LiveVisitor={deviceUsed}/>
                }
              </div>
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-4">
              <div className="col-span-1">
                {loading ? 
                  <div className="w-full bg-background rounded-xl border min-h-[300px] transition duration-300">
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                :
                  <Card className="p-4 rounded-lg border bg-white">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold">{visitorConstraint} Visitor Trends</h2>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => [setVisitorConstraint('Weekly'), setTotalVisitorPerDay(totalVisitor.slice(totalVisitor.length - 7, totalVisitor.length))]} className={`${visitorConstraint === 'Weekly' ? 'bg-primary text-white' : ''}`}>
                          Weekly
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => [setVisitorConstraint('Monthly'), setTotalVisitorPerDay(getLastMonths(totalVisitor, 2))]} className={`${visitorConstraint === 'Monthly' ? 'bg-primary text-white' : ''}`}>
                          Monthly
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => [setVisitorConstraint('Yearly'), setTotalVisitorPerDay(getLastMonths(totalVisitor, 13)), setCounterMonth(12)]} className={`${visitorConstraint === 'Yearly' ? 'bg-primary text-white' : ''}`}>
                          Yearly
                        </Button>
                      </div>
                    </div>
                    <LiveVisitor LiveVisitor={totalVisitorPerDay.length > 0 ? totalVisitorPerDay : totalVisitor.slice(totalVisitor.length - 7, totalVisitor.length)} counterMonth={counterMonth}/>
                  </Card>
                }
              </div>
              <div className="col-span-1">
                {loading ? 
                  <div className="w-full bg-background rounded-xl border min-h-[300px] transition duration-300">
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                :
                  <Card className="p-4 rounded-lg border bg-white">
                    <div className=" flex items-center justify-between">
                      <h2 className="text-base font-bold">Device Usage</h2>
                    </div>
                    <VisitorDevice LiveVisitor={deviceUsed}/>
                  </Card>
                }
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1">
                {loading ? 
                  <div className="w-full bg-background rounded-xl border min-h-[300px] transition duration-300">
                    <Skeleton className="w-full h-full rounded-md" />
                  </div>
                :
                  <Card className="p-4 rounded-lg border bg-white">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-base font-bold">Visitor Nationality</h2>
                    </div>
                    <CountryVisitor LiveVisitor={trafficByCountry.slice(0,5)}/>
                  </Card>
                }
              </div>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default DashboardPage;
