import React, { useState } from "react";
import { searchBooks } from "@/lib/actions/books.actions";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { FaSearch } from 'react-icons/fa';
import Image from "next/image";

interface Book {
    _id: string;
    title: string;
    author: string;
    smallImage: string;
    largeImage: string;
    genre1:string;
    genre2:string;
    genre3:string;
}

interface BookSelectionProps {
    onBookClick: (book: Book) => void;
}

const BookSelection = ({ onBookClick }: BookSelectionProps) => {
    const [termResult, setTermResult] = useState<Book[]>([]);

    async function getBooks(searchTerm: string) {
        if (searchTerm.trim() === "") {
            setTermResult([]);
            return;
        }
        const response = await searchBooks(searchTerm);
        setTermResult(response);
    }


    return (

        <Command className="border-b  md:min-w-[450px] h-auto bg-transparent ">
            <div className="flex flex-row items-center  px-3 py-3 space-x-3">
                <img src="/assets/search.svg" alt="notification" width={15} height={15} className="cursor-pointer object-contain" />
                <input
                    type="text"
                    placeholder="What did you read?"
                    onChange={(e) => getBooks(e.target.value)}
                    className="   focus:outline-none bg-transparent "
                />
            </div>
            {termResult.length > 0 ? (
                <CommandList className="">

                    <CommandGroup heading="Suggestions">
                        {termResult.map((book) => (
                            <CommandItem
                                key={book._id}
                                onSelect={() => onBookClick(book)}
                            >
                                <div className="flex flex-row justify-start items-center space-x-2">
                                    <img src={book.smallImage} alt="" className="w-5 h-8" />
                                    <div className="flex flex-col">
                                        <span className="font-regular">{book.title}</span>
                                        <p className="font-extralight text-xs">{book.author}</p>
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            ) : (
                <></>
            )}

        </Command>


    );
};

export default BookSelection;
