"use client"
import Tutorial from './tutorial.mdx'


export default function TutorialPage() {
    return (
        <div className='flex h-full w-full flex-col px-[1rem] pt-[1rem] text-foreground prose prose-invert'>
            <Tutorial />
            <br />
        </div>
    )

}