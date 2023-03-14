import { useState } from "react"
import { elevator } from "../data/types"

export default function useElevatorsArray(elevatorsNumber: number) {
    const [elevatorsArray, setArray] = useState<elevator[]>(
        Array(elevatorsNumber).fill({
            currentFloor: 0,
            destinyFloor: 0,
            elevatorState: "black",
        }))

    function elevatorsUpdate(index: number, newElement: Partial<elevator>) {
        setArray(prev => [
            ...prev.slice(0, index),
            { ...prev[index], ...newElement },
            ...prev.slice(index + 1, prev.length),
        ])
    }

    return { elevatorsArray, elevatorsUpdate }
}