import { SignedIn, SignOutButton, OrganizationSwitcher } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <nav className='fixed top-0 z-30 flex justify-between items-center w-full py-4 px-6 bg-dark-2'>
      <Link href='/' className='flex gap-4 items-center'>
        <Image src='/assets/logo.svg' alt='Logo Icon' width={28} height={28} />
        <p className='max-sm:hidden flex font-bold text-[20px] text-light-1'>
          Threads
        </p>
      </Link>
      <div className='flex items-center gap-1'>
        <div className='block sm:hidden'>
          <SignedIn>
            <SignOutButton>
              <Image
                src='/assets/logout.svg'
                alt='Logout'
                width={24}
                height={24}
              />
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: { organizationSwitcherTrigger: 'py-2 px-4' },
          }}
        />
      </div>
    </nav>
  );
}
