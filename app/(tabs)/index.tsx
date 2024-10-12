import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import Svg, { Line, Polygon, Text as SvgText, Path } from 'react-native-svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { PDFDocument } from 'react-native-pdf-lib';
import { Icon } from '@expo/vector-icons/build/createIconSet';

const calculateVectorCoordinatesTraditional = (vector) => {
  const { magnitude, direction, quadrant } = vector;
  const angleRad = (Math.PI / 180) * direction;
  let x = magnitude * Math.cos(angleRad);
  let y = magnitude * Math.sin(angleRad);

  switch (quadrant) {
    case '2':
      x = -x;
      break;
    case '3':
      x = -x;
      y = -y;
      break;
    case '4':
      y = -y;
      break;
  }

  const calculations = [
    `X = ${magnitude} * cos(${direction}°) = ${x.toFixed(2)}`,
    `Y = ${magnitude} * sin(${direction}°) = ${y.toFixed(2)}`,
    `Final X: ${x.toFixed(2)}, Final Y: ${y.toFixed(2)}`,
  ];

  return { x, y, calculations };
};
const calculateVectorCoordinatesCosine = (vector) => {
  const { magnitude, direction, quadrant } = vector;
  const angleRad = (Math.PI / 180) * direction;
  let x = magnitude * Math.cos(angleRad);
  let y = magnitude * Math.sin(angleRad);

  switch (quadrant) {
    case '2':
      x = -x;
      break;
    case '3':
      x = -x;
      y = -y;
      break;
    case '4':
      y = -y;
      break;
  }

  const calculations = [
    `X = ${magnitude} * cos(${direction}°) = ${x.toFixed(2)}`,
    `Y = ${magnitude} * sin(${direction}°) = ${y.toFixed(2)}`,
    `Final X: ${x.toFixed(2)}, Final Y: ${y.toFixed(2)}`,
  ];

  return { x, y, calculations };
};
const calculateVectorCoordinatesAlternative = (vector:any) => {
  const { magnitude, direction, quadrant } = vector;
  const angleRad = (Math.PI / 180) * direction;
  let x = magnitude * Math.cos(angleRad);
  let y = magnitude * Math.sin(angleRad);

  switch (quadrant) {
    case '2':
      x = -x;
      break;
    case '3':
      x = -x;
      y = -y;
      break;
    case '4':
      y = -y;
      break;
  }

  const calculations = [
    `X = ${magnitude} * cos(${direction}°) = ${x.toFixed(2)}`,
    `Y = ${magnitude} * sin(${direction}°) = ${y.toFixed(2)}`,
    `Final X: ${x.toFixed(2)}, Final Y: ${y.toFixed(2)}`,
  ];

  return { x, y, calculations };
};

