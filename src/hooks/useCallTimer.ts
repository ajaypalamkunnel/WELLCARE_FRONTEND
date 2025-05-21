import { useEffect, useRef, useState } from "react";



export const useCallerTimer = () => {

    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {

        if (intervalRef.current) return

        intervalRef.current = setInterval(() => {
            setSecondsElapsed((prev) => prev + 1)
        }, 1000)

    }


    const stop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null
        }
    }

    const reset = () => {
        stop();
        setSecondsElapsed(0);
    };

    const formatted = new Date(secondsElapsed * 1000)
        .toISOString()
        .substr(11, 8);


    useEffect(()=>{
        return ()=> stop()
    },[])


return {
    secondsElapsed,
    formatted,
    start,
    stop,
    reset,
}


}