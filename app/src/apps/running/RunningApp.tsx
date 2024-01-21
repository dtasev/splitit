import moment from 'moment';
import { memo, useEffect, useState } from 'react';
import { Col, Container, Form, Table } from 'react-bootstrap';

function Pace(pace: string | number, change: number = 0, km: number = 1) {
    let t;
    if (typeof pace === 'string') {
        const res = pace.split(":").map(v => parseInt(v));
        let h, m, s;
        if (res.length === 2) {
            h = 0, m = res[0], s = res[1];
        } else {
            h = res[0], m = res[1], s = res[2];
        }
        t = (h * 3600) + (m * 60) + s + change;
    } else {
        t = pace + change;
    }
    t *= km;

    if (t < 3600) {
        return moment.utc(t * 1000).format('m:ss');
    }
    else {
        return moment.utc(t * 1000).format('HH:mm:ss');
    }
}

function TimeRow(props: { km: number, pace: string }) {
    return (
        <tr style={{ backgroundColor: props.km % 5 === 0 ? 'red' : '' }}>
            <td>{props.km} km</td>
            <td>{Pace(props.pace, -15, props.km)}</td>
            <td>{Pace(props.pace, -10, props.km)}</td>
            <td>{Pace(props.pace, -5, props.km)}</td>
            <td>{Pace(props.pace, 0, props.km)}</td>
            <td>{Pace(props.pace, 5, props.km)}</td>
            <td>{Pace(props.pace, 10, props.km)}</td>
            <td>{Pace(props.pace, 15, props.km)}</td>
        </tr>
    );
}

function PaceTable(props: { pace: string }) {
    return (<Table>
        <thead>
            <tr>
                <th>Distance</th>
                <th>{Pace(props.pace, -15)}</th>
                <th>{Pace(props.pace, -10)}</th>
                <th>{Pace(props.pace, -5)}</th>
                <th>{Pace(props.pace)}</th>
                <th>{Pace(props.pace, 5)}</th>
                <th>{Pace(props.pace, 10)}</th>
                <th>{Pace(props.pace, 15)}</th>
            </tr>
        </thead>
        <tbody>
            {[...Array(50).keys()].map(v => <TimeRow km={v + 1} pace={props.pace} />)}
        </tbody>
    </Table>);

}
export default memo(function RunningApp() {
    const [paceMinKm, setPaceMinKm] = useState<string>("6:00");
    const [paceKmH, setPaceKmH] = useState<string>("10");

    const update = (e: string, src: string) => {
        switch (src) {
            case 'minkm':
                setPaceMinKm(e);
                const [m, s] = paceMinKm.split(':').map(v => parseInt(v));
                setPaceKmH(`${3600 / (m * 60 + s)}`);
                break

        }
    }
    // useEffect(() => {
    // const [m, s] = paceMinKm.split(':').map(v => parseInt(v));
    // setPaceKmH(`${ 60 / (m * 60 + s) } `);
    // }, [paceMinKm]);

    return (<Container>
        <Form className='mx-auto text-center d-flex justify-content-center'>
            <div className='flex-row'>
                <h4 className='flex-fill'>Expected Pace</h4>
                <div className='input-group'>
                    <input className='form-control' name='minkm' id='minkm' type='text' placeholder={paceMinKm} defaultValue={paceMinKm} onChange={(e) => update(e.target.value, 'minkm')} />
                    <label className="input-group-text" htmlFor='minkm'>min/km</label>
                    {/* <div className='input-group'>
                        <input className='form-control' name='minm' id='minm' type='text' placeholder='6:30' defaultValue={"0:00"} />
                        <label className="input-group-text" htmlFor='minm'>min/m</label>
                    </div> */}
                    <input readOnly={true} className='form-control' name='kmh' id='kmh' type='text' placeholder={paceKmH} value={paceKmH} />
                    <label className="input-group-text" htmlFor='kmh'>km/h</label>
                </div>
            </div>

        </Form>
        <PaceTable pace={paceMinKm} />
    </Container>);
})