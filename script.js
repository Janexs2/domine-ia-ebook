document.addEventListener('DOMContentLoaded', function() {
    // Elementos da página
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const salesCounter = document.getElementById('salesCounter');
    const lastPurchase = document.getElementById('lastPurchase');
    const buyButton = document.getElementById('buyButton');
    const quizContainer = document.getElementById('quizContainer');
    
    // Variáveis de gamificação
    let userPoints = 0;
    let salesCount = 1243;
    let lastPurchaseMinutes = 2;
    
    // Simular contador de vendas
    setInterval(() => {
        salesCount += Math.floor(Math.random() * 3);
        salesCounter.textContent = salesCount.toLocaleString('pt-BR');
        
        lastPurchaseMinutes = Math.floor(Math.random() * 5) + 1;
        lastPurchase.textContent = lastPurchaseMinutes;
    }, 60000);
    
    // Barra de progresso interativa
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        
        const adjustedProgress = 25 + (scrollProgress * 0.75); // Começa em 25% e vai até 100%
        progressBar.style.width = `${adjustedProgress}%`;
        
        if (adjustedProgress < 50) {
            progressText.textContent = `${Math.round(adjustedProgress)}% do caminho para dominar a IA!`;
        } else if (adjustedProgress < 75) {
            progressText.textContent = `Continue assim! ${Math.round(adjustedProgress)}% completos!`;
        } else {
            progressText.textContent = `Quase lá! ${Math.round(adjustedProgress)}% - Não pare agora!`;
        }
    });
    
    // Quiz de gamificação
    const quizQuestions = [
        {
            question: "Qual destas NÃO é uma ferramenta de IA?",
            options: ["ChatGPT", "Midjourney", "Photoshop", "Notion AI"],
            correct: 2,
            points: 10
        },
        {
            question: "Para que serve a IA no marketing digital?",
            options: [
                "Apenas para criar textos longos",
                "Automatizar tarefas e gerar insights",
                "Substituir completamente os profissionais",
                "Nenhuma das alternativas"
            ],
            correct: 1,
            points: 15
        },
        {
            question: "Quanto tempo a IA pode economizar para um empreendedor?",
            options: [
                "1-2 horas por semana",
                "5-10 horas por semana",
                "Nenhum tempo, só complica",
                "Mais de 15 horas por semana"
            ],
            correct: 3,
            points: 20
        }
    ];
    
    function renderQuiz() {
        let quizHTML = '';
        
        quizQuestions.forEach((question, index) => {
            quizHTML += `
                <div class="quiz-question" data-points="${question.points}">
                    <h3>${index + 1}. ${question.question}</h3>
                    <div class="quiz-options">
                        ${question.options.map((option, i) => `
                            <button class="quiz-option" data-question="${index}" data-option="${i}">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                    <div class="quiz-feedback" id="feedback-${index}"></div>
                </div>
            `;
        });
        
        quizHTML += `
            <div class="quiz-results">
                <p>Você acumulou <span id="totalPoints">0</span> pontos!</p>
                <p id="discountMessage">Responda todas para ganhar seu desconto!</p>
            </div>
        `;
        
        quizContainer.innerHTML = quizHTML;
        
        // Adicionar eventos aos botões do quiz
        document.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', handleQuizAnswer);
        });
    }
    
    function handleQuizAnswer(e) {
        const questionIndex = parseInt(e.target.getAttribute('data-question'));
        const optionIndex = parseInt(e.target.getAttribute('data-option'));
        const question = quizQuestions[questionIndex];
        const feedbackEl = document.getElementById(`feedback-${questionIndex}`);
        
        // Desativar todos os botões desta questão
        document.querySelectorAll(`[data-question="${questionIndex}"]`).forEach(btn => {
            btn.disabled = true;
        });
        
        if (optionIndex === question.correct) {
            e.target.style.backgroundColor = '#4cd137';
            e.target.style.color = 'white';
            feedbackEl.innerHTML = `<p style="color:#4cd137">✅ Correto! +${question.points} pontos!</p>`;
            userPoints += question.points;
        } else {
            e.target.style.backgroundColor = '#ff4757';
            e.target.style.color = 'white';
            feedbackEl.innerHTML = `<p style="color:#ff4757">❌ Não foi dessa vez! A resposta correta é: ${question.options[question.correct]}</p>`;
        }
        
        // Atualizar pontos totais
        document.getElementById('totalPoints').textContent = userPoints;
        
        // Verificar se todas as questões foram respondidas
        checkQuizCompletion();
    }
    
    function checkQuizCompletion() {
        const answeredQuestions = document.querySelectorAll('.quiz-feedback').length;
        const totalQuestions = quizQuestions.length;
        const discountMessage = document.getElementById('discountMessage');
        
        if (answeredQuestions === totalQuestions) {
            const discount = Math.min(20, Math.floor(userPoints / 5));
            discountMessage.innerHTML = `
                <strong>Parabéns! Você ganhou ${discount}% de desconto!</strong><br>
                Use o cupom: <code>IA${discount}</code> no checkout.
            `;
            
            // Atualizar preço com desconto
            applyDiscount(discount);
        }
    }
    
    function applyDiscount(discount) {
        const originalPrice = 47;
        const discountedPrice = originalPrice * (1 - discount/100);
        
        document.querySelector('.new-price').innerHTML = `
            Por apenas <span style="color:#ff4757">R$ ${discountedPrice.toFixed(2)}</span>
            <small style="font-size:0.8em; color:#777">(${discount}% de desconto)</small>
        `;
    }
    
    // Botão de compra
    buyButton.addEventListener('click', function() {
        // Simular processo de compra
        this.textContent = 'Redirecionando para pagamento...';
        this.disabled = true;
        
        setTimeout(() => {
            alert('Você será redirecionado para a página de pagamento seguro');
            // Aqui você colocaria o link real para o checkout
            // window.location.href = 'https://sualinkdepagamento.com';
        }, 1500);
    });
    
    // Efeito nos cards de benefícios
    document.querySelectorAll('.benefit-card').forEach(card => {
        card.addEventListener('click', function() {
            const points = parseInt(this.getAttribute('data-points'));
            userPoints += points;
            
            // Feedback visual
            this.style.boxShadow = '0 5px 15px rgba(106, 17, 203, 0.3)';
            
            // Criar elemento flutuante de pontos
            const pointsPopup = document.createElement('div');
            pointsPopup.textContent = `+${points} pontos!`;
            pointsPopup.style.position = 'absolute';
            pointsPopup.style.backgroundColor = '#6a11cb';
            pointsPopup.style.color = 'white';
            pointsPopup.style.padding = '5px 10px';
            pointsPopup.style.borderRadius = '20px';
            pointsPopup.style.animation = 'floatUp 1.5s forwards';
            
            this.appendChild(pointsPopup);
            
            setTimeout(() => {
                pointsPopup.remove();
            }, 1500);
        });
    });
    
    // Inicializar quiz
    renderQuiz();
});

// Adicionar animação de flutuação
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { transform: translateY(0); opacity: 1; }
        100% { transform: translateY(-50px); opacity: 0; }
    }
`;
document.head.appendChild(style);