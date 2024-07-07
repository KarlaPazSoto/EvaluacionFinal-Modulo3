const botonConvertir = document.getElementById('botonConvertir');
const resultado = document.getElementById('resultado');
const graficoCanvas = document.getElementById('grafico');

botonConvertir.addEventListener('click', async () => {
  const montoCLP = document.getElementById('ingresoCLP').value;
  const monedaDestino = document.getElementById('selectorMoneda').value;



  if (monedaDestino === "Selecionar Moneda") {
    resultado.textContent = "Por favor, seleccione una moneda.";
    return;
  }

  try {
    const apiUrl = `https://mindicador.cl/api/${monedaDestino.toLowerCase()}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const tipoCambio = parseFloat(data.serie[0].valor);

    const resultadoConversion = montoCLP / tipoCambio;
    resultado.textContent = `$${montoCLP} CLP = $${resultadoConversion.toFixed(3)} ${monedaDestino}`;

    const historial = obtenerHistorialDeAPI(data.serie);

    generarGrafico(historial);

  } catch (error) {
  
    console.error(error);
  }
});

function obtenerHistorialDeAPI(serie) {
  const historial = serie.slice(0, 10).map(data => {
    const fechaAPI = moment(data.fecha).format("DD/MM");
    return { fecha: fechaAPI, valor: parseFloat(data.valor) };
  });
  return historial;
}

function generarGrafico(historial) {
  
  const labels = historial.map(data => data.fecha);
  const valores = historial.map(data => data.valor);
  

  const chart = new Chart(graficoCanvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Historial del tipo de cambio',
        data: valores,
        borderColor: 'blue',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
