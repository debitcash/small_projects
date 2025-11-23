export { shipFactory };

let shipFactory = function(len, hitNum, sunk){
	
	let length = len;
	let timesHit = hitNum;

	function hit(){
		timesHit += 1;
	};
	
	function isSunk(){
		return length - timesHit === 0;		
	};

	function getTimesHit(){
		return timesHit;
	};

	return { hit, getTimesHit, isSunk };
};

