import { useState } from "react"
import { floor } from "../data/types"

export default function useFloorsArray(floorsNumber: number) {
    const [floorsArray, setArray] = useState<floor[]>(
        Array.from({ length: floorsNumber }).map((e, idx) => ({
            buttonState: "call",
            elevatorTaskId: -1,
            presentTime: "",
            elevatorAvailableTime: 0
        })))

    function floorsUpdate(index: number, newElement: Partial<floor>) {
        setArray(prev => [
            ...prev.slice(0, index),
            { ...prev[index], ...newElement },
            ...prev.slice(index + 1, prev.length),
        ])
    }

    return { floorsArray, floorsUpdate }
}