import React from 'react';

export default function Page() {
  return (
    <section className='sticky right-0 z-20 w-fit h-screen pt-28 bg-dark-2 custom-scrollbar flex flex-col justify-between gap-12 px-10 pb-6 border-l border-l-dark-4 max-xl:hidden'>
      <div className='flex flex-col flex-1'>
        <h2 className='font-medium text-light-1 text-[18px]'>
          Suggested Communities
        </h2>
      </div>
      <div className='flex flex-col flex-1'>
        <h2 className='font-medium text-light-1 text-[18px]'>
          Suggested Users
        </h2>
      </div>
    </section>
  );
}
