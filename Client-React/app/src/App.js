
import './App.css';
import React from 'react';
import Header from './components/Header';
import Madadim from './components/Madadim';

function App() {
  return (

    <div >

      <Header text="Fit-Bestie" />

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
