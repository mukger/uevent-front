import { useState } from "react";
import Checkbox from "../UI/MyCheckbox";
import classes from "./Category.module.css";
const categories = ['conference', 'lecture', 'workshop', 'fest', 'contest', 'concert'];
const thems = ['business', 'politic', 'psychology', 'sport', 'religion'];
let isChange = false;
const CategoryChoose = ({fetchAllEvents, isInit}) => {
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('');
    const [futureEvents, setFutureEvents] = useState(false);
    function handleChooseTheme(e){
        if(isChange){
            e.preventDefault();
            fetchAllEvents(
                1, 
                selectedCategory ? selectedCategory.map(item => '&format=' + item).join('') : '', 
                selectedTheme ? selectedTheme.map(item => '&theme=' + item).join('') : '', 
                1);
            isChange = false;
            isInit = true
        }
    }

    function handleChangeCategory(data, type){
        if(type === 1){
            if(selectedCategory.includes(data)){
                setSelectedCategory(selectedCategory => selectedCategory.filter(item => item !== data))
            }
            else{
                setSelectedCategory(selectedCategory => [...selectedCategory, data])
            }

        }
        else if(type === 2){
            if(selectedTheme.includes(data)){
                setSelectedTheme(selectedTheme => selectedTheme.filter(item => item !== data))
            }
            else{
                setSelectedTheme(selectedTheme => [...selectedTheme, data])
            }
        }
        isChange = true;
    }
    return(
        <div className={classes["filter-container"]}>
            <Checkbox label={'Only active events'} isChecked={futureEvents} setIsChecked={()=>{
                fetchAllEvents(1, null, null, 2, !futureEvents);
                setFutureEvents(futureEvents => !futureEvents);
            }} />
            <div className={classes["checkbox-container"]}>
                
                <form onSubmit={(e) => {e.preventDefault()}} className={classes["category-container"]}>
                    <p className={classes["title-filter"]}>Format</p>
                    {categories.map((category)=>
                        <Checkbox label={category} isChecked={selectedCategory.includes(category)} setIsChecked={()=>{handleChangeCategory(category, 1)}} key={category}/>
                    )}
                </form>
                <form onSubmit={(e) => {e.preventDefault()}} className={classes["theme-container"]}>
                    <p className={classes["title-filter"]}>Theme</p>
                    {thems.map((theme)=>
                        <Checkbox label={theme} isChecked={selectedTheme.includes(theme)} setIsChecked={()=>{handleChangeCategory(theme, 2)}} key={theme}/>
                    )}

                </form> 
            </div>
            <button onClick={handleChooseTheme}>Filter events</button>
        </div>
    );
}

export default CategoryChoose;