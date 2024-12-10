import React, { useEffect, useState } from "react";

import mqtt from "mqtt";


function App() {

const [temperature, setTemperature] = useState(null);

const [humidity, setHumidity] = useState(null);

const [servoState, setServoState] = useState("Desactivado");

const [ledState, setLedState] = useState("Apagado");


useEffect(() => {

// Conectar al broker MQTT en el puerto 8884

const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");


client.on("connect", () => {

console.log("Conectado al broker MQTT");

// Suscribirse a los temas

client.subscribe("wokwi-iot/temperatura");

client.subscribe("wokwi-iot/humedad");

});


client.on("message", (topic, message) => {

const data = parseFloat(message.toString());

if (topic === "wokwi-iot/temperatura") {

setTemperature(data);

setServoState(data > 30 ? "Activado" : "Desactivado");

} else if (topic === "wokwi-iot/humedad") {

setHumidity(data);

setLedState(data > 45 && temperature < 19 ? "Encendido" : "Apagado");

}

});


return () => client.end();

}, [temperature]);


return (

<div style={{ padding: "20px" }}>

<h1>Monitor de ESP32</h1>

<p>Temperatura: {temperature ?? "Esperando datos..."} °C</p>

<p>Humedad: {humidity ?? "Esperando datos..."} %</p>

<p>Estado del Servo: {servoState}</p>

<p>Estado del LED: {ledState}</p>

</div>

);

}


export default App;