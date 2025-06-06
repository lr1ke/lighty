

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import pic1 from '@/app/public/1.jpg';


export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end text-white rounded-lg bg-[#0c2040] p-4 md:h-52">

        Lighty

      </div>
      <div className="mt-4 flex grow flex-col gap-4 text-white md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-[#0a3c5e] px-6 py-10 md:w-2/5 md:px-20">
      
          <p className={`${lusitana.className} text-xl text-teal-500 md:text-3xl md:leading-normal`}>
            <strong>Welcome to Lighty.</strong> This is a collective diary, a collaborative writing experiment, 
            a decentralized journaling interface, 
              an inquiry into the meaning behind the slogan <a href="  https://direct.mit.edu/books/edited-volume/4698/chapter-abstract/215211/Words-Works-Worlds?redirectedFrom=PDF " className="text-white"> "words, works, worlds" </a> 
              and a question: what if the stars were made by us? 
              
          </p>
          <Link
            href="/dashboard/"
            className="flex items-center gap-5 self-start rounded-lg hover:bg-teal-900/20 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0c2040] md:text-base"
          >
            <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center rounded-lg p-6 md:w-3/5 md:px-28 md:py-12 bg-[#0c2040]">
        <Image 
          src="/pic1.jpeg" 
          alt="Star" 
          layout="responsive" 
          width={16} 
          height={9} 
          className="rounded-lg shadow-lg" 
        />
      </div>
      </div>
    </main>
  );
}