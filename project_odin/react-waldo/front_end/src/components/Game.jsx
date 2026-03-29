import { useState, useEffect, useRef } from 'react';
import styles from "./Game.module.css";
import { useParams } from "react-router";
import { Link } from "react-router";


function Game() {
  const bigImageRef = useRef(null);
  const lookUpMenuRef = useRef(null);
  const ovalRef = useRef(null);
  const dialogRef = useRef(null);
    const [rectangles, setRectangles] = useState([]); 

  const intervalRef = useRef(null);

  const [checks, setChecks] = useState({
    "1": false,
    "2": false,
    "3": false,
  });

  const firstSelection = useRef(null);
  const secondSelection = useRef(null);
  const thirdSelection = useRef(null);

  const coordsRef = useRef({ x: null, y: null });
  const [lookUpMenu, setLookUpMenu] = useState(false);
   const [seconds, setSeconds] = useState(0);

   const { gameId } = useParams();

  

   useEffect(() => {
    //console.log("GAME ID IS : ",gameId );
    let oval = document.querySelector("#oval");
    const handler = (e) => {
        const bigImg = bigImageRef.current.getBoundingClientRect();
        logKey(e, oval, bigImg, lookUpMenuRef);
    };
    document.addEventListener("mousemove", handler);

    intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
    }, 1000);



    return () => {document.removeEventListener("mousemove", handler); clearInterval(intervalRef.current);}
  }, [])

  return (
    <>
        <Link to={`/`} >Back to home</Link>
        <h2>Level {gameId}</h2>
      <div className={styles.gameContainer}>
        <div className={styles.creaturesContainer}>
          <img src={`/src/assets/${gameId}/1.png`} alt="" className={`${styles.smallImage} ${checks["1"] && styles.greenBorder}`} ref={firstSelection} />
          <img src={`/src/assets/${gameId}/2.png`} alt="" className={`${styles.smallImage} ${checks["2"] && styles.greenBorder}`} ref={secondSelection} />
          <img src={`/src/assets/${gameId}/3.png`} alt="" className={`${styles.smallImage} ${checks["3"] && styles.greenBorder}`} ref={thirdSelection}/>
        </div>

        <div className={styles.canvasContainer}>
            {rectangles.map((rectangle) => (
                <div
                style={{
                    position:"absolute",
                    width: (rectangle[2] - rectangle[0]) * bigImageRef.current.offsetWidth + "px",
                    height: (rectangle[3] - rectangle[1]) * bigImageRef.current.offsetHeight + "px",
                    backgroundColor: "green",
                    opacity: "0.5",
                    top: rectangle[1] *  bigImageRef.current.offsetHeight + "px",
                    left: rectangle[0] * bigImageRef.current.offsetWidth + "px",
                }}
                />
            ))}
          <img src={`/src/assets/${gameId}.png`} alt="" ref={bigImageRef} id='bigImage' className={styles.bigImage} onClick={(e) => 
            onBigImageClick(e, lookUpMenuRef, ovalRef)} />
        </div>
      </div>

      <div id="oval" onClick={(e) => onOvalClick(e, bigImageRef, setLookUpMenu, lookUpMenuRef, coordsRef)} ref={ovalRef}>Oval</div>
        <h3 id="screen-log"></h3>
        <h3 id="">Seconds Elapsed: {seconds}</h3>
        <div className={styles.heroLookupContainer} ref={lookUpMenuRef}>
            <img src={`/src/assets/${gameId}/1.png`} alt="" className={styles.smallImage} onClick={(e) => onSmallPictureSelected(e, "1", lookUpMenuRef, ovalRef, coordsRef, bigImageRef, gameId, firstSelection, checks, setChecks, seconds, dialogRef, intervalRef, rectangles, setRectangles)} />
            <img src={`/src/assets/${gameId}/2.png`} alt="" className={styles.smallImage} onClick={(e) => onSmallPictureSelected(e, "2", lookUpMenuRef, ovalRef, coordsRef, bigImageRef, gameId, secondSelection, checks, setChecks, seconds, dialogRef, intervalRef, rectangles, setRectangles)} />
            <img src={`/src/assets/${gameId}/3.png`} alt="" className={styles.smallImage} onClick={(e) => onSmallPictureSelected(e, "3", lookUpMenuRef, ovalRef, coordsRef, bigImageRef, gameId, thirdSelection, checks, setChecks, seconds, dialogRef, intervalRef, rectangles, setRectangles)} />
        </div>

        <dialog ref={dialogRef}>
            <p>Congrats! You have beaten this game in: {seconds}</p>
            <form action={`http://localhost:3000/newuser?time=` + seconds + "&imageId=" + gameId} 
                method='POST' onSubmit={ async (e)=> {
                    e.preventDefault();
                    //console.log("Submitted @", `http://localhost:3000/newuser?time=` + seconds + "&imageId=" + gameId);

                    const formData = new FormData(e.target);
                    const name = formData.get("name");

                    const response = await fetch(`http://localhost:3000/newuser?time=${seconds}&imageId=${gameId}`, {
                        method: "POST",
                        body: new URLSearchParams({ name }),
                    });

                    const data = await response.json();
                    console.log(data);
                    window.location.href = "/";

                }}>
                <input type="text" placeholder='Nickname' name="name"/>
                <button type='submit'>Add me name to leaderboard</button>
            </form>
            
            <Link to={`/`} >Back to home</Link>
        </dialog>

        
    </>
  )
}

