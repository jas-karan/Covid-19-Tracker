import React from 'react'
import './InfoBox.css'
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`} onClick={props.onClick}>
            <CardContent>
                {/*title - coronavirus cases*/}
                <Typography style={{ color: 'white', fontSize: '15px' }}>{title}</Typography>

                {/*+120k Increase cases */}
                <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>{cases}</h2>

                {/*1.2M Total */}
                <Typography className="infoBox__total" style={{ color: 'white' }}>{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
