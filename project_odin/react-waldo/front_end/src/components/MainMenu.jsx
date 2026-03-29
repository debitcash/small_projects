import { useState, useEffect, useRef } from 'react';
import styles from "./MainMenu.module.css";
import { Link } from "react-router";

import dinner_image from '../assets/1.png';
import death_image from '../assets/2.png';
import school_image from '../assets/3.png';

function MainMenu({setLevelSelection}){
    const [leaderBoards, setLeaderBoards] = useState({});

    useEffect(() => {
    const fetchData = async (num) => {
        const res = await fetch(`http://localhost:3000/leaberboard/${num}`);
        const data = await res.json();

        //console.log("LEADERBOARD :", leaderBoards);

        setLeaderBoards(prev => ({ ...prev, [num]: data }));
        //console.log(`LEADERBOARD ${num}:`, data);
        
    };

    fetchData("1");
    fetchData("2");
    fetchData("3");

    console.log(leaderBoards);

    }, []);


    return <>
    <h2>Select difficulty</h2>
    
    <div className={styles.levelsContainer}>
        <div className={styles.levelOption}>
            <span>
                Level 1
            </span>
            <Link to={`game/1`} ><img src={dinner_image} alt="" /></Link>
            <span>
                Leaderboard
            </span><br />
            {leaderBoards["1"] ? (
                leaderBoards["1"].map((entry, index) => (
                    <span key={index}>
                    {entry.username} - {entry.time} <br />
                    </span>
                ))
                ) : (
                <span>Loading leaderboard 1...</span>
            )}
        </div>

        <div className={styles.levelOption}>
            <span>
                Level 2
            </span>
            <Link to={`game/2`} ><img src={death_image} alt="" /></Link>
            <span>
                Leaderboard
            </span><br />
            {leaderBoards["2"] ? (
                leaderBoards["2"].map((entry, index) => (
                    <span key={index}>
                    {entry.username} - {entry.time} <br />
                    </span>
                ))
                ) : (
                <span>Loading leaderboard 2...</span>
            )}
        </div>

        <div className={styles.levelOption}>
            <span>
                Level 3
            </span>
            <Link to={`game/3`} ><img src={school_image} alt="" /></Link>
            <span>
                Leaderboard
            </span><br />
            {leaderBoards["3"] ? (
                leaderBoards["3"].map((entry, index) => (
                    <span key={index}>
                    {entry.username} - {entry.time} <br />
                    </span>
                ))
                ) : (
                <span>Loading leaderboard 3...</span>
            )}
        </div>
        
    </div>
    
    </>
}

export default MainMenu;

function onDifficultySelected(e, identifier, setLevelSelection){
    setLevelSelection(identifier);
}