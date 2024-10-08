"use client";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/post";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { createComment } from "@/lib/actions/comment.actions";
import { useState } from 'react';
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import ReplyComment from "./ReplyComment";
import CommentItem from "./CommentItem";

interface Author {
    _id: string;
    id: string;
    username: string; 
    image: string;
}

interface Comment {
    _id: string;
    text: string;
    refType: 'Quote' | 'Review';
    author: Author;
    children: Comment[]; 
    createdAt: string;
    parentId: string | null; 
    refId: string;
}

interface DialogCommentParams {
    comments: Comment[];
    totalComment: number;
    refType: 'Quote' | 'Review';
    refId: string;
    currentUser: string;
    pathname: string;
    hasMore: boolean;
    isLoading: boolean;
    loadMoreComments: () => void;
    imageCurrentUser: string;
    onClose: () => void; 
}

export function DialogComment({
    comments,
    refType,
    totalComment,
    refId,
    currentUser,
    pathname,
    hasMore,
    isLoading,
    loadMoreComments,
    imageCurrentUser,
    onClose
}: DialogCommentParams) {
    const [isSubmitting, setIsSubmitting] = useState(false); // Stato di invio del commento
    const [replyingCommentId, setReplyingCommentId] = useState<string | null>(null);
    const [viewChildrenCommentFromId, setViewChildrenCommentFromId] = useState<string | null>(null);
    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            comment: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        const optimisticComment: Comment = {
            _id: "temp-id", 
            text: values.comment,
            refType: refType, 
            author: {
                _id: "temp-author-id", 
                id: currentUser,
                username: "Tu", 
                image: imageCurrentUser
            },
            children: [], 
            createdAt: new Date().toISOString(),
            parentId: null, 
            refId, 
        };

        
        comments.unshift(optimisticComment); 
        form.reset();
        setIsSubmitting(true);

        try {
         
            await createComment({
                author: currentUser,
                refType,
                text: values.comment,
                refId,
                pathname,
            });

            
        } catch (error) {
          
            console.error("Failed to submit comment:", error);
            comments.shift(); 
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer open={true} onOpenChange={onClose}>
            <DrawerContent className="h-[80%] px-8">
                {totalComment > 0 ? (
                    <ScrollArea className="h-full w-full">
                        <div className="p-4">
                            {comments.map((comment) => (
                                <CommentItem
                                    numChildren={comment.children.length} 
                                    pathname={pathname}
                                    refId={refId}
                                    refType={refType}
                                    currentUser={currentUser}
                                    imageCurrentUser={imageCurrentUser}
                                    key={comment._id}
                                    comment={comment}
                                    isReplying={replyingCommentId === comment._id}
                                    onReplyClick={() => setReplyingCommentId(replyingCommentId === comment._id ? null : comment._id)}
                                    viewSubComments={viewChildrenCommentFromId === comment._id}
                                    onViewSubComments={() => setViewChildrenCommentFromId(viewChildrenCommentFromId === comment._id ? null : comment._id)}
                                />
                            ))}
                            {!hasMore && <p className="text-sm">Non ci sono altri commenti.</p>}
                        </div>
                    </ScrollArea>
                ) : (
                    <p>Commenta per primo</p>
                )}

                {hasMore && (
                    <div className="text-center mt-4">
                        {isLoading ? (
                            <div className="flex flex-col space-y-4">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex flex-row items-center space-x-2">
                                            <Skeleton className="w-7 h-7 rounded-full" />
                                            <Skeleton className="w-24 h-4 rounded" />
                                        </div>
                                        <div className="ml-10 mt-1 space-y-2">
                                            <Skeleton className="w-48 h-4 rounded mb-2" />
                                            <Skeleton className="w-36 h-4 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div onClick={loadMoreComments} className="text-black cursor-pointer flex flex-col justify-center items-center space-y-2">
                                <img src="/assets/loadMore.svg" className="" alt="loadComments" width={24} height={24} />
                            </div>
                        )}
                    </div>
                )}

                <DrawerFooter>
                    <Form {...form}>
                        <form className='w-full flex items-center gap-3' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='comment'
                                render={({ field }) => (
                                    <FormItem className='flex w-full'>
                                        <FormControl className='border-none bg-transparent'>
                                            <Input
                                                type='text'
                                                {...field}
                                                placeholder='Comment...'
                                                className='no-focus text-light-1 outline-none'
                                                autoFocus={false}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='ml-2' disabled={isSubmitting}>
                                {isSubmitting ? 'Caricamento...' : 'Reply'}
                            </Button>
                        </form>
                    </Form>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default DialogComment;
