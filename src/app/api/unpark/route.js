import { parkingSlots } from '../parkingData'

let parkedVehicles = []

const calculateFees = (slotSize, hours) => {
    const flatRate = 40
    const exceedingHours = Math.max(0, hours - 3)
    const fullDays = Math.floor(exceedingHours / 24)
    const remainingHours = exceedingHours % 24
    let ratePerHour = 0

    switch (slotSize) {
        case 'SP':
            ratePerHour = 20
            break
        case 'MP':
            ratePerHour = 60
            break
        case 'LP':
            ratePerHour = 100
            break
    }

    const fullDayFee = fullDays * 5000
    const remainingHoursFee = Math.ceil(remainingHours) * ratePerHour
    const totalFee = flatRate + fullDayFee + remainingHoursFee

    return totalFee
}

export async function POST(req) {
    try {
        const { parkingId } = await req.json()

        const parkedVehicle = parkedVehicles.find((v) => v.parkingId === parkingId)
        if (!parkedVehicle) {
            return new Response(JSON.stringify({ message: 'Parking ID not found.' }), { status: 400 })
        }

        const currentTime = new Date()
        const parkedDuration = Math.ceil((currentTime - parkedVehicle.entryTime) / (1000 * 60 * 60)) // in hours
        const totalFee = calculateFees(parkedVehicle.slotSize, parkedDuration)

        const slot = parkingSlots.find((s) => s.id === parkedVehicle.slotId && s.isOccupied)
        if (slot) slot.isOccupied = false

        parkedVehicles = parkedVehicles.filter((v) => v.parkingId !== parkingId)

        return new Response(
            JSON.stringify({
                message: `Vehicle ${parkingId} has been unparked. Total fee: ${totalFee} pesos.`,
                parkedVehicle,
                totalFee,
            }),
            { status: 200 }
        )
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Internal Server Error', error: error.message }), { status: 500 })
    }
}
