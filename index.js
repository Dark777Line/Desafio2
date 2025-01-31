document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("Formulario").addEventListener("submit", async function (event) {
        event.preventDefault(); // Impede o envio do formulário

        if (!validateForm()) {
            return;
        }

        // Obtém endereço pelo CEP
        await getAddressByCep();

        // Obtém a previsão do tempo
        await getWeatherByCoordinates();
    });
});

function validateForm() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const cep = document.getElementById('inputCep').value.trim();
    const latitude = document.getElementById('inputLatitude').value.trim();
    const longitude = document.getElementById('inputLongitude').value.trim();

    if (!nome) {
        alert('Por favor, insira seu nome.');
        return false;
    }
    if (!email || !validateEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return false;
    }
    if (!cep || cep.length !== 8 || isNaN(cep)) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return false;
    }
    if (!latitude || isNaN(latitude)) {
        alert('Por favor, insira um valor numérico para a latitude.');
        return false;
    }
    if (!longitude || isNaN(longitude)) {
        alert('Por favor, insira um valor numérico para a longitude.');
        return false;
    }

    return true;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

async function getAddressByCep() {
    const cep = document.getElementById('inputCep').value.trim();
    
    if (!cep || cep.length !== 8 || isNaN(cep)) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error('Erro ao buscar o CEP.');

        const data = await response.json();
        if (data.erro) {
            alert('CEP não encontrado. Tente novamente.');
            return;
        }

        document.getElementById('cep').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = `${data.localidade || ''} - ${data.uf || ''}`;

    } catch (error) {
        console.error('Erro ao consumir a API de CEP:', error);
        alert('Erro ao buscar o CEP. Tente novamente mais tarde.');
    }
}

async function getWeatherByCoordinates() {
    const latitude = document.getElementById('inputLatitude').value.trim();
    const longitude = document.getElementById('inputLongitude').value.trim();

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        alert('Por favor, insira valores válidos para latitude e longitude.');
        return;
    }

    try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Erro ao buscar a previsão do tempo.');

        const data = await response.json();

        if (!data.hourly || !data.hourly.temperature_2m || !data.hourly.relative_humidity_2m) {
            alert('Erro ao obter dados climáticos. Tente novamente.');
            return;
        }

        const temperature = data.hourly.temperature_2m[0]; // Primeira previsão de temperatura
        const humidity = data.hourly.relative_humidity_2m[0]; // Primeira previsão de umidade relativa

        document.getElementById('clima').value = `Temperatura: ${temperature}°C, Umidade: ${humidity}%`;
        
    } catch (error) {
        console.error('Erro ao consumir a API de clima:', error);
        alert('Erro ao buscar a previsão do tempo. Tente novamente mais tarde.');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os links internos do menu de navegação
    const links = document.querySelectorAll("#menu a");

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Previne a navegação padrão

            const targetId = this.getAttribute("href").substring(1); // Obtém o ID do destino
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY;
                
                // Animação de rolagem suave
                window.scrollTo({
                    top: offsetTop - 50, // Ajuste para evitar sobreposição com cabeçalhos fixos
                    behavior: "smooth"
                });
            }
        });
    });
});
