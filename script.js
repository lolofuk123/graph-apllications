
const slider = document.querySelector(".slider"); 
const number = document.querySelector("#number"); 
const sliderValue = document.querySelector(".slider-value");
const sliderCheckbox = document.querySelector("#slider-checkbox"); 
const numberCheckbox = document.querySelector("#number-checkbox"); 
let checkboxes = [sliderCheckbox, numberCheckbox]; 
let evtSource = new EventSource("http://vmzakova.fei.stuba.sk/sse/sse.php"); 
const btn = document.querySelector("button"); 
const graph = document.querySelector(".graph-container"); 
const enableSinus = document.querySelector("#sinus"); 
const enableCosinus = document.querySelector("#cosinus");
enableCosinus.checked = true;
enableSinus.checked = true;

let trace1 = {
    x: [],
    y: [],
    name: "sin(x)",
    type: 'scatter',
    mode: 'lines+markers',
    marker: {
        color: 'rgb(128, 0, 128)',
        size: 5
    },
    line: {
        color: 'rgb(128, 0, 128)',
        width: 2
    }
};
let trace2= {
    x: [],
    y: [],
    name: "cos(x)",
    type: 'scatter',
    mode: 'lines+markers',
    marker: {
        color: 'rgb(50, 230, 0)',
        size: 5
    },
    line: {
        color: 'rgb(50, 230, 0)',
        width: 2
    }
}; 
let layout = {
    autosize: false,
    width: 500,
    height: 500,
    automargin:true,
    plot_bgcolor: '#c7c7c7',
    align:"center",
    xaxis:{
        title: 'X',
        
    },
    yaxis: {
        title: 'Y',
    
    }
  };

//************************** SERVER MESSAGES HANDLING****************************
evtSource.addEventListener("message",  (e) => {
    if(typeof(EventSource) !== 'undefined'){
        var data = JSON.parse(e.data);              // data = object z JSONu

        trace1.x.push(data.x); 
        trace1.y.push(parseFloat(data.y1) * parseFloat(slider.value)); 
        
        trace2.x.push(data.x); 
        trace2.y.push(parseFloat(data.y2) * parseFloat(slider.value)); 

        // console.log(`trace1.y = ${trace1.y[count]}`); 
        // console.log(`data.y1 = ${data.y1}`); 

        // *************************** SHOW/HIDE PLOTS************************************
        var plot= [trace1, trace2]; ;
         if (enableCosinus.checked && enableSinus.checked){
            trace1.visible="visible"; 
            trace2.visible="visible"; 
            console.log("both true"); 
         } else if(enableSinus.checked && !enableCosinus.checked){
            trace1.visible="visible"; 
             trace2.visible="legendonly"; 
            console.log("sinus true"); 
        } else if(!enableSinus.checked && enableCosinus.checked){
            trace1.visible="legendonly"; 
            trace2.visible="visible";
            console.log("cosinus true"); 
        }else{
            console.log("falseeee"); 
            trace1.visible="legendonly"; 
            trace2.visible="legendonly";
        }
        
        Plotly.newPlot(graph, plot, layout, {scrollZoom: true}); 
    }else{
        document.querySelector(".graph-container").innerHTML = "Server error"; 
    }
});

//close stream
btn.addEventListener('click', () => {
    evtSource.close(); 
})

// ********** CHANGING VALUES OF AMPLITUDE ******************************
sliderValue.innerHTML = slider.value; 
slider.addEventListener('input', () => {
    sliderValue.innerHTML = slider.value; 
    number.value = slider.value; 
})

number.addEventListener('change', () => {
    sliderValue.innerHTML = slider.value; 
    if(number.value > 5 || number.value < 0){
        number.value = 1; 
        alert("Amplitúda je povolená v rozmedzí 1-5"); 
    }
    sliderValue.innerHTML = number.value;
    slider.value = number.value; 
})


// ************************ SHOW HIDE SLIDER/NUM************************
sliderCheckbox.addEventListener('change', () => {
    if(sliderCheckbox.checked){
        slider.style.display="inline-block"; 
        number.style.display="none";
        numberCheckbox.checked = false;
    }else{
        slider.style.display="none";
        number.style.display="inline-block";
    }
});

numberCheckbox.addEventListener('change', () => {
    
    if(numberCheckbox.checked){
        sliderCheckbox.checked=false; 
        number.style.display="inline-block"; 
        slider.style.display="none";
    }else{
        number.style.display="none";
        slider.style.display="inline-block";
    }
});
//************************************************************************



