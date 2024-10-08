import React, { useState } from 'react'
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea"

import { Input } from "@/components/ui/input"
import ImageUpload from './ImageUpload';

interface AddQuoteProps {
    quote: string;
    setQuote: (quote: string) => void;
    page: string,
    setPage: (page: string) => void;
    index: number;
    onRemove: (index: number) => void;
}
const Quote = ({ index, onRemove, quote, setQuote, page, setPage }: AddQuoteProps) => {

    const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
    

    const handleTextRecognized = (text: string) => {
      setQuote(text);
    };
    function confirmquote(): void {
        setIsConfirmed(true)
    }

    return (
        <div className='border p-4 h-full'>
            <div>
                {isConfirmed ? (
                    <div className='flex flex-col space-y-5  pt-5'>
                        <div className='flex flex-col space-y-2 pt-2 pl-4'>
                            <p className='italic font-fontMain'>"{quote}"</p>
                            <p className='text-hoverTag font-fontMain'>{page}</p>
                        </div>
                        <div className='flex justify-end'>
                            <p className='px-2 border rounded-lg w-min text-sm cursor-pointer' onClick={() => onRemove(index)}>delete</p>
                        </div>

                    </div>

                ) : (
                    <div className='space-y-4 flex flex-col pt-5 '>

                        <Textarea className="" placeholder="scrivi.." value={quote} onChange={(e) => setQuote(e.target.value)} />
                        {/**componente fotocamera */}
                        <div className='flex justify-between flex-row items-center'>
                            <div className='flex flex-row space-x-2'>
                                <Input type="text" className="w-16" placeholder="page" value={page} onChange={(e) => setPage(e.target.value)} />
                                <ImageUpload onTextRecognized={handleTextRecognized}/>
                            </div>

                            {quote ? (
                                <p className='px-2 border rounded-lg w-min text-sm bg-slate-900 text-white  cursor-pointer' onClick={confirmquote}>save</p>
                            ) : (
                                <p className='px-2 border rounded-lg w-min text-sm cursor-pointer' onClick={() => onRemove(index)}>delete</p>
                            )}
                        </div>

                    </div>

                )}
            </div>


        </div>
    )
}

export default Quote
