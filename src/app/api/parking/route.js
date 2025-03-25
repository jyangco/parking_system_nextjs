import { parkingSlots } from '../parkingData'

let parkedVehicles = []

export async function POST(req) {
    try {
        const { vehicleType, entryPoint } = await req.json()

        let availableSlot = null
        let minDistance = Infinity

        for (let slot of parkingSlots) {
            if (!slot.isOccupied) {
                if (
                    (vehicleType === 'S' && ['SP', 'MP', 'LP'].includes(slot.size)) ||
                    (vehicleType === 'M' && ['MP', 'LP'].includes(slot.size)) ||
                    (vehicleType === 'L' && slot.size === 'LP')
                ) {
                    const distance = slot.distances[entryPoint === 'A' ? 0 : entryPoint === 'B' ? 1 : 2]
                    if (distance < minDistance) {
                        minDistance = distance
                        availableSlot = slot
                    }
                }
            }
        }

        if (!availableSlot) {
            return new Response(JSON.stringify({ message: 'No available slot for the vehicle type.' }), { status: 400 })
        }

        const parkingId = `${vehicleType}-${Date.now()}`
        availableSlot.isOccupied = true
        const entryTime = new Date()
        const parkedVehicle = {
            parkingId,
            vehicleType,
            entryPoint,
            slotSize: availableSlot.size,
            entryTime,
            slotId: availableSlot.id,
        }

        parkedVehicles.push(parkedVehicle)
        
        return new Response(
            JSON.stringify({
                message: `Vehicle parked successfully. Parking ID: ${parkingId}`,
                parkingId,
                parkedVehicle,
            }),
            { status: 200 }
        )
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 })
    }
}
