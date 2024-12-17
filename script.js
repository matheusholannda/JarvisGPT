//Declaração de variáveis
const endpoint = ""
const apiKey = ""
const deployment = "gpt-35-turbo"
const apiVersion = "2024-08-01-preview"

const secaoConversa = document.getElementById("div_conversa")
const pergunta = document.getElementById("pergunta")

function callAzureOpenAI(pergunta2) {
    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`
    //const url = endpoint + "/openai/deployments/" + deployment + "/chat/completions?api-version=" + apiVersion

    const config = {
        messages: [
            {
                role: "system",
                content: "Você é um assistente de IA que ajuda as pessoas a encontrarem informações. Importante: Suas respostas serão renderizadas em um documento html, portanto, não deve conter uma estrutura de markdown"
            },
            {
                role: "user",
                content: pergunta2
            }
        ],
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0
    }

    try {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify(config)
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.choices && result.choices[0] && result.choices[0].message) {
                    addMessageToChat("div_card_conversa_chat", result.choices[0].message.content)
                } else {
                    throw new Error("Resposta inválida da API.")
                }
            })
            .catch((error) => {
                addMessageToChat("div_card_conversa_chat", "Erro ao buscar resposta: " + error.message)
                console.error("Erro:", error)
            });
    } catch (error) {
        addMessageToChat("div_card_conversa_chat", error)
        console.log(error.message)
    }
}

function addMessageToChat(className, messageContent) {
    secaoConversa.innerHTML += `
    <div class="div_card_conversa ${className}">
        <p>${messageContent}</p>    
    </div>
    `
}

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault(); //Impedine o reload da página

    const userMessage = pergunta.value.trim()

    //Adiciona mensagem do usuário no chat
    addMessageToChat("div_card_conversa_usuario", userMessage)

    //Chama a API para obter a resposta
    callAzureOpenAI(userMessage)

    //Limpa o textarea
    pergunta.value = ""
})