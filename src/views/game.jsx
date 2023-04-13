import React, { useEffect, useState } from 'react'
import { gql, useQuery } from "@apollo/client";
import Card from '../components/card/Card';
import { useSelector } from 'react-redux';

export default function Game() {
    const score = useSelector((state) => state.score.value);

    const [query, setQuery] = useState(getQuery(generateRandomDistinctNumbers(2, 1, 42).join(', ')));
    const [options, setOptions] = useState([]);

    const { loading, error, data, refetch } = useQuery(query);

    const episode = data?.episodesByIds[0];

    useEffect(() => {
        console.log('fetch data', data);
        if (data) {
            // setEpisode(data.episodesByIds[0])
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


    useEffect(() => {
        // setOptions([]);
        // refetch();
        setQuery(getQuery(generateRandomDistinctNumbers(2, 1, 42).join(', ')));
    }, [score])


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

    // if (loading) return <p className='text-white'>Loading...</p>;

    if (error) return <p className='text-danger'>Error</p>;

    // if (!episode) return <p className='text-white'>Loading...</p>;

    return (
        <div className='container'>
            <div className='text-white row justify-content-center p-3 h2'>
                Score: {score}
            </div>
            <p className='p-3 text-center text-white h3'>
                {
                    loading ? (
                        <div className='text-white'>Loading...</div>
                    ) : (
                        <>
                            <b>Episode:</b> {episode.name} ({episode.episode}) - {episode.air_date}
                        </>
                    )
                }
            </p>
            <div className='container'>
                <div className='row position-relative'>
                        {options.map((option) => (
                            <div key={option.id} className='col-lg-3 col-md-6 col-sm-12 p-3'>
                                <Card character={option} />
                            </div>
                        ))}
                        {loading &&
                            <div style={{position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 10}}>

                            </div>
                        }
                </div>
            </div>
        </div >
    );
}