export default Game;

// drags oval after the cursor
function logKey(e, oval, bigImg, lookUpMenuRef) {
    if (lookUpMenuRef.current.style.display == "flex"){
        //console.log("ISSA FLEX");
        return;
    }

    let screenLog = document.querySelector("#screen-log");
    let x = e.clientX - bigImg.left;
    let y = e.clientY - bigImg.top;

    let x2 = e.clientX - bigImg.right;
    let y2 = e.clientY - bigImg.bottom;

    screenLog.innerText = `    Relative X/Y: ${x}, ${y}`;

    if (e.clientX > bigImg.left && e.clientX < bigImg.right && 
        e.clientY > bigImg.top && e.clientY < bigImg.bottom){
      
        (oval.style.display == "") && (oval.style.display = "revert");
    }
    else{
       oval.style.display == "revert" && (oval.style.display = "");
    }

    oval.style.top = `${e.pageY }px`;
    oval.style.left = `${e.pageX }px`;
}


function onOvalClick(e, bigImageRef, setLookUpMenu, lookUpMenuRef, coordsRef){
    let bigImg = bigImageRef.current.getBoundingClientRect();

    let x = e.clientX - bigImg.left;
    let y = e.clientY - bigImg.top;

    let lookUpMenu = lookUpMenuRef.current;

    
    coordsRef.current.x = x;
    coordsRef.current.y = y;
    //console.log("Recorded: ", coordsRef);

    //console.log("Clicked on: ", x, y);
    //console.log(e);

    if (lookUpMenu.style.display == ""){
        lookUpMenu.style.display = "flex";
        lookUpMenu.style.top = `${e.pageY }px`;
        lookUpMenu.style.left = `${e.pageX }px`;
    }
    else{
        //console.log(2222);
        lookUpMenu.style.display = "";
    }

    setLookUpMenu(true);
}

function onBigImageClick(e, lookUpMenuRef, oval){
    //console.log("Reset!");

    lookUpMenuRef.current.style.display = "";

    oval.current.style.top = `${e.pageY }px`;
    oval.current.style.left = `${e.pageX }px`;

}

async function onSmallPictureSelected(e, identifier, lookUpMenuRef, oval, coordsRef, bigImageRef, gameId, topSelectionOption, checks, setChecks, seconds, dialogRef, intervalRef, rectangles, setRectangles){
    //console.log("Clicked on picture:", gameId, "/", identifier, " . With target at: ", coordsRef.current.x, coordsRef.current.y);

    onBigImageClick(e, lookUpMenuRef, oval);

    let coords = getRelativeCoordinates(coordsRef, bigImageRef);

    console.log("XY", coords.x, "  ", coords.y );
    //console.log("Object to be sent: ", {coords, identifier:("" + gameId +  identifier)});
    let imgIdentifier = "" + gameId + identifier

    //console.log("http://localhost:3000/login?identifier=" + imgIdentifier + "&x=" + coords.x + "&y=" + coords.y);
    const res = await fetch("http://localhost:3000/check?identifier=" + imgIdentifier + "&x=" + coords.x + "&y=" + coords.y);
    const data = await res.json();

    //console.log("DATA IS:", data);

    if (data.status == "valid"){
        //topSelectionOption.current.style.border = "solid green 10px";
        checks[identifier] = true;

        addSuccessRectangle(data, setRectangles, rectangles);
        let newChecks = {...checks};

        if (newChecks["1"] && newChecks["2"] && newChecks["3"]){
            
            showWinnerDialogue(seconds, dialogRef, intervalRef);
        }

        setChecks(newChecks);
    }
    else{

    }
}

function getRelativeCoordinates(coordsRef, bigImageRef){
    let clickedX = coordsRef.current.x;
    let clickedY = coordsRef.current.y;

    let bigImg = bigImageRef.current.getBoundingClientRect();

    let topX = bigImg.left;
    let topY = bigImg.top;

    let bottomX = bigImg.right;
    let bottomY = bigImg.bottom;

    let finalX = clickedX / (bottomX - topX);
    let finalY = clickedY / (bottomY - topY);

    return {x:String(finalX).slice(0, 4), y:String(finalY).slice(0, 4)};
}

function showWinnerDialogue(seconds, dialogRef, intervalRef){
    //console.log("ALL GUESSED! AT:", seconds);
    
    clearInterval(intervalRef.current);
    dialogRef.current.showModal();
}

function addSuccessRectangle(data, setRectangles, rectangles){
    console.log("RECTANGLES: ", rectangles);

    let updatedReactangles = [...rectangles, [data.topx, data.topy, data.bottomx, data.bottomy]];

    setRectangles(updatedReactangles);
}