import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import Svg, { Line, Polygon, Text as SvgText, Path } from 'react-native-svg';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { PDFDocument } from 'react-native-pdf-lib';

const GraphScreenCosine = ({ calculateCoordinates }) => {
    const [vectors, setVectors] = useState([]);
    const [magnitude, setMagnitude] = useState('');
    const [direction, setDirection] = useState('');
    const [quadrant, setQuadrant] = useState('');
  
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
    const renderVectorGraphCosine = (vector, index) => {
      const { x, y, calculations } = calculateCoordinates(vector);
    
      const arrowLength = 10; // Longitud de las flechas
      const radius = 50; // Radio del arco
    
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
    
      // Calcular coordenadas para las flechas
      const arrowX1 = vectorEndX - arrowLength * Math.cos(angle - Math.PI / 6);
      const arrowY1 = vectorEndY + arrowLength * Math.sin(angle - Math.PI / 6);
      const arrowX2 = vectorEndX - arrowLength * Math.cos(angle + Math.PI / 6);
      const arrowY2 = vectorEndY + arrowLength * Math.sin(angle + Math.PI / 6);
    
      // Ángulos en grados
      const angleAlfa = vector.direction; // Por ejemplo, 30°
      const angleBeta = 90 - angleAlfa; // Por ejemplo, 60°
    
      return (
        <View key={index} style={styles.vectorContainer}>
          <Svg height="300" width="300">
            {renderCartesianPlane()}
    
            {/* Dibujo del vector */}
            <Line x1="150" y1="150" x2={vectorEndX} y2={vectorEndY} stroke="black" strokeWidth="2" />
            <Polygon points={`${vectorEndX},${vectorEndY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} fill="black" />
    
            {/* Componente X */}
            <Line x1="150" y1="150" x2={arcXAlfaStart} y2={arcYAlfaStart} stroke="red" strokeWidth="2" />
            <Polygon points={`${arcXAlfaStart},${arcYAlfaStart} ${arcXAlfaStart - arrowLength * Math.cos(Math.PI / 6)},${arcYAlfaStart + arrowLength * Math.sin(Math.PI / 6)} ${arcXAlfaStart - arrowLength * Math.cos(-Math.PI / 6)},${arcYAlfaStart + arrowLength * Math.sin(-Math.PI / 6)}`} fill="red" />
    
            {/* Componente Y */}
            <Line x1="150" y1="150" x2={arcXBetaStart} y2={arcYBetaStart} stroke="green" strokeWidth="2" />
            <Polygon
              points={`${arcXBetaStart},${arcYBetaStart} ${arcXBetaStart + arrowLength * Math.sin(Math.PI / 6)},${arcYBetaStart + arrowLength * Math.cos(Math.PI / 6)} ${arcXBetaStart - arrowLength * Math.sin(Math.PI / 6)},${arcYBetaStart + arrowLength * Math.cos(-Math.PI / 6)}`}
              fill="green"
            />
    
            {/* Arco para Alfa */}
            <Path
              d={`M${arcXAlfaStart},${arcYAlfaStart} A${radius},${radius} ${angle * (180 / Math.PI)} 0 1 ${midX},${midY}`}
              stroke="blue"
              strokeWidth="2"
              fill="none"
            />
            {/* Mostrar el valor del ángulo alfa con símbolo griego */}
            <SvgText x={arcXAlfaStart + 10} y={arcYAlfaStart - 30} fontSize="14" fill="darkblue">
              {`α ${angleAlfa}°`}
            </SvgText>
    
            {/* Arco para Beta */}
            <Path
              d={`M${arcXBetaStart},${arcYBetaStart} A${radius},${radius} ${angle * (180 / Math.PI)} 0 1 ${midX},${midY}`}
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
          </View>
  
          {vectors.map((vector, index) => renderVectorGraphCosine(vector, index))}
        </ScrollView>
      </SafeAreaView>
    );
  };
  export default GraphScreenCosine;