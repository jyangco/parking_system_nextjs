'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './styles/globals.css'

import ParkingGrid from './components/ParkingGrid'
import ParkingForm from './components/ParkingForm'

const Page = () => {
    const [message, setMessage] = useState('')
    const [parkingId, setParkingId] = useState('')
    const [parkedVehicleDetails, setParkedVehicleDetails] = useState(null)
    const [parkingSlots, setParkingSlots] = useState([])
    const [nearestSlot, setNearestSlot] = useState(null)
    const [highlightedSlotId, setHighlightedSlotId] = useState(null)
    const [showParkForm, setShowParkForm] = useState(true)

    useEffect(() => {
        axios.get('/api/parkingSlots')
        .then((response) => {
            setParkingSlots(response.data)
        })
        .catch((error) => {
            console.log('Error fetching parking slots:', error)
        })
    }, [])

    const handlePark = (event, vehicleType, entryPoint) => {
        event.preventDefault();
        axios
        .post('/api/parking', { vehicleType, entryPoint })
        .then((response) => {
            setMessage(response.data.message);
            setParkingId(response.data.parkingId);
            setParkedVehicleDetails(response.data.parkedVehicle);

            const availableSlot = parkingSlots.find((slot) => slot.id === response.data.parkedVehicle.slotId);
            setNearestSlot(availableSlot);
            setHighlightedSlotId(availableSlot.id);
            setParkingSlots((prevSlots) =>
                prevSlots.map((slot) =>
                    slot.id === availableSlot.id ? { ...slot, isOccupied: true } : slot
                )
            );
        })
        .catch((error) => {
            setMessage(error.response?.data?.message || 'Error occurred');
            setNearestSlot();
            setHighlightedSlotId();
            setParkedVehicleDetails();
        });
    };

    const handleUnpark = (event, parkingId) => {
        event.preventDefault()
        axios
        .post('/api/unpark', { parkingId })
        .then((response) => {
            setMessage(response.data.message)
            setParkedVehicleDetails(response.data.parkedVehicle)
            setMessage(`Vehicle unparked. Total fee: ${response.data.totalFee} pesos.`)
            setHighlightedSlotId(null)

            const slotId = response.data.parkedVehicle.slotId
            setParkingSlots((prevSlots) =>
            prevSlots.map((slot) =>
                slot.id === slotId ? { ...slot, isOccupied: false } : slot
            )
            )
        })
        .catch((error) => {
            setMessage(error.response?.data?.message || 'Error occurred')
            setNearestSlot()
            setHighlightedSlotId()
            setParkedVehicleDetails()
        })
    }

    return (
        <div className="App">
            <div className="left-section">
                <ParkingGrid
                    parkingSlots={parkingSlots}
                    highlightedSlotId={highlightedSlotId}
                    entryPoint={nearestSlot ? nearestSlot.entryPoint : 'A'}
                />
            </div>
            <div className="right-section">
                <div className="toggle-container">
                    <button onClick={() => setShowParkForm(true) & setMessage('') & setParkedVehicleDetails(null) & setNearestSlot(null)}>
                        Park a Vehicle
                    </button>
                    <button onClick={() => setShowParkForm(false) & setMessage('') & setParkedVehicleDetails(null)}>
                        Unpark a Vehicle
                    </button>
                </div>
                <div className="flex-container">
                    <div className="containers">
                        <ParkingForm
                            handlePark={handlePark}
                            handleUnpark={handleUnpark}
                            showParkForm={showParkForm}
                            parkingId={parkingId}
                            setParkingId={setParkingId}
                            setMessage={setMessage}
                        />
                        {nearestSlot && (
                            <div className="nearest-slot">
                                <h3>Nearest Available Slot:</h3>
                                <p>Slot ID: {nearestSlot.id}</p>
                                <p>Size: {nearestSlot.size}</p>
                                <p>Distance to Entry {parkedVehicleDetails.entryPoint}: {nearestSlot.distances[parkedVehicleDetails.entryPoint === 'A' ? 0 : parkedVehicleDetails.entryPoint === 'B' ? 1 : 2]} meters</p>
                            </div>
                        )}
                    </div>
                    <div className="message">
                        <p>{message}</p>
                        {parkedVehicleDetails && (
                            <div>
                            <h3>Parked Vehicle Details:</h3>
                            <p>Parking ID: {parkedVehicleDetails.parkingId}</p>
                            <p>Vehicle Type: {parkedVehicleDetails.vehicleType}</p>
                            <p>Slot Size: {parkedVehicleDetails.slotSize}</p>
                            <p>Entry Time: {new Date(parkedVehicleDetails.entryTime).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
