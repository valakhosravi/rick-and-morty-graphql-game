import "./Card.scss";

import React, { useEffect, useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDispatch } from "react-redux";
import { decrement, increment } from "../../redux/slices/ScoreSlice";

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
    }

    return (
        <animated.div style={props}>
            <div
                className={'rm-card text-center shadow rounded overflow-hidden p-2 w-100 ' + statusClass}
                onClick={() => onCardClick(character)}>
                {!loaded &&
                    <div className='ratio ratio-1x1'>
                        <div className='d-flex align-items-center justify-content-center'>
                            <div className='spinner-border' role='status'></div>
                        </div>
                    </div>
                }
                <div className='mb-2'>
                    <img
                        src={character.image}
                        alt={character.name}
                        onLoad={handleLoad}
                        style={{ display: loaded ? 'block' : 'none' }}
                        className="w-100 rounded shadow"
                    />
                </div>
                <div className='' style={{ fontSize: "14px" }}>
                    <div className='w-100 p-2'>
                        {character.name}
                    </div>
                </div>
            </div>
        </animated.div>
    )
}
