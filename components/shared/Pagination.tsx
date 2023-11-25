'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface PaginationProps {
  isNext: boolean;
  pageNumber: number;
  path: string;
}

export default function Page({ isNext, path, pageNumber }: PaginationProps) {
  const router = useRouter();
  if (!isNext && pageNumber === 1) return null;
  const handleNavigation = (type: string) => {
    let nextPageNumber = pageNumber;
    if (type === 'prev') {
      nextPageNumber = pageNumber - 1;
    } else if (type === 'next') {
      nextPageNumber = pageNumber + 1;
    }

    if (nextPageNumber > 1) {
      router.push(`/${path}?page=${nextPageNumber}`);
    } else {
      router.push(`/${path}`);
    }
  };
  return (
    <div className='flex justify-center items-center gap-10 mt-10'>
      <Button
        className='text-sm text-light-2'
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
      >
        Prev
      </Button>
      <p className='text-light-1 text-sm text-semibold'>{pageNumber}</p>
      <Button
        className='text-sm text-light-2'
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
      >
        Next
      </Button>
    </div>
  );
}
