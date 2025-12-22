import './styles/general.css'
import { Section } from './components/Section.jsx'
import { useState } from 'react'

function App() {
  	let[generalSectionInputs, setGeneralSectionInputs] = useState({name:"MAXIM", email:"emmaa", phone:"123"});

	let[educationSectionInputs, setEducationSectionInputs] = useState([{school:"", title:"", date:""}]);

	let[workExperienceSectionInputs, setWorkExperienceSectionInputs] = useState([{company:"", position:"", responsibilities:"", date:""}]);

	function updateGeneralSectionInputs(e, fieldname, index){
		
		let updatedValue = e.target.value;
		setGeneralSectionInputs({ ...generalSectionInputs, [fieldname.toLowerCase()]:updatedValue});

	}

	function updateSectionValues(e, fieldname, index, inputSection=educationSectionInputs, setter=setEducationSectionInputs){
		console.log(inputSection);
		let originalObject = inputSection[index];

		let updatedObject = { ...originalObject, [fieldname.toLowerCase()]:e.target.value}
		
		let newListContainer = [...inputSection];
		newListContainer[index] = updatedObject;
		setter(newListContainer);
	}

	function appendSection(section, setter){
		let newSection = [...section];
		let lastElementCopy = {...section[section.length - 1]};
		newSection.push(lastElementCopy);
		setter(newSection);
	}

	function removeLastSection(section, setter){
		if (section.length < 2)
			return
		let newSection = [...section.slice(0, section.length -1)];
		setter(newSection);
	}

  	return<>
		<div className="inputSections">
			<div>
				<h2>GENERAL INFO</h2>
				<Section fields={["Name","Email","Phone"]} updateInputFieldValue={updateGeneralSectionInputs} />
			</div>

			<div>
				<h2>EDUCATION</h2>
				{educationSectionInputs.map((inputArray, index) =>{
					return <Section fields={["school", "title", "date"]} 
					updateInputFieldValue={updateSectionValues} index={index}/>	
				})}

				<div class="buttonsContainer">
					<button onClick={() => {appendSection(educationSectionInputs, setEducationSectionInputs)}}>Append Education</button>
					<button onClick={() => {removeLastSection(educationSectionInputs, setEducationSectionInputs)}}>Remove Education</button>
				</div>
			</div>

			<div>
				<h2>WORK EXPERIENCE</h2>
				{workExperienceSectionInputs.map((inputArray, index) =>{
					return <Section fields={["company", "position", "responsibilities", "date"]} 
						updateInputFieldValue={updateSectionValues} index={index}
						inputSection={workExperienceSectionInputs} setter={setWorkExperienceSectionInputs}
						/>	
				})}
				
				<div class="buttonsContainer">
					<button onClick={() => {appendSection(workExperienceSectionInputs, setWorkExperienceSectionInputs)}}>Append Work</button>
					<button onClick={() => {removeLastSection(workExperienceSectionInputs, setWorkExperienceSectionInputs)}}>Remove Work</button>
				</div>
			</div>
				<div class="controlButtonsContainer">
					<button onClick={hideResume}>Edit</button>
					<button onClick={revealResume}>Submit</button>
				</div>

		</div>
		
		<div className="output">
			<div class="outputContainer">
				{/*<h2>GENERAL INFO</h2>*/}
				<div>
					<span>{generalSectionInputs.name}</span>
					<span>{generalSectionInputs.email}</span>
					<span>{generalSectionInputs.phone}</span>
				</div>
			</div>

			<div class="outputContainer">
				<h2>EDUCATION</h2>
				{educationSectionInputs.reduce((accumulator, currentValue)=> 
					{accumulator.push(<div><span>{currentValue.school}</span><span>{currentValue.title}</span><span>{currentValue.date}</span></div>); return accumulator;}, [])}
			</div>

			<div class="outputContainer">
				<h2>WORK EXPERIENCE</h2>
				{workExperienceSectionInputs.reduce((accumulator, currentValue)=> 
					{accumulator.push(<div><span>{currentValue.company}</span><span>{currentValue.position}</span><span>{currentValue.responsibilities}</span><span>{currentValue.date}</span></div>); return accumulator;}, [])}			
			</div>
		</div>
	</>
}

function hideResume(){
	let sheet = document.querySelector(".output");
	sheet.classList.remove("revealedSheet");
	sheet.classList.add("hiddenSheet");
}

function revealResume(){
	let sheet = document.querySelector(".output");
	sheet.classList.remove("hiddenSheet");
	sheet.classList.add("revealedSheet");
}

export default App