const GraphScreenCosine = ({ calculateCoordinates }) => {
  const [vectors, setVectors] = useState([]);
  const [magnitude, setMagnitude] = useState('');
  const [direction, setDirection] = useState('');
  const [quadrant, setQuadrant] = useState('');
  const [resultantVector, setResultantVector] = useState(null);

  const addVector = () => {
    if (magnitude && direction && quadrant) {
      const newVector = {
        magnitude: parseFloat(magnitude),
        direction: parseFloat(direction),
        quadrant,
      };
      setVectors([...vectors, newVector]);
      setMagnitude('');
      setDirection('');
      setQuadrant('');
    }
  };

  const deleteVector = (index) => {
    setVectors(vectors.filter((_, i) => i !== index));
  };


  const calculateResultant = () => {
    let sumX = 0;
    let sumY = 0;

    vectors.forEach((vector) => {
      const { x, y } = calculateCoordinates(vector);
      sumX += x;
      sumY += y;
    });
    const resultantMagnitude = Math.sqrt(sumX ** 2 + sumY ** 2);
    const resultantDirection = Math.atan2(sumY, sumX) * (180 / Math.PI); // Convertir a grados
    setResultantVector({ magnitude: resultantMagnitude, direction: resultantDirection, quadrant: 1 }); // Se asume el primer cuadrante
  };


  const renderCartesianPlane = () => (
    <>
      <Line x1="50" y1="150" x2="250" y2="150" stroke="grey" strokeWidth="1" />
      <Line x1="150" y1="50" x2="150" y2="250" stroke="grey" strokeWidth="1" />
      <SvgText x="260" y="150" fontSize="12" textAnchor="middle">X</SvgText>
      <SvgText x="150" y="40" fontSize="12" textAnchor="middle">Y</SvgText>
      {Array.from({ length: 10 }, (_, i) => i * 20 + 50).map((pos) => (
        <React.Fragment key={pos}>
          <Line x1={pos} y1="145" x2={pos} y2="155" stroke="grey" strokeWidth="1" />
          <Line x1="145" y1={pos} x2="155" y2={pos} stroke="grey" strokeWidth="1" />
        </React.Fragment>
      ))}
    </>
  );

  // const renderResultantVector = () => {
  //   if (!resultantVector) return null;
  
  //   const { x, y } = calculateCoordinates(resultantVector); // Calcula las coordenadas del vector resultante
  
  //   return (
  //     <View style={styles.resultContainer}>
  //       <Text>Resultant Vector</Text>
  //       <Svg height="300" width="300">
  //         {renderCartesianPlane()}
          
  //         {/* Graficar el vector resultante */}
  //         <Line x1="150" y1="150" x2={150 + x} y2={150 - y} stroke="blue" strokeWidth="2" />
          
  //         {/* Flecha para el vector resultante */}
  //         <Polygon
  //           points={`
  //             ${150 + x},${150 - y}
  //             ${150 + x - 10 * Math.cos(Math.atan2(y, x) - Math.PI / 6)},${150 - y - 10 * Math.sin(Math.atan2(y, x) - Math.PI / 6)}
  //             ${150 + x - 10 * Math.cos(Math.atan2(y, x) + Math.PI / 6)},${150 - y - 10 * Math.sin(Math.atan2(y, x) + Math.PI / 6)}
  //           `}
  //           fill="blue"
  //         />
  
  //         {/* Etiquetas de magnitud y dirección */}
  //         <SvgText x={150 + x / 2} y={150 - y / 2} fontSize="14" fill="blue">
  //           Magnitude: {resultantVector.magnitude.toFixed(2)}
  //         </SvgText>
  //         <SvgText x={150 + x / 2 + 15} y={150 - y / 2 + 20} fontSize="14" fill="blue">
  //           Direction: {resultantVector.direction.toFixed(2)}°
  //         </SvgText>
  //       </Svg>
  //     </View>
  //   );
  // };
  
  const renderResultantVector = () => {
    if (!resultantVector) return null;
  
    const { x, y } = calculateCoordinates(resultantVector); // Calcula las coordenadas del vector resultante
    const magnitude = resultantVector.magnitude.toFixed(2);
    const direction = resultantVector.direction.toFixed(2);
  
    // Fórmulas
    const formulaX = `X = Magnitude * cos(Direction)`;
    const formulaY = `Y = Magnitude * sin(Direction)`;
    const formulaMagnitude = `Magnitude = √(X² + Y²)`;
    const formulaDirection = `Direction = atan2(Y, X) * (180/π)`;
  
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Resultant Vector</Text>
        <Svg height="300" width="300">
          {renderCartesianPlane()}
          
          {/* Graficar el vector resultante */}
          <Line x1="150" y1="150" x2={150 + x} y2={150 - y} stroke="blue" strokeWidth="2" />
          
          {/* Flecha para el vector resultante */}
          <Polygon
            points={`
              ${150 + x},${150 - y}
              ${150 + x - 10 * Math.cos(Math.atan2(y, x) - Math.PI / 6)},${150 - y - 10 * Math.sin(Math.atan2(y, x) - Math.PI / 6)}
              ${150 + x - 10 * Math.cos(Math.atan2(y, x) + Math.PI / 6)},${150 - y - 10 * Math.sin(Math.atan2(y, x) + Math.PI / 6)}
            `}
            fill="blue"
          />
  
          {/* Etiquetas de magnitud y dirección */}
          <SvgText x={150 + x / 2} y={150 - y / 2} fontSize="14" fill="blue">
            Magnitude: {magnitude}
          </SvgText>
          <SvgText x={150 + x / 2 + 15} y={150 - y / 2 + 20} fontSize="14" fill="blue">
            Direction: {direction}°
          </SvgText>
        </Svg>
  
        {/* Tabla de cálculos */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Calculations</Text>
          <View style={styles.table}>
            <Text style={styles.tableHeader}>Component</Text>
            <Text style={styles.tableHeader}>Value</Text>
  
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>X Component</Text>
              <Text style={styles.tableCell}>{x.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Y Component</Text>
              <Text style={styles.tableCell}>{y.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Magnitude</Text>
              <Text style={styles.tableCell}>{magnitude}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Direction</Text>
              <Text style={styles.tableCell}>{direction}°</Text>
            </View>
          </View>
  
          {/* Fórmulas de cálculo */}
          <Text style={styles.formulasTitle}>Formulas</Text>
          <View style={styles.formulasContainer}>
            <Text style={styles.formulaText}>{formulaX}</Text>
            <Text style={styles.formulaText}>{formulaY}</Text>
            <Text style={styles.formulaText}>{formulaMagnitude}</Text>
            <Text style={styles.formulaText}>{formulaDirection}</Text>
          </View>
  
          {/* Paso a paso del cálculo */}
          <Text style={styles.stepsTitle}>Calculation Steps</Text>
          <View style={styles.stepsContainer}>
            <Text style={styles.stepText}>
              1. **Calculate X Component**: 
              X = Magnitude * cos(Direction) = {magnitude} * cos({direction}°) = {Math.cos(direction * (Math.PI / 180) * magnitude).toFixed(2)}
            </Text>
            <Text style={styles.stepText}>
              2. **Calculate Y Component**: 
              Y = Magnitude * sin(Direction) = {magnitude} * sin({direction}°) = {Math.sin(direction * (Math.PI / 180) * magnitude).toFixed(2)}
            </Text>
            <Text style={styles.stepText}>
              3. **Calculate Magnitude**: 
              Magnitude = √(X² + Y²) = √({x.toFixed(2)}² + {y.toFixed(2)}²) = {magnitude}
            </Text>
            <Text style={styles.stepText}>
              4. **Calculate Direction**: 
              Direction = atan2(Y, X) * (180/π) = atan2({y.toFixed(2)}, {x.toFixed(2)}) * (180/π) = {direction}°
            </Text>
          </View>
        </View>
      </View>
    );
  };
  


  const renderVectorGraphCosine = (vector, index) => {
    const { x, y, calculations } = calculateCoordinates(vector);
  
    const arrowLength = 10; // Longitud de las flechas
    const radius = 20; // Radio del arco
  
    // Calcular el ángulo del vector
    const angle = Math.atan2(-y, x); // Invertido para el sistema de coordenadas
  
    // Coordenadas de la punta del vector
    const vectorEndX = 150 + x;
    const vectorEndY = 150 - y;
  
    // Punto medio del vector
    const midX = 150 + x / 2;
    const midY = 150 - y / 2;
  
    // Coordenadas de inicio del arco para alfa (extremo de la componente X)
    const arcXAlfaStart = 150 + x; 
    const arcYAlfaStart = 150; 
  
    // Coordenadas de inicio del arco para beta (extremo de la componente Y)
    const arcXBetaStart = 150; 
    const arcYBetaStart = 150 - y; 

    const arcX = 150 + radius * Math.cos(-angle);
    const arcY = 150 + radius * Math.sin(angle);


    let cuadrante;
    if (arcX >= 150 && arcY <= 150) {
      cuadrante = 1;  // Primer cuadrante
    } else if (arcX < 150 && arcY <= 150) {
      cuadrante = 2;  // Segundo cuadrante
    } else if (arcX < 150 && arcY > 150) {
      cuadrante = 3;  // Tercer cuadrante
    } else {
      cuadrante = 4;  // Cuarto cuadrante
    }




    const componentX = 10; // Longitud de la flecha en X
    const componentY = 10; // Longitud de la flecha en Y
  
    const downArrow = (
      <Polygon points={`150,${150 - y} ${150 + componentY * Math.sin(Math.PI / 6)},${150 - y - componentY * Math.cos(Math.PI / 6)} ${150 - componentY * Math.sin(Math.PI / 6)},${150 - y - componentY * Math.cos(-Math.PI / 6)}`} fill="green"/>
    );
  
    const upArrow = ( <Polygon
      points={`150,${150 - y} ${150 + componentY * Math.sin(Math.PI / 6)},${150 - y + componentY * Math.cos(Math.PI / 6)} ${150 - componentY * Math.sin(Math.PI / 6)},${150 - y + componentY * Math.cos(-Math.PI / 6)}`}
      fill="green"
    /> )
  
  
  
    let Yarrow;
  
    if(cuadrante == 1 || cuadrante ==2)
      {
        Yarrow = upArrow
      }
    
    else{
        Yarrow = downArrow
    }

    let largeArcFlag = angle > Math.PI ? 1 : 1; // Arco mayor de 180 grados
    let sweepFlag;

    if (cuadrante === 1) {
      largeArcFlag = angle > Math.PI ? 1 : 0; 
      sweepFlag = 1; // Sentido agujas del reloj
    } else {
      sweepFlag = 0; // Sentido contrario
    }

    const angleAlfa = vector.direction;
    let angleAlpha;
    let angleBeta;
    const teta = Math.abs(angle * (180 / Math.PI));  // Convertimos a grados
    
    if (cuadrante === 1) {
      angleAlpha = Math.round(angleAlfa); // Redondeamos al entero más cercano
      angleBeta = Math.round(90 - teta);  // Redondeamos al entero más cercano
    } else if (cuadrante === 2) {
      angleAlpha = Math.round(180 - angleAlfa);  // Redondeamos al entero más cercano
      angleBeta = Math.round(teta - 90);  // Redondeamos al entero más cercano
    } else if (cuadrante === 3) {
      angleAlpha = Math.round(180 + angleAlfa);  // Redondeamos al entero más cercano
      angleBeta = Math.round(teta + 90);  // Redondeamos al entero más cercano
    } else if (cuadrante === 4) {
      angleAlpha = Math.round(360 - angleAlfa);  // Redondeamos al entero más cercano
      angleBeta = Math.round(270 - teta);  // Redondeamos al entero más cercano
    }
    

    const arrowX1 = 150 + x - arrowLength * Math.cos(angle - Math.PI / 6);
    const arrowY1 = 150 - y - arrowLength * Math.sin(angle - Math.PI / 6);
    const arrowX2 = 150 + x - arrowLength * Math.cos(angle + Math.PI / 6);
    const arrowY2 = 150 - y - arrowLength * Math.sin(angle + Math.PI / 6);

  
    // Calcular coordenadas para las flechas
    // const arrowX1 = vectorEndX - arrowLength * Math.cos(angle - Math.PI / 6);
    // const arrowY1 = vectorEndY + arrowLength * Math.sin(angle - Math.PI / 6);
    // const arrowX2 = vectorEndX - arrowLength * Math.cos(angle + Math.PI / 6);
    // const arrowY2 = vectorEndY + arrowLength * Math.sin(angle + Math.PI / 6);
  
    // Ángulos en grados
 // Por ejemplo, 30°
    // const angleBeta = 90 - angleAlfa; // Por ejemplo, 60°


    let arrow;
    const rightArrow = (
      <Polygon
        points={`${150 + x},150 ${150 + x - componentX * Math.cos(Math.PI / 6)},${150 - componentX * Math.sin(Math.PI / 6)} ${150 + x - componentX * Math.cos(-Math.PI / 6)},${150 - componentX * Math.sin(-Math.PI / 6)}`}
        fill="red"
      />
    );
  
    const leftArrow = (
      <Polygon
        points={`${150 + x},150 ${150 + x + componentX * Math.cos(Math.PI / 6)},${150 + componentX * Math.sin(Math.PI / 6)} ${150 + x + componentX * Math.cos(-Math.PI / 6)},${150 + componentX * Math.sin(-Math.PI / 6)}`}
        fill="red"
      />
    );
  
  
    if (Math.abs(angle) < Math.PI / 2) {
      arrow = rightArrow;
    } else {
      arrow = leftArrow;
    }
  
    
    return (
      <View key={index} style={styles.vectorContainer}>
        <Svg height="300" width="300">
          {renderCartesianPlane()}
  
          {/* Dibujo del vector */}
          <Line x1="150" y1="150" x2={vectorEndX} y2={vectorEndY} stroke="black" strokeWidth="2" />
          <Polygon points={`${vectorEndX},${vectorEndY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} fill="black" />
  
          {/* Componente X */}
          <Line x1="150" y1="150" x2={arcXAlfaStart} y2={arcYAlfaStart} stroke="red" strokeWidth="2" />
          {/* <Polygon points={`${arcXAlfaStart},${arcYAlfaStart} ${arcXAlfaStart - arrowLength * Math.cos(Math.PI / 6)},${arcYAlfaStart + arrowLength * Math.sin(Math.PI / 6)} ${arcXAlfaStart - arrowLength * Math.cos(-Math.PI / 6)},${arcYAlfaStart + arrowLength * Math.sin(-Math.PI / 6)}`} fill="red" />
   */}    
          {arrow}
          {/* Componente Y */}
          <Line x1="150" y1="150" x2={arcXBetaStart} y2={arcYBetaStart} stroke="green" strokeWidth="2" />
          {Yarrow}
  
          {/* Arco para Alfa */}
          <Path
            d={`M150,150 
            L${150 + radius},150 
            A${radius},${radius} 0 
            ${largeArcFlag},${sweepFlag} 
            ${arcX},${arcY}`}
            stroke="blue"
            strokeWidth="2"
            fill="none"
          />
          {/* Mostrar el valor del ángulo alfa con símbolo griego */}
          <SvgText x={arcXAlfaStart + 10} y={arcYAlfaStart - 30} fontSize="14" fill="darkblue">
            {`α ${angleAlpha}°`}
          </SvgText>
  
          {/* Arco para Beta */}
          <Path
          d={`M${150},${150 - radius} 
          A${radius},${radius} 1 
          ${angle > Math.PI ? 1 : 0}, ${sweepFlag}
          ${midX},${midY},${1}`}
          stroke="orange"
          strokeWidth="2"
          fill="none"
        />
     
          {/* Mostrar el valor del ángulo beta con símbolo griego */}
          <SvgText x={arcXBetaStart + 10} y={arcYBetaStart + 20} fontSize="14" fill="darkorange">
            {`β ${angleBeta}°`}
          </SvgText>
  
        </Svg>
        {/* Otras partes de tu componente */}
        <Text>Vector {index + 1}</Text>
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Calculations for Vector {index + 1}</Text>
          {calculations.map((calc, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCell}>{calc}</Text>
            </View>
          ))}
        </View>
        <Button title="Remove Vector" onPress={() => deleteVector(index)} />
      </View>
    );
  
  };
  




  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Vector Calculator</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Magnitude:</Text>
          <TextInput
            style={styles.input}
            value={magnitude}
            onChangeText={setMagnitude}
            keyboardType="numeric"
            placeholder="Enter Magnitude"
          />
          <Text style={styles.label}>Direction:</Text>
          <TextInput
            style={styles.input}
            value={direction}
            onChangeText={setDirection}
            keyboardType="numeric"
            placeholder="Enter Direction (degrees)"
          />
          <Text style={styles.label}>Quadrant:</Text>
          <TextInput
            style={styles.input}
            value={quadrant}
            onChangeText={setQuadrant}
            keyboardType="numeric"
            placeholder="Enter Quadrant (1-4)"
          />
        <Button title="Add Vector" onPress={addVector} />
        <hr />
        <Button title="Calculate Resultant Vector" onPress={calculateResultant} />
        {renderResultantVector()}
        </View>

        {vectors.map((vector, index) => renderVectorGraphCosine(vector, index))}
      </ScrollView>
    </SafeAreaView>
  );
};


const GraphScreenTraditional = ({ calculateCoordinates }) => {
  const [vectors, setVectors] = useState([]);
  const [magnitude, setMagnitude] = useState('');
  const [direction, setDirection] = useState('');
  const [quadrant, setQuadrant] = useState('');
  const [resultantVector, setResultantVector] = useState(null);

  const addVector = () => {
    if (magnitude && direction && quadrant) {
      const newVector = {
        magnitude: parseFloat(magnitude),
        direction: parseFloat(direction),
        quadrant,
      };
      setVectors([...vectors, newVector]);
      setMagnitude('');
      setDirection('');
      setQuadrant('');
    }
  };

  const deleteVector = (index) => {
    setVectors(vectors.filter((_, i) => i !== index));
  };

  const renderCartesianPlane = () => (
    <>
      <Line x1="50" y1="150" x2="250" y2="150" stroke="grey" strokeWidth="1" />
      <Line x1="150" y1="50" x2="150" y2="250" stroke="grey" strokeWidth="1" />
      <SvgText x="260" y="150" fontSize="12" textAnchor="middle">X</SvgText>
      <SvgText x="150" y="40" fontSize="12" textAnchor="middle">Y</SvgText>
      {Array.from({ length: 10 }, (_, i) => i * 20 + 50).map((pos) => (
        <React.Fragment key={pos}>
          <Line x1={pos} y1="145" x2={pos} y2="155" stroke="grey" strokeWidth="1" />
          <Line x1="145" y1={pos} x2="155" y2={pos} stroke="grey" strokeWidth="1" />
        </React.Fragment>
      ))}
    </>
  );

  const calculateResultant = () => {
    let sumX = 0;
    let sumY = 0;

    vectors.forEach((vector) => {
      const { x, y } = calculateCoordinates(vector);
      sumX += x;
      sumY += y;
    });
    const resultantMagnitude = Math.sqrt(sumX ** 2 + sumY ** 2);
    const resultantDirection = Math.atan2(sumY, sumX) * (180 / Math.PI); // Convertir a grados
    setResultantVector({ magnitude: resultantMagnitude, direction: resultantDirection, quadrant: 1 }); // Se asume el primer cuadrante
  };

  const renderResultantVector = () => {
    if (!resultantVector) return null;
  
    const { x, y } = calculateCoordinates(resultantVector); // Calcula las coordenadas del vector resultante
    const magnitude = resultantVector.magnitude.toFixed(2);
    const direction = resultantVector.direction.toFixed(2);
  
    // Fórmulas
    const formulaX = `X = Magnitude * cos(Direction)`;
    const formulaY = `Y = Magnitude * sin(Direction)`;
    const formulaMagnitude = `Magnitude = √(X² + Y²)`;
    const formulaDirection = `Direction = atan2(Y, X) * (180/π)`;
  
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Resultant Vector</Text>
        <Svg height="300" width="300">
          {renderCartesianPlane()}
          
          {/* Graficar el vector resultante */}
          <Line x1="150" y1="150" x2={150 + x} y2={150 - y} stroke="blue" strokeWidth="2" />
          
          {/* Flecha para el vector resultante */}
          <Polygon
            points={`
              ${150 + x},${150 - y}
              ${150 + x - 10 * Math.cos(Math.atan2(y, x) - Math.PI / 6)},${150 - y - 10 * Math.sin(Math.atan2(y, x) - Math.PI / 6)}
              ${150 + x - 10 * Math.cos(Math.atan2(y, x) + Math.PI / 6)},${150 - y - 10 * Math.sin(Math.atan2(y, x) + Math.PI / 6)}
            `}
            fill="blue"
          />
  
          {/* Etiquetas de magnitud y dirección */}
          <SvgText x={150 + x / 2} y={150 - y / 2} fontSize="14" fill="blue">
            Magnitude: {magnitude}
          </SvgText>
          <SvgText x={150 + x / 2 + 15} y={150 - y / 2 + 20} fontSize="14" fill="blue">
            Direction: {direction}°
          </SvgText>
        </Svg>
  
        {/* Tabla de cálculos */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Calculations</Text>
          <View style={styles.table}>
            <Text style={styles.tableHeader}>Component</Text>
            <Text style={styles.tableHeader}>Value</Text>
  
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>X Component</Text>
              <Text style={styles.tableCell}>{x.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Y Component</Text>
              <Text style={styles.tableCell}>{y.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Magnitude</Text>
              <Text style={styles.tableCell}>{magnitude}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Direction</Text>
              <Text style={styles.tableCell}>{direction}°</Text>
            </View>
          </View>
  
          {/* Fórmulas de cálculo */}
          <Text style={styles.formulasTitle}>Formulas</Text>
          <View style={styles.formulasContainer}>
            <Text style={styles.formulaText}>{formulaX}</Text>
            <Text style={styles.formulaText}>{formulaY}</Text>
            <Text style={styles.formulaText}>{formulaMagnitude}</Text>
            <Text style={styles.formulaText}>{formulaDirection}</Text>
          </View>
  
          {/* Paso a paso del cálculo */}
          <Text style={styles.stepsTitle}>Calculation Steps</Text>
          <View style={styles.stepsContainer}>
            <Text style={styles.stepText}>
              1. **Calculate X Component**: 
              X = Magnitude * cos(Direction) = {magnitude} * cos({direction}°) = {Math.cos(direction * (Math.PI / 180) * magnitude).toFixed(2)}
            </Text>
            <Text style={styles.stepText}>
              2. **Calculate Y Component**: 
              Y = Magnitude * sin(Direction) = {magnitude} * sin({direction}°) = {Math.sin(direction * (Math.PI / 180) * magnitude).toFixed(2)}
            </Text>
            <Text style={styles.stepText}>
              3. **Calculate Magnitude**: 
              Magnitude = √(X² + Y²) = √({x.toFixed(2)}² + {y.toFixed(2)}²) = {magnitude}
            </Text>
            <Text style={styles.stepText}>
              4. **Calculate Direction**: 
              Direction = atan2(Y, X) * (180/π) = atan2({y.toFixed(2)}, {x.toFixed(2)}) * (180/π) = {direction}°
            </Text>
          </View>
        </View>
      </View>
    );
  };


const renderVectorGraphTraditional = (vector, index) => {
  const { x, y, calculations } = calculateCoordinates(vector);

  // Parámetros para el dibujo de las flechas
  const arrowLength = 10;
  const angle = Math.atan2(-y, x);

  // Coordenadas para las puntas de la flecha del vector resultante
  const arrowX1 = 150 + x - arrowLength * Math.cos(angle - Math.PI / 6);
  const arrowY1 = 150 - y - arrowLength * Math.sin(angle - Math.PI / 6);
  const arrowX2 = 150 + x - arrowLength * Math.cos(angle + Math.PI / 6);
  const arrowY2 = 150 - y - arrowLength * Math.sin(angle + Math.PI / 6);

  // Parámetros para el arco del ángulo
  const radius = 20;
  let arcStartX, arcStartY;
  
  // Posición final del arco dependiendo del ángulo
  const arcX = 150 + radius * Math.cos(-angle);
  const arcY = 150 + radius * Math.sin(angle);

  // Componentes en X e Y
  const componentX = 10; // Longitud de la flecha en X
  const componentY = 10; // Longitud de la flecha en Y

  // Definición de flechas en X
  const rightArrow = (
    <Polygon
      points={`${150 + x},150 ${150 + x - componentX * Math.cos(Math.PI / 6)},${150 - componentX * Math.sin(Math.PI / 6)} ${150 + x - componentX * Math.cos(-Math.PI / 6)},${150 - componentX * Math.sin(-Math.PI / 6)}`}
      fill="red"
    />
  );

  const leftArrow = (
    <Polygon
      points={`${150 + x},150 ${150 + x + componentX * Math.cos(Math.PI / 6)},${150 + componentX * Math.sin(Math.PI / 6)} ${150 + x + componentX * Math.cos(-Math.PI / 6)},${150 + componentX * Math.sin(-Math.PI / 6)}`}
      fill="red"
    />
  );

  // Estado para manejar las flechas de componente

  // Determinación del cuadrante para definir la dirección de la flecha
  if (angle >= 0 && angle < Math.PI / 2) {
    arcStartX = 150 + radius;
    arcStartY = 150;
  } else if (angle >= Math.PI / 2 && angle < Math.PI) {
    arcStartX = 150 - radius;
    arcStartY = 150;
  } else if (angle >= Math.PI && angle < 3 * Math.PI / 2) {
    arcStartX = 150 - radius;
    arcStartY = 150;
  } else {
    arcStartX = 150 + radius;
    arcStartY = 150;
  }

  let arrow;
  // if ((angle*(-1)) < Math.PI/2)
  //   {
  //     arrow = rightArrow
  //   }
  // else if (angle <= -1.6 )
  // {
  //   arrow = leftArrow
  // }

  if (Math.abs(angle) < Math.PI / 2) {
    arrow = rightArrow;
  } else {
    arrow = leftArrow;
  }
  

  let sweep;
  let angleCondition;
  let cuadrante;
  if (arcX >= 150 && arcY <= 150) {
    cuadrante = 1;  // Primer cuadrante
    arcStartX = 150 + radius
    sweep = 0
    angleCondition = angle > 0 ? 1 : 0
    
  } else if (arcX < 150 && arcY <= 150) {
    cuadrante = 2;  // Segundo cuadrante
    arcStartX = 150 - radius
    sweep = 1
    angleCondition = angle > 0 ? 1 : 0
  } else if (arcX < 150 && arcY > 150) {
    cuadrante = 3;  // Tercer cuadrante
    arcStartX = 150 - radius
    sweep = 0
    angleCondition = angle < 0 ? 1 : 0
  } else {
    cuadrante = 4;  // Cuarto cuadrante
    sweep = 1
    angleCondition = angle < 0 ? 1 : 0
  }

  const downArrow = (
    <Polygon points={`150,${150 - y} ${150 + componentY * Math.sin(Math.PI / 6)},${150 - y - componentY * Math.cos(Math.PI / 6)} ${150 - componentY * Math.sin(Math.PI / 6)},${150 - y - componentY * Math.cos(-Math.PI / 6)}`} fill="green"/>
  );

  const upArrow = ( <Polygon
    points={`150,${150 - y} ${150 + componentY * Math.sin(Math.PI / 6)},${150 - y + componentY * Math.cos(Math.PI / 6)} ${150 - componentY * Math.sin(Math.PI / 6)},${150 - y + componentY * Math.cos(-Math.PI / 6)}`}
    fill="green"
  /> )



  let Yarrow;

  if(cuadrante == 1 || cuadrante ==2)
    {
      Yarrow = upArrow
    }
  
  else{
      Yarrow = downArrow
  }


  const midX = (150 + arcStartX) / 2;
  const midY = (150 + arcStartY) / 2;

  // Render del gráfico vectorial
  return (
    <View key={index} style={styles.vectorContainer}>
      <Svg height="300" width="300">
        {renderCartesianPlane()}

        {/* Dibujo del vector resultante */}
        <Line x1="150" y1="150" x2={150 + x} y2={150 - y} stroke="black" strokeWidth="2" />
        <Polygon points={`${150 + x},${150 - y} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} fill="black" />

        {/* Componente X */}
        <Line x1="150" y1="150" x2={150 + x} y2="150" stroke="red" strokeWidth="2" />
        {arrow}

        {/* Componente Y */}
        <Line x1="150" y1="150" x2="150" y2={150 - y} stroke="green" strokeWidth="2" />
        {Yarrow}

        {/* Etiquetas de magnitud y dirección */}
        <SvgText x={150 + x + 10} y={150 - y} fontSize="12" fill="black" textAnchor="start">
          {`Mag: ${vector.magnitude}, Dir: ${vector.direction}°`}
        </SvgText>
        <SvgText x={150 + x + 10} y={150 - y + 15} fontSize="12" fill="black" textAnchor="start">
          {`Angle: ${vector.direction}°`}
        </SvgText>

        {/* Dibujo del arco del ángulo */}
        <Path
          d={`M150,150 
              L${arcStartX},${arcStartY} 
              A${radius},${radius} 1 ,${angleCondition} ${sweep}  
              ${arcX},${arcY}`}
          stroke="blue"
          strokeWidth="2"
          fill="none"
        />
      </Svg>

      {/* Información y controles */}
      <Text>Vector {index + 1}</Text>
      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Calculations for Vector {index + 1}</Text>
        {calculations.map((calc, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={styles.tableCell}>{calc}</Text>
          </View>
        ))}
      </View>
      <Button title="Delete Vector" onPress={() => deleteVector(index)} />
    </View>
  );
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Vector Calculator</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Magnitude:</Text>
          <TextInput
            style={styles.input}
            value={magnitude}
            onChangeText={setMagnitude}
            keyboardType="numeric"
            placeholder="Enter Magnitude"
          />
          <Text style={styles.label}>Direction:</Text>
          <TextInput
            style={styles.input}
            value={direction}
            onChangeText={setDirection}
            keyboardType="numeric"
            placeholder="Enter Direction (degrees)"
          />
          <Text style={styles.label}>Quadrant:</Text>
          <TextInput
            style={styles.input}
            value={quadrant}
            onChangeText={setQuadrant}
            keyboardType="numeric"
            placeholder="Enter Quadrant (1-4)"
          />
          <Button title="Add Vector" onPress={addVector} />
          <hr />
          <Button title="Calculate Resultant Vector" onPress={calculateResultant} />
        {renderResultantVector()}
        </View>

        {vectors.map((vector, index) => renderVectorGraphTraditional(vector, index))}
      </ScrollView>
    </SafeAreaView>
  );
};



const GraphScreenAlternative = ({ calculateCoordinates }) => {
  const [vectors, setVectors] = useState([]);
  const [magnitude, setMagnitude] = useState('');
  const [direction, setDirection] = useState('');
  const [quadrant, setQuadrant] = useState('');
  const [resultantVector, setResultantVector] = useState(null);

  const addVector = () => {
    if (magnitude && direction && quadrant) {
      const newVector = {
        magnitude: parseFloat(magnitude),
        direction: parseFloat(direction),
        quadrant,
      };
      setVectors([...vectors, newVector]);
      setMagnitude('');
      setDirection('');
      setQuadrant('');
    }
  };

  const deleteVector = (index) => {
    setVectors(vectors.filter((_, i) => i !== index));
  };

  const renderCartesianPlane = () => (
    <>
      <Line x1="50" y1="150" x2="250" y2="150" stroke="grey" strokeWidth="1" />
      <Line x1="150" y1="50" x2="150" y2="250" stroke="grey" strokeWidth="1" />
      <SvgText x="260" y="150" fontSize="12" textAnchor="middle">X</SvgText>
      <SvgText x="150" y="40" fontSize="12" textAnchor="middle">Y</SvgText>
      {Array.from({ length: 10 }, (_, i) => i * 20 + 50).map((pos) => (
        <React.Fragment key={pos}>
          <Line x1={pos} y1="145" x2={pos} y2="155" stroke="grey" strokeWidth="1" />
          <Line x1="145" y1={pos} x2="155" y2={pos} stroke="grey" strokeWidth="1" />
        </React.Fragment>
      ))}
    </>
  );



  const calculateResultant = () => {
    let sumX = 0;
    let sumY = 0;

    vectors.forEach((vector) => {
      const { x, y } = calculateCoordinates(vector);
      sumX += x;
      sumY += y;
    });
    const resultantMagnitude = Math.sqrt(sumX ** 2 + sumY ** 2);
    const resultantDirection = Math.atan2(sumY, sumX) * (180 / Math.PI); // Convertir a grados
    setResultantVector({ magnitude: resultantMagnitude, direction: resultantDirection, quadrant: 1 }); // Se asume el primer cuadrante
  };

  const renderResultantVector = () => {
    if (!resultantVector) return null;
  
    const { x, y } = calculateCoordinates(resultantVector); // Calcula las coordenadas del vector resultante
    const magnitude = resultantVector.magnitude.toFixed(2);
    const direction = resultantVector.direction.toFixed(2);
  
    // Fórmulas
    const formulaX = `X = Magnitude * cos(Direction)`;
    const formulaY = `Y = Magnitude * sin(Direction)`;
    const formulaMagnitude = `Magnitude = √(X² + Y²)`;
    const formulaDirection = `Direction = atan2(Y, X) * (180/π)`;
  
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Resultant Vector</Text>
        <Svg height="300" width="300">
          {renderCartesianPlane()}
          
          {/* Graficar el vector resultante */}
          <Line x1="150" y1="150" x2={150 + x} y2={150 - y} stroke="blue" strokeWidth="2" />
          
          {/* Flecha para el vector resultante */}
          <Polygon
            points={`
              ${150 + x},${150 - y}
              ${150 + x - 10 * Math.cos(Math.atan2(y, x) - Math.PI / 6)},${150 - y - 10 * Math.sin(Math.atan2(y, x) - Math.PI / 6)}
              ${150 + x - 10 * Math.cos(Math.atan2(y, x) + Math.PI / 6)},${150 - y - 10 * Math.sin(Math.atan2(y, x) + Math.PI / 6)}
            `}
            fill="blue"
          />
  
          {/* Etiquetas de magnitud y dirección */}
          <SvgText x={150 + x / 2} y={150 - y / 2} fontSize="14" fill="blue">
            Magnitude: {magnitude}
          </SvgText>
          <SvgText x={150 + x / 2 + 15} y={150 - y / 2 + 20} fontSize="14" fill="blue">
            Direction: {direction}°
          </SvgText>
        </Svg>
  
        {/* Tabla de cálculos */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Calculations</Text>
          <View style={styles.table}>
            <Text style={styles.tableHeader}>Component</Text>
            <Text style={styles.tableHeader}>Value</Text>
  
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>X Component</Text>
              <Text style={styles.tableCell}>{x.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Y Component</Text>
              <Text style={styles.tableCell}>{y.toFixed(2)}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Magnitude</Text>
              <Text style={styles.tableCell}>{magnitude}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Direction</Text>
              <Text style={styles.tableCell}>{direction}°</Text>
            </View>
          </View>
  
          {/* Fórmulas de cálculo */}
          <Text style={styles.formulasTitle}>Formulas</Text>
          <View style={styles.formulasContainer}>
            <Text style={styles.formulaText}>{formulaX}</Text>
            <Text style={styles.formulaText}>{formulaY}</Text>
            <Text style={styles.formulaText}>{formulaMagnitude}</Text>
            <Text style={styles.formulaText}>{formulaDirection}</Text>
          </View>
  
          {/* Paso a paso del cálculo */}
          <Text style={styles.stepsTitle}>Calculation Steps</Text>
          <View style={styles.stepsContainer}>
            <Text style={styles.stepText}>
              1. **Calculate X Component**: 
              X = Magnitude * cos(Direction) = {magnitude} * cos({direction}°) = {Math.cos(direction * (Math.PI / 180) * magnitude).toFixed(2)}
            </Text>
            <Text style={styles.stepText}>
              2. **Calculate Y Component**: 
              Y = Magnitude * sin(Direction) = {magnitude} * sin({direction}°) = {Math.sin(direction * (Math.PI / 180) * magnitude).toFixed(2)}
            </Text>
            <Text style={styles.stepText}>
              3. **Calculate Magnitude**: 
              Magnitude = √(X² + Y²) = √({x.toFixed(2)}² + {y.toFixed(2)}²) = {magnitude}
            </Text>
            <Text style={styles.stepText}>
              4. **Calculate Direction**: 
              Direction = atan2(Y, X) * (180/π) = atan2({y.toFixed(2)}, {x.toFixed(2)}) * (180/π) = {direction}°
            </Text>
          </View>
        </View>
      </View>
    );
  };


  const renderVectorGraphAlternative = (vector, index) => {
    const { x, y, calculations } = calculateCoordinates(vector);

    const arrowLength = 10;
    const angle = Math.atan2(-y, x);
    const arrowX1 = 150 + x - arrowLength * Math.cos(angle - Math.PI / 6);
    const arrowY1 = 150 - y - arrowLength * Math.sin(angle - Math.PI / 6);
    const arrowX2 = 150 + x - arrowLength * Math.cos(angle + Math.PI / 6);
    const arrowY2 = 150 - y - arrowLength * Math.sin(angle + Math.PI / 6);

    const radius = 20;
    const arcX = 150 + radius * Math.cos(-angle);
    const arcY = 150 + radius * Math.sin(angle);


    let cuadrante;
    if (arcX >= 150 && arcY <= 150) {
      cuadrante = 1;  // Primer cuadrante
    } else if (arcX < 150 && arcY <= 150) {
      cuadrante = 2;  // Segundo cuadrante
    } else if (arcX < 150 && arcY > 150) {
      cuadrante = 3;  // Tercer cuadrante
    } else {
      cuadrante = 4;  // Cuarto cuadrante
    }

    let angleAlpha;
    const teta = Math.abs(angle * (180 / Math.PI));  // Convertimos a grados

    switch (cuadrante) {
      case 1:
        angleAlpha = teta;
        break;
      case 2:
        angleAlpha = 180 - teta;
        break;
      case 3:
        angleAlpha = 180 + teta;
        break;
      case 4:
        angleAlpha = 360 - teta;
        break;
      default:
        console.error('Cuadrante no válido');
    }
    

    let largeArcFlag = angle > Math.PI ? 1 : 1; // Arco mayor de 180 grados
    let sweepFlag;

    if (cuadrante === 1) {
      largeArcFlag = angle > Math.PI ? 1 : 0; 
      sweepFlag = 0; // Sentido agujas del reloj
    } else {
      sweepFlag = 0; // Sentido contrario
}
    // Componentes en X e Y
    const componentX = 10; // Longitud de la flecha de componente X
    const componentY = 10; // Longitud de la flecha de componente Y

    let arrow;
    const rightArrow = (
      <Polygon points={`${150 + x},150 ${150 + x - componentX * Math.cos(Math.PI / 6)},${150 - componentX * Math.sin(Math.PI / 6)} ${150 + x - componentX * Math.cos(-Math.PI / 6)},${150 - componentX * Math.sin(-Math.PI / 6)}`}fill="red" />
    );
  
    const leftArrow = (
      <Polygon
        points={`${150 + x},150 ${150 + x + componentX * Math.cos(Math.PI / 6)},${150 + componentX * Math.sin(Math.PI / 6)} ${150 + x + componentX * Math.cos(-Math.PI / 6)},${150 + componentX * Math.sin(-Math.PI / 6)}`}
        fill="red"
      />
    );

    const downArrow = (
      <Polygon points={`150,${150 - y} ${150 + componentY * Math.sin(Math.PI / 6)},${150 - y - componentY * Math.cos(Math.PI / 6)} ${150 - componentY * Math.sin(Math.PI / 6)},${150 - y - componentY * Math.cos(-Math.PI / 6)}`} fill="green"/>
    );

    const upArrow = ( <Polygon
      points={`150,${150 - y} ${150 + componentY * Math.sin(Math.PI / 6)},${150 - y + componentY * Math.cos(Math.PI / 6)} ${150 - componentY * Math.sin(Math.PI / 6)},${150 - y + componentY * Math.cos(-Math.PI / 6)}`}
      fill="green"
    /> )
    if (Math.abs(angle) < Math.PI / 2) {
      arrow = rightArrow;
    } else {
      arrow = leftArrow;
    }

    let Yarrow;

    if(cuadrante == 1 || cuadrante ==2)
      {
        Yarrow = upArrow
      }
    
    else{
        Yarrow = downArrow
    }


    const angleAlfa = vector.direction;
    let angleBeta;  // Convertimos a grados
    
    if (cuadrante === 1) {
      angleAlpha = Math.round(angleAlfa); // Redondeamos al entero más cercano // Redondeamos al entero más cercano
    } else if (cuadrante === 2) {
      angleAlpha = Math.round(180 - angleAlfa);  // Redondeamos al entero más cercano
    } else if (cuadrante === 3) {
      angleAlpha = Math.round(180 + angleAlfa);  // Redondeamos al entero más cercano
    } else if (cuadrante === 4) {
      angleAlpha = Math.round(360 - angleAlfa);  // Redondeamos al entero más cercano
    }
    


  
  

    return (
      <View key={index} style={styles.vectorContainer}>
        <Svg height="300" width="300">
          {renderCartesianPlane()}

          {/* Vector Resultante */}
          <Line x1="150" y1="150" x2={150 + x} y2={150 - y} stroke="black" strokeWidth="2" />
          <Polygon points={`${150 + x},${150 - y} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} fill="black" />

          {/* Componente X */}
          <Line x1="150" y1="150" x2={150 + x} y2="150" stroke="red" strokeWidth="2" />
          {arrow}
          {/* Componente Y */}
          <Line x1="150" y1="150" x2="150" y2={150 - y} stroke="green" strokeWidth="2" />
          {Yarrow}
          {/* <Polygon
            points={`150,${150 - y} ${150 + componentY * Math.sin(Math.PI / 6)},${150 - y + componentY * Math.cos(Math.PI / 6)} ${150 - componentY * Math.sin(Math.PI / 6)},${150 - y + componentY * Math.cos(-Math.PI / 6)}`}
            fill="green"
          /> */}
          {/* Etiquetas de Magnitud y Dirección */}
          <SvgText x={150 + x + 10} y={150 - y} fontSize="12" fill="black" textAnchor="start">
            {`Mag: ${vector.magnitude}, Dir: ${vector.direction}°`}
          </SvgText>
          <SvgText x={150 + x + 10} y={150 - y + 15} fontSize="12" fill="black" textAnchor="start">
            {`Angle: ${angleAlpha}°`}
          </SvgText>

          {/* Arco del ángulo */}
          <Path
            d={`M150,150 
            L${150 + radius},150 
            A${radius},${radius} 0 
            ${largeArcFlag},${sweepFlag} 
            ${arcX},${arcY}`}
            stroke="blue"
            strokeWidth="2"
            fill="none"
          />
        </Svg>

        <Text>Vector {index + 1}</Text>
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Calculations for Vector {index + 1}</Text>
          {calculations.map((calc, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCell}>{calc}</Text>
            </View>
          ))}
        </View>
        <Button title="Delete Vector" onPress={() => deleteVector(index)} />
      </View>
    );
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Vector Calculator</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Magnitude:</Text>
          <TextInput
            style={styles.input}
            value={magnitude}
            onChangeText={setMagnitude}
            keyboardType="numeric"
            placeholder="Enter Magnitude"
          />
          <Text style={styles.label}>Direction:</Text>
          <TextInput
            style={styles.input}
            value={direction}
            onChangeText={setDirection}
            keyboardType="numeric"
            placeholder="Enter Direction (degrees)"
          />
          <Text style={styles.label}>Quadrant:</Text>
          <TextInput
            style={styles.input}
            value={quadrant}
            onChangeText={setQuadrant}
            keyboardType="numeric"
            placeholder="Enter Quadrant (1-4)"
          />
          <Button title="Add Vector" onPress={addVector} />
          <hr />
          <Button title="Calculate Resultant Vector"  onPress={calculateResultant} />
        {renderResultantVector()}
        </View>

        {vectors.map((vector, index) => renderVectorGraphAlternative(vector, index))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  vectorContainer: {
    marginBottom: 30,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
  },
  tableHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  formulasTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  formulasContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  formulaText: {
    marginBottom: 5,
    fontSize: 14,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  stepsContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  stepText: {
    marginBottom: 5,
    fontSize: 14,
  },
  setButtons:{
    margin: 'auto',
  }
});

const Tab = createBottomTabNavigator();

const App = () => (
    <Tab.Navigator>
      <Tab.Screen name="Traditional" children={() => <GraphScreenTraditional calculateCoordinates={calculateVectorCoordinatesTraditional}/>} />
      <Tab.Screen name="Cosine" children={() => <GraphScreenCosine calculateCoordinates={calculateVectorCoordinatesCosine} />} />
      <Tab.Screen name="Alternative" children={() => <GraphScreenAlternative calculateCoordinates={calculateVectorCoordinatesAlternative} />} />
    </Tab.Navigator>
);

export default App;
