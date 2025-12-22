function Section({ heading, fields, updateInputFieldValue, index=-1, inputSection, setter}){
	return <div className={heading}  fields={fields}>
		<ul>{fields.map((fieldName) => {
			
			return <li><span>{fieldName}</span><input type="text" onChange={(e)=>{updateInputFieldValue(e, fieldName, index, inputSection, setter)}}/></li>
		}
		)}</ul>
	</div>;
}
export{ Section };
