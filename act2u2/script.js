document.addEventListener('DOMContentLoaded', () => {
    const imcForm = document.getElementById('imcForm');
    const resultadoElement = document.getElementById('resultado');
    const imagenIMC = document.getElementById('imagenIMC');

    imcForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value);

        imagenIMC.style.display = 'none';
        imagenIMC.src = '';
        resultadoElement.innerText = '';
        resultadoElement.style.backgroundColor = '';
        resultadoElement.classList.remove('underweight', 'normal', 'overweight', 'obese');


        if (altura > 0 && peso > 0) {
            const imc = peso / (altura * altura);

            resultadoElement.innerText = `Tu IMC es: ${imc.toFixed(2)}`;

            let clasificacion = '';
            let colorFondo = '';
            let imagenSrc = '';

            if (imc < 18.5) {
                clasificacion = 'Bajo peso';
                colorFondo = '#ffeb3b';
                imagenSrc = 'img/infrapeso.png';
                resultadoElement.classList.add('underweight');
            } else if (imc >= 18.5 && imc < 25) {
                clasificacion = 'Peso normal';
                colorFondo = '#4caf50';
                imagenSrc = 'img/normal.png';
                resultadoElement.classList.add('normal');
            } else if (imc >= 25 && imc < 30) {
                clasificacion = 'Sobrepeso';
                colorFondo = '#ff9800';
                imagenSrc = 'img/sobrepeso.png';
                resultadoElement.classList.add('overweight');
            } else if (imc >= 30 && imc < 35) {
                clasificacion = 'Obesidad Leve';
                colorFondo = '#f44336';
                imagenSrc = 'img/obesidad.png';
                resultadoElement.classList.add('obese');
            } else {
                clasificacion = 'Obesidad Mórbida';
                colorFondo = '#b71c1c';
                imagenSrc = 'img/obesidadM.png';
                resultadoElement.classList.add('obese');
            }

            resultadoElement.innerText += `\nClasificación: ${clasificacion}`;
            resultadoElement.style.backgroundColor = colorFondo;

            imagenIMC.src = imagenSrc;
            imagenIMC.style.display = 'block';
            imagenIMC.style.width = '150px';
            imagenIMC.style.height = 'auto';
            imagenIMC.style.marginTop = '20px';


        } else {
            resultadoElement.innerText = 'Por favor, ingresa un peso y altura válidos.';
            resultadoElement.style.backgroundColor = '#f8d7da';
        }
    });
});