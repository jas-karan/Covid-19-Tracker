import React from 'react'
import './Table.css'
import numeral from "numeral";

function Table({ countries }) {
    return (
        <div className="table">
            {countries.map(({ country, cases }) => (
                <tr>
                    <td>{country}</td>
                    <td>
                        <strong style={{ color: 'red', fontWeight: '400', fontSize: '20px' }}>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Table
