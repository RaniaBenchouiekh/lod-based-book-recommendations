import React from 'react';

//The search bar component
const SearchArea = (props)=> {
    return(
        <div className="SearchArea-search">
            <form onSubmit={props.searchBook} action="">
                <input placeholder="Ex. Java, Jane Austen, Graphic Novel..." onChange={props.handleSearch} type="text"></input>
                {
                    props.enableSearch ?
                    <button type="submit" id="SearchArea-submit">Search</button>
                    :
                    <button type="submit" id="SearchArea-submitDisabled">Search</button>
                }
            </form>
        </div>
    )
}
export default SearchArea;