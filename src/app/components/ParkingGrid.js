import React from 'react'

const ParkingGrid = ({ parkingSlots, highlightedSlotId, entryPoint }) => {
    return (
        <div className="parking-grid">
            <h2>Parking Grid</h2>
            <div className="grid-container">
                <div className="entry-point-left">Entry A</div>
                <div className="grid">
                <div className="entry-point-top">Entry B</div>
                {parkingSlots.map((slot) => (
                    <div
                    key={slot.id}
                    className={`parking-slot ${slot.isOccupied ? 'occupied' : 'available'} ${slot.size} ${slot.id === highlightedSlotId ? 'highlighted' : ''}`}
                    >
                    {slot.size} {slot.isOccupied ? 'Occupied' : 'Available'}
                    </div>
                ))}
                </div>
                <div className="entry-point-right">Entry C</div>
            </div>
        </div>
    )
}

export default ParkingGrid
