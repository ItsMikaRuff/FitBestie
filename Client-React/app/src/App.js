import logo from './logo.svg';
import './App.css';
import React from 'react';

function Hello(props){
    return <h1>Hello, {props.name}</h1>
}

function Button(props){
  return <button className='buttonLogin'>
    {props.text|| 'text'}
  </button>
}

function Header(props){
  return <header className='header1'>{
    props.text || 'Default'}
  
  </header>
}

function Madadim(props){

  return <div className="madadim" > 
    <img className='madadimPic' src={props.img}/>
    <button className='madadButton'>{props.text}</button>
    </div>
}


function App() {
  return (

    <div className="App">   

      <Header text={"FitBestie"}/>

      <Hello name={"Mika"}/>

      <div className='loginDiv'>
      
      <input className='inputLogin' value="username"></input>
      <input className='inputLogin'value="password"></input>
      
      <Button text={"Login"}/>
      <Button text={"create a new user"}/>

      </div>
      <div className='container'>
      
        <Madadim 
        img={"https://www.seekpng.com/png/detail/160-1604583_water-bottle-pose-bottle-of-water-clipart-png.png"}
        text={"DRINK WATER"}
        />
        
        <Madadim  
        img={"https://static.vecteezy.com/system/resources/previews/005/724/676/non_2x/calorie-calculator-line-icon-count-calories-concept-linear-pictogram-calculate-kcal-for-healthy-nutrition-outline-icon-isolated-illustration-vector.jpg"}
        text={"ADD A MEAL"}
        />
        
        <Madadim img={"https://static.vecteezy.com/system/resources/previews/012/654/934/non_2x/illustration-of-woman-in-sportswear-doing-weight-lifting-lifting-weights-suitable-for-the-theme-of-the-gym-sports-fitness-health-beauty-etc-flat-free-vector.jpg"}
        text={"EXCERCISE"}
        />

        <Madadim img="https://media.istockphoto.com/id/1359361392/vector/measuring-waist-with-measuring-tape.jpg?s=612x612&w=0&k=20&c=0YFCKb4_FcpXq3V4lmjmzlPtdRmzFfAfgK1z0JK8k3I="
        text={"MEASUREMENTS"}
        />

      </div>
</div>
  );
}

export default App;
