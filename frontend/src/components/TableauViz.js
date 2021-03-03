import React, { useRef, useEffect } from "react";

const { tableau } = window;

function TableauViz() {
    const ref = useRef(null);
    const url = "https://public.tableau.com/views/MQPheatmap/Sheet1";
    // function initViz() {
    //     new tableau.Viz(ref.current, url);
    // }

    // useEffect(() => {
    //     initViz;
    // }, []);
    useEffect(() => {
        const viz = new tableau.Viz(ref.current, url, {
            hideTabs: true,
            hideToolbar: true, 
            // width: "290px", 
            // height: "180px",
        })
        return viz; 
    })

    return (
    <div> 
        <div ref={ref}> 

        </div>
     </div>
    )
}

export default TableauViz; 