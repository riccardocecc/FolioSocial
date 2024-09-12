'use client';
import { removeSaveQuote, saveQuote } from '@/lib/actions/quote.actions';
import { removeSaveReview, saveReview } from '@/lib/actions/review.actions';
import { removeSaveImage, saveImage } from '@/lib/actions/user.actions';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface Props {
  fromUserId: string;
  type:"quote" | "review" | "picture";
  toElement:string;

  isSaved: boolean;
 
}

const SaveToggle = ({ fromUserId, toElement,type, isSaved }: Props) => {
  const [isClicked, setIsClicked] = useState<boolean>(isSaved);

  const path = usePathname();

  const handleClick = async () => {
    if (isClicked) {
      if(type==="quote")
        await removeSaveQuote({ fromUserId, toElement,path });
      if(type==="review")
        await removeSaveReview({ fromUserId, toElement,path });
      if(type==="picture")
        await removeSaveImage({ fromUserId, toElement,path });

    } else {
      if(type==="quote")
        await saveQuote({ fromUserId, toElement,path });
      if(type==="review")
        await saveReview({ fromUserId, toElement,path });
      if(type==="picture")
        await saveImage({ fromUserId, toElement,path });

    }
    setIsClicked(!isClicked);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer object-contain">
      {isClicked || isSaved ? (
        <div className="flex justify-center items-center flex-row space-x-5">
          <img
            src="/assets/bookMarkFill.svg"
            alt="heart filled"
            width={24}
            height={24}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-row space-x-5">
          <img
            src="/assets/bookMarkEmpty.svg"
            alt="heart"
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  );
};

export default SaveToggle;
