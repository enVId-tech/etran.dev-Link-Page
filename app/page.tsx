"use client";
import {useEffect} from 'react';

export default function Home() {
    useEffect(() => {
        // Redirect to /links page on mount
        window.location.href = '/error';
    }, []);

    return (
        <></>
    )
}