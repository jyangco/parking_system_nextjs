
'use client'
import React, {useState} from 'react';

const ParkingForm = ({ handlePark, handleUnpark, showParkForm, parkingId, setParkingId, setMessage }) => {
    const [vehicleType, setVehicleType] = useState('S');
    const [entryPoint, setEntryPoint] = useState('A');

    return (
        <div className="form-message-container">
            {showParkForm ? (
                <div className="form-container">
                    <h2>Park a Vehicle</h2>
                    <form onSubmit={(e) => handlePark(e, vehicleType, entryPoint)}>
                        <label>
                            Vehicle Type:
                            <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                                <option value="S">Small</option>
                                <option value="M">Medium</option>
                                <option value="L">Large</option>
                            </select>
                        </label>
                        <br />
                        <label>
                            Entry Point:
                            <select value={entryPoint} onChange={(e) => setEntryPoint(e.target.value)}>
                                <option value="A">Entry A</option>
                                <option value="B">Entry B</option>
                                <option value="C">Entry C</option>
                            </select>
                        </label>
                        <br />
                        <button type="submit">Park Vehicle</button>
                    </form>
                </div>
            ) : (
                <div className="form-container">
                    <h2>Unpark a Vehicle</h2>
                    <form onSubmit={(e) => handleUnpark(e, parkingId)}>
                        <label>
                            Parking ID:
                            <input
                                type="text"
                                value={parkingId}
                                onChange={(e) => setParkingId(e.target.value)}
                            />
                        </label>
                        <br />
                        <button type="submit">Unpark Vehicle</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ParkingForm;
