import { parkingSlots } from '../parkingData'

export async function GET() {
    return new Response(JSON.stringify(parkingSlots), { status: 200 })
}
