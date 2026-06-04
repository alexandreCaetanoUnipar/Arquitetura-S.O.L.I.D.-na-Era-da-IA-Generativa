// --- 1. D.I.P. (Dependency Inversion Principle) & S.R.P. (Single Responsibility Principle) ---
// Criamos uma interface para o sistema de cobrança para que o sistema não dependa do Stripe.
interface IMetodoPagamento {
    processar(usuarioId: string, valor: number): void;
}

// Implementação concreta do Stripe
class SistemaCobrancaStripe implements IMetodoPagamento {
    processar(usuarioId: string, valor: number): void {
        console.log(`Cobrando R$${valor} via Stripe do usuário ${usuarioId}`);
    }
}

// Implementação de um novo método (ex: PayPal) sem alterar a lógica central (O.C.P.)
class SistemaCobrancaPayPal implements IMetodoPagamento {
    processar(usuarioId: string, valor: number): void {
        console.log(`Cobrando R$${valor} via PayPal do usuário ${usuarioId}`);
    }
}

// Serviço de cobrança isolado (S.R.P.)
class ServicoFinanceiro {
    constructor(private metodoPagamento: IMetodoPagamento) {}

    executarCobranca(usuarioId: string, valor: number): void {
        this.metodoPagamento.processar(usuarioId, valor);
    }
}

/ --- 2. I.S.P. (Interface Segregation Principle) ---
// Dividimos a interface "faz-tudo" em interfaces menores e específicas.
interface IGeradorTexto {
    gerarTexto(prompt: string): string;
}

interface IGeradorImagem {
    gerarImagem(prompt: string): string;
}

interface IGeradorAudio {
    gerarAudio(prompt: string): string;
}

interface IGeradorVideo { // Novo recurso solicitado
    gerarVideo(prompt: string): string;
}

// --- 4. O.C.P. (Open/Closed Principle) ---
// O Assistente agora é aberto para extensão e fechado para modificação.
// Ele processa qualquer modelo que siga o contrato, sem precisar de if/else para tipos.
class AssistenteOmniIA {
    constructor(private financeiro: ServicoFinanceiro) {}

    // O método agora recebe o modelo e o valor, sem se preocupar com a implementação interna
    processarServico(usuarioId: string, valor: number, acao: () => string): void {
        this.financeiro.executarCobranca(usuarioId, valor);
        console.log(acao());
    }
}

// --- 3. L.S.P. (Liskov Substitution Principle) ---
// As classes agora implementam apenas o que realmente entregam.
class ModeloChatGPT implements IGeradorTexto {
    gerarTexto(prompt: string): string {
        return `Texto gerado pelo ChatGPT: ${prompt}`;
    }
}

class ModeloDallE implements IGeradorImagem {
    gerarImagem(prompt: string): string {
        return `Imagem gerada pelo Dall-E para: ${prompt}`;
    }
}

class ModeloSora implements IGeradorVideo {
    gerarVideo(prompt: string): string {
        return `Vídeo gerado pela Sora: ${prompt}`;
    }
}

// --- EXEMPLO DE USO ---
const pagamentoStripe = new SistemaCobrancaStripe();
const financeiro = new ServicoFinanceiro(pagamentoStripe);
const assistente = new AssistenteOmniIA(financeiro);

const chatGPT = new ModeloChatGPT();
const sora = new ModeloSora();

// Gerando Texto
assistente.processarServico("user_01", 10, () => chatGPT.gerarTexto("Olá, SOLID!"));

// Gerando Vídeo (Novo recurso adicionado sem quebrar o código antigo)
assistente.processarServico("user_02", 50, () => sora.gerarVideo("Um robô programando"));
