import React, { useEffect, useState } from 'react'
import { gql, useQuery } from "@apollo/client";
import Card from '../components/card/Card';
import { useSelector } from 'react-redux';
import Popup from '../components/popup/Popup';

export default function Game() {
    const score = useSelector((state) => state.score.value);

    const [query, setQuery] = useState(getQuery(generateRandomDistinctNumbers(2, 1, 42).join(', ')));
    const [options, setOptions] = useState([]);
    const [level, setLevel] = useState(0);
    const [showNoticePopup, setShowNoticePopup] = useState(true);

    const { loading, error, data } = useQuery(query);

    const episode = data?.episodesByIds[0];

    useEffect(() => {
        if (data) {
            const { episodesByIds: [{ characters: characters1 }, { characters: characters2 }] } = data;
            setOptions(prepareOptions(characters1, characters2));
        }
    }, [data, error])


    useEffect(() => {
        setLevel(level + 1);
        setQuery(getQuery(generateRandomDistinctNumbers(2, 1, 42).join(', ')));
    }, [score])


    function prepareOptions(characters1, characters2) {
        const secondEpisodeLeftOverCharacters = characters2.filter(character2 =>
            !characters1.some(character1 => character1.id === character2.id)
        );
        const options1 = pickRandomUniqueElements(characters1, 3).map(item => {
            return { ...item, flag: false };
        });
        const options2 = pickRandomUniqueElements(secondEpisodeLeftOverCharacters, 1).map(item => {
            return { ...item, flag: true };
        });
        const result = [...options1, ...options2];
        return shuffleArray(result);
    }

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

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
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

    if (error) return <p className='text-danger'>Error</p>;

    return (
        <div className='container'>
            {showNoticePopup &&
                <Popup>
                    <div className='text-primary h3 mb-3'>
                        <b>Welcome to the Rick and Morty Episode Quiz</b>
                    </div>
                    <div className='text-start mb-3'>
                        <div className='mb-2'>
                            In this game, you will be shown the name of an episode from the TV series Rick and Morty, along with four character options. Your task is to identify the character that did not appear in that episode.
                        </div>
                        <div className='mb-2'>
                            For each correct answer, you will earn <b>2 points</b>, and for each wrong answer, you will lose <b>3 points</b>. You will play this game <b>10 times</b>, and your final score will be the sum of your points across all rounds.
                        </div>
                        <div>
                            So, get ready to test your knowledge of Rick and Morty, and see if you can beat your previous high score!
                        </div>
                    </div>
                    <div className=''>
                        <button onClick={() => setShowNoticePopup(false)} className='btn btn-primary px-5 text-white'>Understood</button>
                    </div>
                </Popup>
            }
            {
                level >= 10 &&
                <Popup>
                    <div>
                        <div className='text-primary h3 mb-3'>
                            <b>Congratulations!</b>
                        </div>
                        <div className='mb-3 fw-bold'>
                            You have finished the game
                        </div>
                        <div className='mb-3'>
                            Your final score is:
                            <span className={score >= 0 ? 'text-success' : 'text-danger'}>
                                {' ' + score}
                            </span>
                        </div>
                        <div className='mb-3'>
                            If you want to play this game again, click on the button below
                        </div>
                        <div>
                            <button onClick={() => window.location.reload()} className='btn btn-primary px-5 text-white'>Replay</button>
                    </div>
                </div>
                </Popup>
            }
            <div className='text-white justify-content-center p-3 h3'>
                <span className='text-primary'>Rick</span> and<span className='text-secondary'> Morty</span> Episode Quiz
            </div>
            <div className='text-white h5'>
                <span className='me-3'>
                    Level: {level}
                </span>
                <span className={score >= 0 ? 'text-success' : 'text-danger'}>
                    Score: {score}
                </span>
            </div>
            <p className='p-3 text-center text-white h4'>
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
                <div className='row mb-5 position-relative'>
                    {options.map((option) => (
                        <div key={option.id} className='col-lg-3 col-md-6 col-sm-12 p-3'>
                            <Card character={option} />
                        </div>
                    ))}
                    {loading &&
                        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 10, backgroundColor: 'rgba(0, 0, 0, .3)' }}>

                        </div>
                    }
                </div>
                {/* <div className="mb-5">
                    <button onClick={() => setShowNoticePopup(true)} className='btn btn-outline-primary px-5 text-white'>Game Guide</button>
                </div> */}
            </div>
        </div >
    );
}
