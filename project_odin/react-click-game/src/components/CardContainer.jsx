export { CardContainer }
import { useEffect, useState } from 'react'

function CardContainer({ updateCurrent, updateBest}){
   let apiUrl = "https://pokeapi.co/api/v2/pokemon";

   let [imageUrls, setImageUrls] = useState([]);
   let [clickedCards, setClickedCards] = useState([]);

    useEffect(()=>{
        getRandomImageUrls(8)
            .then((urls)=>{setImageUrls(urls)});

    },[]);

    function checkClick(imgUrl){

        // already clicked
        if (clickedCards.includes(imgUrl)){
            alert("Your streak ended :(");
            setClickedCards([]);
            updateBest();
        }
        // not yet clicked
        else{
            //shuffle the array
            let newClickedCards = [...clickedCards, imgUrl];
            setClickedCards(newClickedCards);
            // update streak
            updateCurrent();
        }

        let newArray = shuffleIntoNewArray(imageUrls);
        setImageUrls(newArray);
    }

    return<>
        {imageUrls.map((url) => {
            return <img src={url} onClick={() => checkClick(url)}/>
        })
        }
    </>
}

function getTotalNumberOfCards(url){
        return fetch(url)
            .then((response) => {
                return(response.json());
            })
            .then((data) => {
                return data.count;
            })
            .catch((err) => {
                console.log("Problem with fetching API");
            });
}

function getPokemonImageUrl(id){
    let url = `https://pokeapi.co/api/v2/pokemon/${id}/`;

    return fetch(url)
            .then((response) => {
                return(response.json());
            })
            .then((data) => {
                return data.sprites.other["official-artwork"].front_default;
            })
            .catch((err) => {
                console.log("Problem with fetching API");
            });
}

function getRandomImageUrls(count){
    let usedIds = [];
    let promises = [];

    while (usedIds.length < count){
        let id = getRandomPokeminId();

        if (!usedIds.includes(id)){
            usedIds.push(id);
            promises.push(getPokemonImageUrl(id));
        }
    }
    return Promise.all(promises);
}

function getRandomPokeminId(){
    const min = 1;
    const max = 1000;

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleIntoNewArray(array) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

  return newArray;
}