import React, { useState, useEffect } from 'react';
import star from './star.png';
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/card';
import Sidebar from './Side-bar';
import { Card } from '@/components/card';

export default function Dashboard() {
    const [highlightedUpdates, setHighlightedUpdates] = useState([
        {
            title: 'HarshlovesTrees',
            description: 'We have planted over 2000 trees today kudos to us',
        },
        {
            title: 'Atharva-plants',
            description: 'We have planted over 2000 trees today kudos to us',
        },
        {
            title: 'HarhlovesTrees',
            description: 'We have planted over 2000 trees today kudos to us',
        },
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === highlightedUpdates.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [highlightedUpdates]);

    return (
        <div className="text-white flex ">
            <Sidebar />
            <div className="right w-4/5 ml-10">
                <div className="upper flex flex-row w-full">
                    <div className="flex flex-row justify-start w-full items-center p-4">
                        <h1 className="text-black text-xl ">Hello User</h1>
                    </div>

                    <div className="flex flex-row w-full items-end justify-end p-4">
                        <div className="text-black p-2 flex flex-row bg-gray-100 rounded-3xl border border-gray-100">
                            <h1 className="text-xl mr-2">2000</h1>
                            <img src={star} className="h-6" />
                        </div>
                    </div>
                </div>

                <div className="w-2/5 ">
                    <Card className="bg-[#1F2114] h-[200px] p-4 text-white">
                        <CardHeader>
                            <CardTitle>High Lighted Updates</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-scroll bg-white text-black rounded-md p-0 h-[100px] ">
                            <CardHeader>
                                <CardTitle>
                                    {highlightedUpdates[currentIndex].title}
                                </CardTitle>
                                <CardDescription>
                                    {highlightedUpdates[currentIndex].description}
                                </CardDescription>
                            </CardHeader>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}