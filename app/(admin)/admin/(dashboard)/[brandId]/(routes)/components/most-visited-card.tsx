
import { CardContent, CardHeader, CardTitle } from "@/app/(admin)/admin/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  pageReports: { page: string, views: number }[],
  loading: boolean
};

export function MostVisited(props: Props) {
    const topReports = props.pageReports.slice(0, 10);
    const maxViews = Math.max(...topReports.map(r => Number(r.views) || 0));
    return (
        <div className="shadow-lg py-2 rounded-lg border bg-white">
        <CardHeader className="px-4 py-2">
            <div className="flex items-center">
            <CardTitle className="text-base font-bold">Top 10 Most Visited Page (7 Days)</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 h-[300px] overflow-auto"> {props.loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Skeleton className="w-full h-full rounded-md" />
          </div>
        ) : (
            <div className="space-y-4">
                {topReports.map((team, index) => {
                    const views = Number(team.views) || 0;
                    const percent = (Math.log(views + 1) / Math.log(maxViews + 1)) * 100;
                    return (
                        <div key={index} className="relative">
                        <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                           <div
                                className="h-full bg-primary rounded-full flex items-center justify-between px-4 transition-all duration-300"
                                style={{ width: `${percent}%` }}
                                >
                                <span className="text-xs font-medium text-white truncate">
                                    {team.page}
                                </span>
                                <span className="text-xs font-medium text-white truncate text-right">
                                    ({team.views} views)
                                </span>
                            </div>
                        </div>
                        </div>
                    );
                })}
            </div>
        )}
        </CardContent>
        </div>
    )
}
