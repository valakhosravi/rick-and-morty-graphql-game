import React, { useEffect, useState } from 'react'
import { gql, useQuery } from "@apollo/client";

export default function Game() {


    const [score, setScore] = useState(0);
    const [query, setQuery] = useState(getQuery(generateRandomDistinctNumbers(2, 1, 42).join(', ')));
    const [loaded, setLoaded] = useState(false);
    const [options, setOptions] = useState([]);
    const [episode, setEpisode] = useState();
    const { loading, error, data } = useQuery(query);

    useEffect(() => {
        if (data) {
            setEpisode(data.episodesByIds[0])
            const { episodesByIds: [{ characters: characters1 }, { characters: characters2 }] } = data;
            console.log('scharacters1', characters1);
            console.log('scharacters2', characters2);
            const secondEpisodeLeftOverCharacters = characters2.filter(character2 =>
                !characters1.some(character1 => character1.id === character2.id)
            );
            console.log('secondEpisodeLeftOverCharacters', secondEpisodeLeftOverCharacters);
            const options1 = pickRandomUniqueElements(characters1, 3).map(item => {
                return { ...item, flag: false };
            });
            const options2 = pickRandomUniqueElements(secondEpisodeLeftOverCharacters, 1).map(item => {
                return { ...item, flag: true };
            });
            console.log('options1', options1);
            console.log('options2', options2);
            const result = [...options1, ...options2];
            setOptions(result);
        }
    }, [data, error])


    function getQuery(ids) {
        return gql`
            query {
                episodesByIds(ids: [${ids}]) {
                    id
                    name
                    air_date
                    episode
                    characters {
                        id
                        name
                        image
                    }
                }
            }
        `;
    }

    function generateRandomDistinctNumbers(n, min, max) {
        let numbers = [];
        while (numbers.length < n) {
            let number = Math.floor(Math.random() * (max - min)) + min;
            if (!numbers.includes(number)) {
                numbers.push(number);
            }
        }
        return numbers;
    }

    function pickRandomUniqueElements(arr, n) {
        let result = [];
        while (result.length < n) {
            let randomIndex = Math.floor(Math.random() * arr.length);
            let randomElement = arr[randomIndex];
            if (!result.includes(randomElement)) {
                result.push(randomElement);
            }
        }
        return result;
    }

    function handleLoad() {
        setLoaded(true);
    }

    const onOptionClick = (option) => {
        console.log('option', option);
    }

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error</p>;

    if (!episode) return <p>Loading...</p>;

    return (
        <div className='container'>
            <p className='p-3'>
                <b>Episode:</b> {episode.name} ({episode.episode}) - {episode.air_date}
            </p>
            <div className='container'>
                <div className='row'>
                    {options.map((option) => (
                        <div key={option.id} className='col-lg-3 col-md-6 col-sm-12 p-3'>
                            <div className='text-center shadow-sm rounded overflow-hidden btn p-0 w-100' onClick={() => onOptionClick(option)}>
                                {!loaded &&
                                    <div className='ratio ratio-1x1'>
                                        <div className='d-flex align-items-center justify-content-center'>
                                            <div className='spinner-border' role='status'></div>
                                        </div>
                                    </div>
                                }
                                <img
                                    src={option.image}
                                    alt={option.name}
                                    onLoad={handleLoad}
                                    style={{ display: loaded ? 'block' : 'none' }}
                                    className="w-100"
                                />
                                <div className='p-3' style={{ fontSize: "14px" }}>
                                    {option.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='row justify-content-center p-3'>
                    Score: {score}
                </div>
            </div>
        </div >
    );
}
