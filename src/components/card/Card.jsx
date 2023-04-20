import "./Card.scss";

import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDispatch } from "react-redux";
import { decrement, increment } from "../../redux/slices/ScoreSlice";
import { increment as incrementLevel } from "../../redux/slices/LevelSlice";

export default function Card({ character }) {
    const dispatch = useDispatch();

    const props = useSpring({ transform: 'scale(1)', from: { transform: 'scale(0)' } });

    const [loaded, setLoaded] = useState(false);
    const [statusClass, setStatusClass] = useState('');

    function handleLoad() {
        setLoaded(true);
    }

    const onCardClick = (data) => {
        if (data.flag) {
            setStatusClass('bg-success');
            dispatch(increment());
        } else {
            setStatusClass('bg-danger')
            dispatch(decrement());
        }
        dispatch(incrementLevel());
    }

    return (
        <animated.div style={props}>
            <div
                className={'rm-card text-center shadow rounded p-0 w-100 ' + statusClass}
                onClick={() => onCardClick(character)}>
                {!loaded &&
                    <div className='ratio ratio-1x1'>
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className='spinner-border' role='status'></div>
                        </div>
                    </div>
                }
                <div className=' overflow-hidden rounded-top'>
                    <img
                        src={character.image}
                        alt={character.name}
                        onLoad={handleLoad}
                        style={{ display: loaded ? 'block' : 'none' }}
                        className="w-100"
                    />
                </div>
                <div className='' style={{ fontSize: "14px" }}>
                    <div className='w-100 p-3'>
                        {character.name}
                    </div>
                </div>
            </div>
        </animated.div>
    )
}
