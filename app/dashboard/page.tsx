import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';

 
export default async function Page() {
  return (
    <main>
       <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dear journaler,
      </h1> 

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChart />
         {/* <Suspense fallback={<RevenueChartSkeleton />}>
          <DDebrief  /> 
         </Suspense>
         <Suspense fallback={< LatestInvoicesSkeleton />}>
          <RandomEntry  /> 
         </Suspense>   */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <Suspense> */}
          {/* <RandomPicks /> */}
        {/* </Suspense> */}
        {/* <Suspense>
          <WeeklyIdea />
        </Suspense>
        <Suspense>
          <DaiyIdea />
        </Suspense> */}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense> */}
      </div>




      
    </main>
  );
}